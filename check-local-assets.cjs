const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
// Every page in the site's root, so pages that aren't published (and so
// aren't there) are never checked or named here.
const pages = fs.readdirSync(root).filter((file) => file.endsWith(".html")).sort();

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return fullPath;
  });
}

const cssFiles = walk(path.join(root, "assets"))
  .filter((file) => file.endsWith(".css"))
  .map((file) => path.relative(root, file));

function extractLocalAssetRefs(text) {
  const refs = new Set();
  const patterns = [
    /(?:src|href)="(assets\/[^"]+)"/g,
    /data-poster-url="(assets\/[^"]+)"/g,
    /poster="(assets\/[^"]+)"/g,
    /data-video-urls="([^"]+)"/g,
    /srcset="([^"]+)"/g,
    /url\((?:["']|&quot;)?(\.\.\/[^)"']+|assets\/[^)"']+?)(?:["']|&quot;)?\)/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text))) {
      if (pattern.source.startsWith("srcset") || pattern.source.startsWith("data-video-urls")) {
        for (const candidate of match[1].split(",")) {
          const ref = candidate.trim().split(/\s+/)[0];
          if (ref.startsWith("assets/")) refs.add(ref);
        }
      } else {
        refs.add(match[1]);
      }
    }
  }
  return refs;
}

const missing = [];
const routeProblems = [];
const brokenLinks = [];

for (const file of [...pages, ...cssFiles]) {
  const absolute = path.join(root, file);
  const text = fs.readFileSync(absolute, "utf8");
  for (const ref of extractLocalAssetRefs(text)) {
    const file = ref.split("?")[0]; // drop a ?v= cache-busting version
    const resolved = file.startsWith("../")
      ? path.resolve(path.dirname(absolute), file)
      : path.join(root, file);
    if (!fs.existsSync(resolved)) missing.push(`${file} -> ${ref}`);
  }
}

for (const page of pages) {
  const text = fs.readFileSync(path.join(root, page), "utf8");
  const forbidden = [
    'href="/about"',
    'href="/resume2"',
    'href="/"',
    'href="/featurely"',
    'href="/tmf1"',
    'href="/redlab"',
    'href="/tmf2"',
    'href="/crayon"',
    'href="/lab"',
    'href="https://www.anamitrajana.com/about"',
    'href="https://www.anamitrajana.com/resume2"',
    'href="https://www.anamitrajana.com/featurely"',
    'href="https://www.anamitrajana.com/tmf1"',
    'href="https://www.anamitrajana.com/redlab"',
    'href="https://www.anamitrajana.com/tmf2"',
    'href="https://www.anamitrajana.com/crayon"',
    'href="https://www.anamitrajana.com/lab"',
  ];
  for (const token of forbidden) {
    if (text.includes(token)) routeProblems.push(`${page} contains ${token}`);
  }
  // Links to other pages of the site must point at a page that exists.
  for (const match of text.matchAll(/href="([\w-]+\.html)(?:[#?][^"]*)?"/g)) {
    if (!fs.existsSync(path.join(root, match[1]))) brokenLinks.push(`${page} links to ${match[1]}`);
  }
}

console.log(`Checked ${pages.length} pages and ${cssFiles.length} CSS files.`);
console.log(`Missing local assets: ${missing.length}`);
console.log(`Route problems: ${routeProblems.length}`);
console.log(`Links to missing pages: ${brokenLinks.length}`);

if (missing.length || routeProblems.length || brokenLinks.length) {
  for (const issue of [...missing, ...routeProblems, ...brokenLinks]) console.error(issue);
  process.exit(1);
}
