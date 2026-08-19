import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(root, "css-asset-manifest.tsv");
const localAssetHosts = new Set([
  "cdn.prod.website-files.com",
  "d3e54v103j8qbb.cloudfront.net",
  "cdn.jsdelivr.net",
  "cdnjs.cloudflare.com",
  "ajax.googleapis.com",
  "use.typekit.net",
]);

function isLocalAsset(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && localAssetHosts.has(parsed.hostname);
  } catch {
    return false;
  }
}

function toAssetPath(url) {
  const parsed = new URL(url);
  const decodedPath = decodeURIComponent(parsed.pathname);
  const extension = path.extname(decodedPath) || ".asset";
  const baseName = path.basename(decodedPath, extension) || "asset";
  const safeBaseName = baseName.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "asset";
  const hash = crypto.createHash("sha1").update(parsed.href).digest("hex").slice(0, 10);
  const host = parsed.hostname.replace(/^www\./, "");
  return path.posix.join("assets", host, `${safeBaseName}-${hash}${extension}`);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return fullPath;
  });
}

const cssFiles = walk(path.join(root, "assets")).filter((file) => file.endsWith(".css"));
const urls = new Set();

for (const file of cssFiles) {
  const relCss = path.relative(root, file).split(path.sep).join(path.posix.sep);
  const cssDir = path.posix.dirname(relCss);
  const css = fs.readFileSync(file, "utf8");
  const rewritten = css.replace(
    /url\((["'])(https?:\/\/.*?)\1\)|url\((https?:\/\/[^)]+)\)/g,
    (match, quote, quotedUrl, bareUrl) => {
      const url = quotedUrl || bareUrl;
      if (!isLocalAsset(url)) return match;
      urls.add(url);
      const assetPath = toAssetPath(url);
      const relativeAssetPath = path.posix.relative(cssDir, assetPath);
      return `url("${relativeAssetPath}")`;
    }
  );
  fs.writeFileSync(file, rewritten);
}

fs.writeFileSync(
  manifestPath,
  [...urls]
    .sort()
    .map((url) => `${url}\t${toAssetPath(url)}`)
    .join("\n") + "\n"
);

console.log(`Localized ${cssFiles.length} CSS file(s)`);
console.log(`Found ${urls.size} stylesheet assets`);
