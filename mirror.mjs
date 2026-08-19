import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(root, "asset-manifest.tsv");
const urlListPath = path.join(root, "asset-urls.txt");
const assetsDir = path.join(root, "assets");
const siteOrigin = "https://www.anamitrajana.com";

const pages = [
  { source: "/tmp/anamitrajana-home.html", output: "index.html" },
  { source: "/tmp/anamitrajana-about.html", output: "about.html" },
  { source: "/tmp/anamitrajana-resume2.html", output: "resume2.html" },
  { source: "/tmp/anamitrajana-featurely.html", output: "featurely.html" },
  { source: "/tmp/anamitrajana-tmf1.html", output: "tmf1.html" },
  { source: "/tmp/anamitrajana-redlab.html", output: "redlab.html" },
  { source: "/tmp/anamitrajana-tmf2.html", output: "tmf2.html" },
  { source: "/tmp/anamitrajana-crayon.html", output: "crayon.html" },
];

const routeMap = new Map([
  ["/", "index.html"],
  ["/about", "about.html"],
  ["/resume2", "resume2.html"],
  ["/featurely", "featurely.html"],
  ["/tmf1", "tmf1.html"],
  ["/redlab", "redlab.html"],
  ["/tmf2", "tmf2.html"],
  ["/crayon", "crayon.html"],
  [`${siteOrigin}/`, "index.html"],
  [`${siteOrigin}/about`, "about.html"],
  [`${siteOrigin}/resume2`, "resume2.html"],
  [`${siteOrigin}/featurely`, "featurely.html"],
  [`${siteOrigin}/tmf1`, "tmf1.html"],
  [`${siteOrigin}/redlab`, "redlab.html"],
  [`${siteOrigin}/tmf2`, "tmf2.html"],
  [`${siteOrigin}/crayon`, "crayon.html"],
]);

const preconnectUrls = new Set([
  "https://cdn.prod.website-files.com",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
]);

const localAssetHosts = new Set([
  "cdn.prod.website-files.com",
  "d3e54v103j8qbb.cloudfront.net",
  "cdn.jsdelivr.net",
  "cdnjs.cloudflare.com",
  "ajax.googleapis.com",
  "use.typekit.net",
]);

const assetUrls = new Set();
const cssUrls = new Set();
const scriptUrls = new Set();

function isLocalAsset(url) {
  try {
    const parsed = new URL(url, siteOrigin);
    return parsed.protocol === "https:" && localAssetHosts.has(parsed.hostname);
  } catch {
    return false;
  }
}

function toAssetPath(url) {
  const parsed = new URL(url, siteOrigin);
  const decodedPath = decodeURIComponent(parsed.pathname);
  const extension = path.extname(decodedPath) || ".asset";
  const baseName = path.basename(decodedPath, extension) || "asset";
  const safeBaseName = baseName.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "asset";
  const hash = crypto.createHash("sha1").update(parsed.href).digest("hex").slice(0, 10);
  const host = parsed.hostname.replace(/^www\./, "");
  return path.posix.join("assets", host, `${safeBaseName}-${hash}${extension}`);
}

function remember(url) {
  const absolute = new URL(url, siteOrigin).href;
  if (!isLocalAsset(absolute)) return absolute;
  assetUrls.add(absolute);
  if (absolute.includes(".css")) cssUrls.add(absolute);
  if (absolute.includes(".js")) scriptUrls.add(absolute);
  return toAssetPath(absolute);
}

function rewriteSrcset(srcset) {
  return srcset
    .split(",")
    .map((candidate) => {
      const parts = candidate.trim().split(/\s+/);
      if (!parts[0]) return candidate;
      const rewritten = remember(parts[0]);
      return [rewritten, ...parts.slice(1)].join(" ");
    })
    .join(", ");
}

function rewriteHrefOrSrc(attr, value) {
  if (attr === "href" && preconnectUrls.has(value)) return `${attr}="${value}"`;
  if (routeMap.has(value)) return `${attr}="${routeMap.get(value)}"`;

  if (attr === "href" && value.startsWith("/") && !value.startsWith("//")) {
    const liveRoute = `${siteOrigin}${value}`;
    if (routeMap.has(liveRoute)) return `${attr}="${routeMap.get(liveRoute)}"`;
    return `${attr}="${liveRoute}"`;
  }

  if (!isLocalAsset(value)) return `${attr}="${value}"`;
  return `${attr}="${remember(value)}"`;
}

function rewriteRoutes(html) {
  let output = html;
  for (const [from, to] of [...routeMap.entries()].sort((a, b) => b[0].length - a[0].length)) {
    output = output.replaceAll(`href="${from}"`, `href="${to}"`);
  }
  output = output.replaceAll('href="#" class="grad-bg w-inline-block"><div class="text-block-black-bg">WORK</div>', 'href="index.html" class="grad-bg w-inline-block"><div class="text-block-black-bg">WORK</div>');
  return output;
}

function removeAnalytics(html) {
  return html
    .replace(/<script async="" src="\/g0lnomhfn3mgNjM0OTEwZjFkMmYzYjQzNWFkZmZmNTEz\/81UArgJNxwn9McvebeOwTP7tGj8"><\/script>/g, "")
    .replace(/<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=[^"]+"><\/script>\s*<script>[\s\S]*?gtag\('config', 'G-0R09C01NT9'\);\s*<\/script>/g, "");
}

function makePopupScriptSafe(html) {
  return html.replace(
    /<script>\s*const delay = 3;[\s\S]*?<\/script>/,
    `<script>
const delay = 3;
const popupId = "pop-up-wrapper";

$(document).ready(function() {
  const popup = document.getElementById(popupId);
  if (popup && !Cookies.get("alert")) {
    setTimeout(function() {
      popup.style.display = "flex";
      Cookies.set("alert", true, { expires: 1 });
    }, delay * 1000);
  }
});
</script>`
  );
}

function rewritePage(html) {
  let output = html
    .replace(/<(script|link)\b([^>]*?)\s+(integrity|crossorigin)="[^"]*"([^>]*)>/g, "<$1$2$4>")
    .replace(/<(script|link)\b([^>]*?)\s+(integrity|crossorigin)="[^"]*"([^>]*)>/g, "<$1$2$4>");

  output = removeAnalytics(output);
  output = rewriteRoutes(output);

  output = output
    .replace(/\bsrcset="([^"]+)"/g, (_match, value) => `srcset="${rewriteSrcset(value)}"`)
    .replace(/\b(src|href)="([^"]+)"/g, (_match, attr, value) => rewriteHrefOrSrc(attr, value))
    .replace(/https:\/\/(?:cdn\.prod\.website-files\.com|d3e54v103j8qbb\.cloudfront\.net|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|ajax\.googleapis\.com|use\.typekit\.net)[^"'<>\s,&]+/g, (value) => {
      try {
        return remember(value);
      } catch {
        return value;
      }
    });

  return makePopupScriptSafe(output);
}

fs.mkdirSync(assetsDir, { recursive: true });

for (const page of pages) {
  const html = fs.readFileSync(page.source, "utf8");
  const output = rewritePage(html);
  const outputPath = path.join(root, page.output);
  fs.writeFileSync(outputPath, output);
  console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
}

const sortedAssets = [...assetUrls].sort();
fs.writeFileSync(urlListPath, `${sortedAssets.join("\n")}\n`);
fs.writeFileSync(
  manifestPath,
  sortedAssets.map((url) => `${url}\t${toAssetPath(url)}`).join("\n") + "\n"
);

console.log(`Found ${assetUrls.size} assets (${cssUrls.size} CSS, ${scriptUrls.size} JS)`);
