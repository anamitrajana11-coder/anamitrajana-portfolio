const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const root = __dirname;
const screenshotsDir = path.join(root, "screenshots");
fs.mkdirSync(screenshotsDir, { recursive: true });

const pages = [
  { path: "/", label: "home" },
  { path: "/about.html", label: "about" },
  { path: "/resume2.html", label: "resume" },
];

async function checkViewport(browser, pageInfo, viewportName, viewport) {
  const page = await browser.newPage({ viewport });
  const failedRequests = [];
  const badResponses = [];
  const consoleErrors = [];

  page.on("requestfailed", (request) => {
    failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`);
  });
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto(`http://127.0.0.1:5177${pageInfo.path}`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(3500);

  const visibleBrokenWhileScrolling = [];
  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.max(300, Math.floor(viewport.height * 0.8));
  for (let y = 0; y <= scrollHeight; y += step) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(300);
    const brokenAtPosition = await page.evaluate(() => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      return [...document.images]
        .filter((image) => {
          const rect = image.getBoundingClientRect();
          const style = window.getComputedStyle(image);
          const visible =
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom > 0 &&
            rect.right > 0 &&
            rect.top < viewportHeight &&
            rect.left < viewportWidth &&
            style.display !== "none" &&
            style.visibility !== "hidden";
          return visible && (!image.complete || image.naturalWidth === 0);
        })
        .map((image) => image.currentSrc || image.src);
    });
    if (brokenAtPosition.length > 0) {
      visibleBrokenWhileScrolling.push({ y, brokenImages: brokenAtPosition });
    }
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  const status = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const visibleBrokenImages = [...document.images]
      .filter((image) => {
        const rect = image.getBoundingClientRect();
        const style = window.getComputedStyle(image);
        const visible =
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom > 0 &&
          rect.right > 0 &&
          rect.top < viewportHeight &&
          rect.left < viewportWidth &&
          style.display !== "none" &&
          style.visibility !== "hidden";
        return visible && (!image.complete || image.naturalWidth === 0);
      })
      .map((image) => image.currentSrc || image.src);
    return {
      title: document.title,
      bodyText: document.body.innerText.slice(0, 500),
      imageCount: document.images.length,
      visibleBrokenImages,
      visibleBrokenWhileScrolling: [],
      scrollHeight: document.documentElement.scrollHeight,
    };
  });
  status.visibleBrokenWhileScrolling = visibleBrokenWhileScrolling;

  await page.screenshot({
    path: path.join(screenshotsDir, `${pageInfo.label}-${viewportName}.png`),
    fullPage: false,
  });
  await page.close();

  return { name: `${pageInfo.label}-${viewportName}`, path: pageInfo.path, viewport, failedRequests, badResponses, consoleErrors, status };
}

(async () => {
  const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const browser = await chromium.launch({
    headless: true,
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
  });
  const results = [];
  for (const pageInfo of pages) {
    results.push(await checkViewport(browser, pageInfo, "desktop", { width: 1440, height: 1200 }));
    results.push(await checkViewport(browser, pageInfo, "mobile", { width: 390, height: 1200 }));
  }
  await browser.close();

  const outputPath = path.join(root, "verification.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  for (const result of results) {
    console.log(`${result.name}: ${result.status.title}`);
    console.log(`  images: ${result.status.imageCount}, visible broken: ${result.status.visibleBrokenImages.length}`);
    console.log(`  scroll broken stops: ${result.status.visibleBrokenWhileScrolling.length}`);
    console.log(`  failed requests: ${result.failedRequests.length}`);
    console.log(`  bad responses: ${result.badResponses.length}`);
    console.log(`  console errors: ${result.consoleErrors.length}`);
    console.log(`  scroll height: ${result.status.scrollHeight}`);
  }
})();
