import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Builds the Yanta case-study pages (yanta-*.html) from the Markdown drafts in
// case-studies/, and keeps the Yanta cards in index.html's "Selected works."
// in sync. Only the page copy is used: each draft's notes block above the first
// `---` and its "Working notes" below the last `---` never reach the site.
//
//   node build-case-studies.mjs            the published studies
//   node build-case-studies.mjs --drafts   also the unpublished ones
//
// The drafts folder is git-ignored (it holds internal notes), so run this from
// a checkout that has it. Studies still being written are listed in
// case-studies/unpublished.mjs, not here, so the public repo says nothing
// about them; --drafts builds them too, to preview them locally. A draft's [Visual: …] lines render as placeholders;
// a finished one is an image line, ![alt text](assets/… "Caption"), and
// several images on one line make a row of equal tiles. An image line that
// points at an .mp4 plays it as a looping, muted video. A title starting
// "Credit:" ("Credit: Animation by …") becomes a tag in the image's corner.
// A ### line is a sub-heading inside its ## section.

const root = path.dirname(fileURLToPath(import.meta.url));
const draftsDir = path.join(root, "case-studies");
const shellPage = path.join(root, "lab.html");
const indexPage = path.join(root, "index.html");

const arrow = "assets/cdn.prod.website-files.com/67c3b93e479d760fe2f17a64_Brand-hyperlink-arrow-294a7c5550.png";
// The gallery every Yanta page closes with: the images in this folder, in
// file-name order — 1–5 in row 1, 6–10 in row 2, 11–15 in row 3. Each row
// ends with its first image again, as on the older pages, so a wide window
// never runs out of tiles. A slot with no image yet shows a numbered
// placeholder. Keep the files tile-sized (480 × 360), so nobody can open one
// and read the details.
const galleryDir = "assets/yanta/gallery";
const squareBullet = "assets/cdn.prod.website-files.com/67c7b27105b66f93baf3beb7_square-o-5a223c45ec.png";

// Everyone who can appear in a case study's team, with their photo in
// assets/team/<key>.jpg (240px). A study's `team` lists these keys.
const people = {
  "michael-tai": { name: "Michael Tai", role: "Chief Executive Officer" },
  "ted-netland": { name: "Ted Netland", role: "Chief Financial Officer" },
  "anupam-chowdhury": { name: "Anupam Chowdhury", role: "Head of Data Science" },
  "grace-li": { name: "Grace Li", role: "Marketing Associate" },
  "vinit-vasant-khatavkar": { name: "Vinit Vasant Khatavkar", role: "Senior Software Engineer" },
  "nanguan-lin": { name: "Nanguan Lin", role: "Full-Stack Software Engineer" },
  "abhinav-sriram": { name: "Abhinav Sriram", role: "Software Engineer" },
  "rohith-chimpiri": { name: "Rohith Chimpiri", role: "Software Engineer" },
  "johannes-kung": { name: "Johannes Kung", role: "Chief Science Officer" },
  "mackenzie-bower": { name: "MacKenzie Bower", role: "Associate Principal Engineer" },
  "fan-lu": { name: "Fan Lu", role: "Machine Learning Scientist" },
};

// Homepage card copy is condensed from each draft's Problem/Result lines.
// `team` drives the hover avatars in the page's "Project details": a key from
// `people` above, or a { role } placeholder (neutral avatar, "Name to come")
// until it's known who that was. `heroVideo` (an assets/ path to a 1440 × 582
// MP4) replaces the hero placeholder with a looping video, and `heroImage`
// (same proportions, any image) with a still; `thumbnail` (an
// assets/ path, 3:2, about 1560 × 1040) replaces the homepage card's
// placeholder. A thumbnail can be an .mp4, which always loops muted like a
// GIF; a .jpg of the same name next to it is shown until it plays.
// `nextName` is the one-line name on the previous study's "Next case study"
// card (default: `shortName`). `leadCards` names
// draft sections (## headings) to show as the cards above the body instead of
// the draft's Problem / What I did / Result lines. `gridSections` names sections whose
// ### parts sit two to a row, their texts side by side and the row's 3:2
// visuals below them (one visual, or a part alone in its row, takes the
// full width). `gridPerRow: 1` gives every part a row of its own.
const caseStudies = [
  {
    slug: "yanta-identity",
    source: "cs-01-identity-brand-website-design-system.md",
    shortName: "Identity, website & design system",
    tags: ["PRODUCT", "BRAND/WEB", "DESIGN SYSTEM"],
    summary: "Gave a lab product its name and mark, its public face, and the design system that carries both into code, in one year.",
    impact: "Shipped in three weeks:",
    highlight: "280+ component variants",
    team: ["michael-tai", "ted-netland", "anupam-chowdhury", "vinit-vasant-khatavkar", "abhinav-sriram", "nanguan-lin", "rohith-chimpiri", "grace-li"],
    heroVideo: "assets/yanta/identity-hero.mp4",
    thumbnail: "assets/yanta/identity-thumbnail.webp",
    leadCards: ["The problem", "Constraints", "Approach"],
  },
  {
    slug: "yanta-ask-ai",
    source: "cs-02-ask-ai.md",
    shortName: "Ask AI",
    nextName: "Ask AI / QueryBot",
    leadCards: ["The problem", "The decision", "What I did"],
    gridSections: ["Key design decisions"],
    heroImage: "assets/yanta/ask-ai-hero.jpg",
    thumbnail: "assets/yanta/ask-ai-thumbnail.mp4",
    tags: ["PRODUCT", "B2B", "AI"],
    summary: "Designed an AI assistant that turns scientists' plain-language questions into charts and SQL they can check before saving.",
    impact: "V0 testing –",
    highlight: "87.5/100 on UX-Lite",
    team: ["anupam-chowdhury", "vinit-vasant-khatavkar", "rohith-chimpiri"],
  },
  {
    slug: "yanta-scheduler",
    source: "cs-03-scheduler.md",
    shortName: "Scheduler",
    leadCards: ["The problem", "What I did", "Outcome"],
    gridSections: ["Key design decisions"],
    gridPerRow: 1,
    heroImage: "assets/yanta/scheduler-hero.jpg",
    thumbnail: "assets/yanta/scheduler-thumbnail.mp4",
    tags: ["PRODUCT", "B2B", "SAAS/WEB"],
    summary: "Replaced scattered planning spreadsheets with one scheduler where the plan becomes the batch record, traceable to audit.",
    impact: "V1 testing –",
    highlight: "93.8/100 on UX-Lite",
    team: ["johannes-kung", "anupam-chowdhury", "mackenzie-bower", "vinit-vasant-khatavkar", "abhinav-sriram"],
  },
  {
    slug: "yanta-data-transformer",
    source: "cs-04-data-transformer.md",
    shortName: "Data Transformer",
    leadCards: ["The problem", "What I did", "Outcome"],
    gridSections: ["Key design decisions"],
    gridPerRow: 1,
    heroImage: "assets/yanta/data-transformer-hero.jpg",
    thumbnail: "assets/yanta/data-transformer-thumbnail.jpg",
    tags: ["PRODUCT", "B2B", "AI"],
    summary: "Turned messy instrument exports into one-step uploads: AI reads the file, the scientist checks the graph before saving.",
    impact: "V1 testing –",
    highlight: "91.7/100 on UX-Lite",
    team: ["anupam-chowdhury", "fan-lu", "vinit-vasant-khatavkar", "nanguan-lin"],
  },
];

// The older project pages, after the Yanta studies in homepage order. They are
// the Webflow exports; the build only adds their end-of-page cards (All work /
// Next case study), so every case study leads on to the next one.
const olderStudies = [
  { slug: "featurely", nextName: "Featurely AI" },
  { slug: "tmf1", nextName: "TMF · Pantry check-in" },
  { slug: "redlab", nextName: "Redlab" },
  { slug: "tmf2", nextName: "TMF · Pantry workflow" },
  { slug: "crayon", nextName: "Crayon" },
];

const contextLabels = ["Role", "Company", "Product", "Timeline", "Team"];

// "On this page" entries stay at 1–5 words so the contents column can be
// narrow. tocLabel() shortens headings by rule; these cover headings it
// can't shorten well. Keys are the draft's ## headings, exactly.
const tocLabels = {
  "The first surface of a product-wide assistant": "A product-wide assistant",
  "Nothing touches the workbook until you say so": "Nothing touches the workbook",
  "Make the model and the budget legible": "Legible model and budget",
};

// With --drafts, the unpublished studies join the published ones (after them,
// in their file's order), with their people and contents labels.
const unpublishedFile = path.join(draftsDir, "unpublished.mjs");
if (process.argv.includes("--drafts") && fs.existsSync(unpublishedFile)) {
  const unpublished = await import(pathToFileURL(unpublishedFile));
  Object.assign(people, unpublished.people);
  Object.assign(tocLabels, unpublished.tocLabels);
  caseStudies.push(...unpublished.studies);
}
const allStudies = [...caseStudies, ...olderStudies];

function words(text) {
  return text.trim().split(/\s+/).length;
}

// The part before a colon ("The system: foundations first…" → "The system"),
// the heading itself if it is short, or its first clause.
function tocLabel(heading) {
  if (tocLabels[heading]) return tocLabels[heading];
  if (heading.includes(":")) return heading.split(":")[0].trim();
  if (words(heading) <= 5) return heading;
  const clause = heading.split(",")[0].trim();
  return words(clause) <= 5 ? clause : heading;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inline(markdown) {
  return escapeHtml(markdown)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>');
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function label(text) {
  return `<span class="cs-label">${escapeHtml(text)}<img src="${arrow}" loading="lazy" alt=""/></span>`;
}

// ---------------------------------------------------------------------------
// Draft parsing
// ---------------------------------------------------------------------------

function parseDraft(file) {
  const raw = fs.readFileSync(path.join(draftsDir, file), "utf8");
  const parts = raw.split(/^---\s*$/m);
  if (parts.length < 3) throw new Error(`${file}: expected notes --- page --- credits blocks`);
  const warnings = [];
  const page = { title: "", context: [], status: [], builtWith: "", links: [], tldr: {}, hero: null, sections: [], credits: { role: "", tools: "", notes: [] }, warnings };

  // Paragraphs are blocks of consecutive non-empty lines, except that the
  // TL;DR lines, figure lines and headings always stand on their own.
  // Consecutive "* item" or "1. item" lines make a list.
  const lines = parts[1].split("\n").map((line) => line.trim());
  let paragraph = [];
  let list = null;
  let section = null;

  const flush = () => {
    if (list) {
      if (section) section.blocks.push(list);
      else warnings.push("a list before the first section was skipped");
      list = null;
    }
    if (!paragraph.length) return;
    const text = paragraph.join(" ");
    paragraph = [];
    if (!page.context.length && page.title) {
      page.context = text.split(" · ").map((item) => item.trim());
    } else if (section) {
      section.blocks.push({ type: "p", text });
    } else {
      warnings.push(`text before the first section was skipped: "${text.slice(0, 60)}…"`);
    }
  };

  for (const line of lines) {
    if (!line) { flush(); continue; }
    if (line.startsWith(">")) { flush(); continue; }

    let match;
    if ((match = line.match(/^#\s+(.+)$/))) {
      flush();
      page.title = match[1];
    } else if ((match = line.match(/^###\s+(.+)$/))) {
      flush();
      if (section) section.blocks.push({ type: "h3", text: match[1] });
      else warnings.push(`a sub-heading before the first section was skipped: "${match[1]}"`);
    } else if ((match = line.match(/^##\s+(.+)$/))) {
      flush();
      section = { title: match[1], id: slugify(match[1]), blocks: [] };
      page.sections.push(section);
    } else if ((match = line.match(/^\*\*Status:\*\*\s*(.*?)\s*·\s*\*\*Built with:\*\*\s*(.*)$/))) {
      flush();
      page.status = match[1].split(" · ").map((item) => capitalize(item.trim()));
      const rest = match[2].split(" · ").map((item) => item.trim());
      page.builtWith = rest.shift();
      page.links = rest.map((item) => item.match(/^\[(.+)\]$/)?.[1]).filter(Boolean);
    } else if ((match = line.match(/^\*\*(Problem|What I did|Result)\.\*\*\s*(.*)$/))) {
      flush();
      page.tldr[match[1]] = match[2];
    } else if ((match = line.match(/^\[(Hero|Visual):\s*(.*?)(?:\s*Caption:\s*"(.*)")?\]$/))) {
      flush();
      const figure = { type: "figure", description: capitalize(match[2].trim()), caption: match[3] || "" };
      if (match[1] === "Hero") page.hero = figure;
      else if (section) section.blocks.push(figure);
      else warnings.push("a visual before the first section was skipped");
    } else if (line.startsWith("![")) {
      // Finished visuals: ![alt text](assets/… "Caption"). Several on one
      // line sit side by side as a row of equal tiles. A title that starts
      // with "Credit:" is a tag in the image's corner, not a caption.
      flush();
      const images = [...line.matchAll(/!\[([^\]]*)\]\((\S+)(?:\s+"([^"]*)")?\)/g)].map((m) => {
        const credit = (m[3] || "").match(/^Credit:\s*(.+)/);
        return { src: m[2], alt: m[1], caption: credit ? "" : m[3] || "", credit: credit ? credit[1] : "" };
      });
      const figure = { type: "figure", images, caption: images.map((image) => image.caption).filter(Boolean).join(" ") };
      if (!images.length) warnings.push(`unreadable image line skipped: "${line.slice(0, 60)}…"`);
      else if (section) section.blocks.push(figure);
      else warnings.push("an image before the first section was skipped");
    } else if ((match = line.match(/^(?:([*-])|\d+\.)\s+(.+)$/))) {
      const type = match[1] ? "ul" : "ol";
      if (paragraph.length || (list && list.type !== type)) flush();
      list ??= { type, items: [] };
      list.items.push(match[2]);
    } else {
      if (list) flush();
      paragraph.push(line);
    }
  }
  flush();

  for (const line of parts[2].split("\n").map((l) => l.trim()).filter(Boolean)) {
    const role = line.match(/^Role:\s*(.*)$/);
    if (role) {
      const [roleText, toolsText] = role[1].split(/\s+Tools:\s+/);
      page.credits.role = roleText;
      page.credits.tools = toolsText || "";
    } else {
      page.credits.notes.push(line);
    }
  }

  if (!page.title) warnings.push("no page title found");
  if (page.context.length !== contextLabels.length) warnings.push(`context line has ${page.context.length} parts; expected ${contextLabels.join(" · ")}`);
  for (const s of page.sections) {
    if (words(tocLabel(s.title)) > 5) warnings.push(`contents entry over 5 words — add it to tocLabels: "${s.title}"`);
  }
  return page;
}

// ---------------------------------------------------------------------------
// Page shell (navigation, footer and scripts reused from lab.html)
// ---------------------------------------------------------------------------

function loadShell() {
  const html = fs.readFileSync(shellPage, "utf8");
  const headEnd = html.indexOf("</head>");
  const bodyStart = html.indexOf('<body class="body-13">');
  const midBody = html.indexOf('<section class="mid-body">');
  const footerStart = html.indexOf('<section class="section-33">');
  const scriptsStart = html.indexOf("<script", footerStart);
  if ([headEnd, bodyStart, midBody, footerStart, scriptsStart].includes(-1)) {
    throw new Error("lab.html no longer has the expected nav / mid-body / footer structure");
  }

  const head = html
    .slice(0, headEnd)
    .replace(/<script>\(function\(w,i,g\)[\s\S]*?<\/script>/, "")
    .replace(/<script type="text\/javascript">window\.dataLayer[\s\S]*?<\/script>/, "")
    .replace(/\s*<link rel="stylesheet" href="assets\/cdn\.jsdelivr\.net\/swiper[^>]*>/, "")
    .replace(/\s*<style>[\s\S]*?<\/style>\s*/, "\n");

  const nav = html
    .slice(bodyStart, midBody)
    .replaceAll(' aria-current="page"', "")
    .replaceAll(" w--current", "");

  const footer = html.slice(footerStart, scriptsStart);
  const tail = html.slice(scriptsStart);
  const sources = [...tail.matchAll(/<script src="(assets\/(?:d3e54v103j8qbb\.cloudfront\.net|cdn\.prod\.website-files\.com|cdnjs\.cloudflare\.com\/typed)[^"]+)"[^>]*><\/script>/g)].map((m) => m[1]);
  const typedInit = tail.match(/<script>\s*var typed = new Typed[\s\S]*?<\/script>/)?.[0] || "";
  const scripts = sources.map((src) => `<script src="${src}" type="text/javascript"></script>`).join("") + typedInit;

  return { head, nav, footer, scripts };
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

// An assets/ path with ?v=<content hash>, like the design-system links, so a
// file replaced under the same name isn't served from cache.
function versioned(src) {
  const file = path.join(root, src);
  if (!fs.existsSync(file)) throw new Error(`${src} not found`);
  return `${src}?v=${crypto.createHash("sha1").update(fs.readFileSync(file)).digest("hex").slice(0, 8)}`;
}

function renderFigure(figure, tagText) {
  const img = (image) => {
    const credit = image.credit ? `<span class="cs-tag cs-credit">${inline(image.credit)}</span>` : "";
    if (image.src.endsWith(".mp4")) return renderVideo("figure", image.src, image.alt, credit);
    const tag = `<img src="${versioned(image.src)}" loading="lazy" alt="${escapeHtml(image.alt)}"/>`;
    return credit ? `<div class="cs-figure-media">${tag}${credit}</div>` : tag;
  };
  const visual = figure.images
    ? (figure.images.length > 1 ? `<div class="cs-figure-row">${figure.images.map(img).join("")}</div>` : img(figure.images[0]))
    : `<div class="cs-visual" role="img" aria-label="Placeholder: ${escapeHtml(figure.description)}"><span class="cs-tag">${escapeHtml(tagText)}</span><p class="cs-visual-desc"><b>To show</b>${inline(figure.description)}</p></div>`;
  return `<figure class="cs-figure">${visual}${figure.caption ? `<figcaption>${inline(figure.caption)}</figcaption>` : ""}</figure>`;
}

// ---------------------------------------------------------------------------
// Opening — the same markup as the older project pages (featurely.html,
// tmf1.html): a full-width hero visual, then the orange claim beside
// Company / Role / Product and "Project details" with the team avatars.
// ---------------------------------------------------------------------------

const silhouette = '<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="23" r="10"/><path d="M11 53c2-11 9-16 19-16s17 5 19 16z"/></svg>';

function heading(text) {
  return `<div class="w-layout-hflex flex-block-78"><h1 class="v25-h3">${escapeHtml(text)}</h1><img src="${arrow}" loading="lazy" alt="" class="image-266"/></div>`;
}

function detail(name, value) {
  return `<div class="div-block-460">${heading(name)}<div><p class="v25-h3 grey">${inline(value || "")}</p></div></div>`;
}

// Same structure as the older pages' avatars; the hover card is driven by
// case-study.css (.cs-team) instead of Webflow interactions.
function teamMember(entry) {
  if (typeof entry === "string" && !people[entry]) throw new Error(`team: no person "${entry}" in people`);
  const member = typeof entry === "string" ? { ...people[entry], image: `assets/team/${entry}.jpg` } : entry;
  const title = member.name || member.role;
  const subtitle = member.name ? member.role : "Name to come";
  const avatar = member.image
    ? `<img src="${member.image}" loading="lazy" alt="" class="image-295"/>`
    : `<span class="image-295 cs-avatar-placeholder">${silhouette}</span>`;
  return `<div style="width:50px" class="div-block-504" tabindex="0" aria-label="${escapeHtml(`${title}, ${subtitle}`)}"><div class="w-layout-hflex flex-block-100"><div style="display:none" class="div-block-502"><div class="ms-body-text-1-b black">${escapeHtml(title)}</div><p class="v25-h4 black">${escapeHtml(subtitle)}</p></div><div class="div-block-503">${avatar}</div></div></div>`;
}

function renderHeroVisual(hero) {
  if (!hero) return '<div class="cs-visual cs-visual--hero"><span class="cs-tag">Hero visual · placeholder</span></div>';
  const caption = hero.caption ? `<p class="cs-visual-desc"><b>Caption</b>${inline(hero.caption)}</p>` : "";
  return `<div class="cs-visual cs-visual--hero" role="img" aria-label="Placeholder: ${escapeHtml(hero.description)}"><span class="cs-tag">Hero visual · placeholder</span><p class="cs-visual-desc"><b>To show</b>${inline(hero.description)}</p>${caption}</div>`;
}

// A hero or figure video (`kind`). Muted so browsers allow autoplay;
// design-system/video.js adds click to pause / play. The hero plays at once;
// figure videos load only their size and first frame until video.js starts
// them as they scroll near, so a page of them doesn't download all at once.
function renderVideo(kind, src, label, credit = "") {
  const start = kind === "hero" ? 'autoplay preload="auto"' : 'preload="metadata"';
  return `<div class="cs-${kind}-media"><video class="cs-${kind}-video" src="${versioned(src)}" ${start} muted loop playsinline tabindex="0" aria-label="${escapeHtml(`${label} Click to pause or play.`)}" title="Click to pause or play"></video><span class="cs-tag cs-video-paused" aria-hidden="true">Paused · click to play</span>${credit}</div>`;
}

// The draft's hero description and caption become the hero video's label.
function renderHeroVideo(src, hero) {
  const label = hero ? [hero.caption, hero.description].filter(Boolean).join(" ") : "Project video";
  return renderVideo("hero", src, label);
}

// A timeline in phases, separated by "; " in the draft, puts each phase on
// its own line, below the "Timeline:" label.
function renderTimeline(text) {
  const phases = text.split(/;\s*/);
  return phases.length > 1 ? `<span class="cs-timeline">${phases.map(inline).join("<br/>")}</span>` : inline(text);
}

// A still hero; the draft's hero description is its alt text.
function renderHeroImage(src, hero) {
  return `<div class="cs-hero-media"><img class="cs-hero-image" src="${versioned(src)}" alt="${escapeHtml(hero ? hero.description : "")}" fetchpriority="high"/></div>`;
}

function renderOpening(study, page) {
  const context = Object.fromEntries(contextLabels.map((name, i) => [name, page.context[i]]));
  const team = study.team.map(teamMember).join("");
  const hero = study.heroVideo ? renderHeroVideo(study.heroVideo, page.hero)
    : study.heroImage ? renderHeroImage(study.heroImage, page.hero)
    : renderHeroVisual(page.hero);
  return `<section class="section-36"><section class="tmf-header"><div class="div-block-474">${hero}</div></section>`
    + `<div class="columns-36 w-row"><div class="column-67 w-col w-col-5"><div class="div-block-454"><h1 class="ms-heading-2 orange">${inline(page.title)}</h1></div></div>`
    + `<div class="column-68 w-col w-col-3"><div class="div-block-459">${detail("Company", context.Company)}${detail("Role", capitalize(context.Role || ""))}${detail("Product", context.Product)}</div></div>`
    + `<div class="w-col w-col-4"><div class="div-block-473"><div>${heading("Project details")}</div><div class="w-layout-vflex flex-block-98">`
    + `<div class="frame-2"><div class="frame-4"><div class="ms-body-text-1 ocp75"><span class="text-span-1049">Timeline:  </span>${renderTimeline(context.Timeline || "")}</div></div></div>`
    + `<div class="div-block-486"><div class="frame-2"><div class="frame-4"><div class="ms-body-text-1 ocp75"><span class="text-span-1049">Team (hover for details): </span></div><div class="div-block-505"><div class="w-layout-hflex team-flex-block cs-team${study.team.length > 6 ? " cs-team--rows" : ""}">${team}</div></div></div></div></div>`
    + `</div></div></div></div></section>`;
}

// "**Website.** Visibility was…": the lead-in becomes the item's title line,
// as on the older pages' cards.
// A card list item: **Lead.** then its text beneath. A {Status} after the lead
// becomes a status tag beside it ({Live} with a pulsing dot), and a
// [View](https://…) link a button there that opens in a new tab.
function leadCardItem(item) {
  const match = item.match(/^\*\*(.+?)\.?\*\*\s*(.*)$/);
  if (!match) return `<li><span>${inline(item)}</span></li>`;
  const status = match[2].match(/\{([^}]+)\}/);
  const link = match[2].match(/\[([^\]]+)\]\((https?:[^)\s]+)\)/);
  const text = match[2].replace(status?.[0] ?? "", "").replace(link?.[0] ?? "", "").trim();
  const extras = (status ? `<span class="cs-tag cs-tag--status${/^live$/i.test(status[1]) ? " cs-tag--live" : ""}">${escapeHtml(status[1])}</span>` : "")
    + (link ? `<a class="cs-tag cs-tag--link" href="${escapeHtml(link[2])}" target="_blank" rel="noopener">${escapeHtml(link[1])}${ctaArrow}</a>` : "");
  const lead = `<strong>${inline(match[1])}</strong>`;
  return `<li>${extras ? `<div class="cs-tldr-head">${lead}${extras}</div>` : lead}${text ? `<span>${inline(text)}</span>` : ""}</li>`;
}

function renderLeadCard(section, last) {
  const blocks = section.blocks.map((block) => {
    if (block.type === "p") return `<p>${inline(block.text)}</p>`;
    if (block.type === "ul" || block.type === "ol") return `<${block.type} class="cs-tldr-list">${block.items.map(leadCardItem).join("")}</${block.type}>`;
    throw new Error(`lead card "${section.title}" can't hold a visual`);
  });
  return `<div class="cs-tldr-item${last ? " cs-tldr-item--result" : ""}">${label(section.title)}${blocks.join("")}</div>`;
}

// The cards above the body: the study's `leadCards` sections, or else the
// draft's Problem / What I did / Result lines.
function renderSummary(study, page) {
  if (study.leadCards) {
    const cards = study.leadCards.map((title) => page.sections.find((s) => s.title === title));
    return `<section class="cs-tldr${cards.length === 3 ? "" : ` cs-tldr--${cards.length}`}" aria-label="Summary">${cards.map((s, i) => renderLeadCard(s, i === cards.length - 1)).join("")}</section>`;
  }
  return `<section class="cs-tldr" aria-label="Summary">
<div class="cs-tldr-item">${label("Problem")}<p>${inline(page.tldr["Problem"] || "")}</p></div>
<div class="cs-tldr-item">${label("What I did")}<p>${inline(page.tldr["What I did"] || "")}</p></div>
<div class="cs-tldr-item cs-tldr-item--result">${label("Result")}<p>${inline(page.tldr["Result"] || "")}</p></div>
</section>`;
}

function bodySections(study, page) {
  return page.sections.filter((s) => !study.leadCards?.includes(s.title));
}

// ---------------------------------------------------------------------------
// Closing — the same markup as the older project pages (featurely.html): a
// gallery whose rows drift sideways as the page scrolls (design-system/
// gallery.js; Webflow ties its own version to each page) and fades into
// "Curious about the journey?" with the Let's talk button.
// ---------------------------------------------------------------------------

function renderGallery() {
  const dir = path.join(root, galleryDir);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((file) => /\.(jpe?g|png|webp|avif)$/i.test(file)).sort() : [];
  const tile = (i) => `<div class="utility-aspect-1x1">${files[i]
    ? `<img src="${versioned(`${galleryDir}/${files[i]}`)}" loading="lazy" alt="" class="utility-image-cover"/>`
    : `<div class="cs-gallery-slot"><span class="cs-tag">Image ${String(i + 1).padStart(2, "0")}</span></div>`}</div>`;
  const row = (name, first) => `<div class="w-layout-grid grid-layout desktop-10-column grid-gap-s ${name}">${[0, 1, 2, 3, 4, 0].map((i) => tile(first + i)).join("")}</div>`;
  return `<section class="section-47 cs-closing"><div class="w-layout-vflex flex-block-115"><section class="section-22 utility-overflow-hidden"><div class="div-block-546"><div class="w-layout-grid grid-layout desktop-1-column grid-gap-s cs-gallery">${row("_01", 0)}${row("_02", 5)}${row("_01", 10)}</div><div class="div-block-547"></div></div></section></div></section>`;
}

// The filter gives the button its gooey join between label and arrow.
const ctaButtonFilter = '<svg width="0" height="0" class="absolute hidden" color-interpolation-filters="sRGB"><defs><filter id="buttonFilter"><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"></feGaussianBlur><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="buttonFilter"></feColorMatrix><feComposite in="SourceGraphic" in2="buttonFilter" operator="atop"></feComposite><feBlend in="SourceGraphic" in2="buttonFilter"></feBlend></filter></defs></svg>';
const ctaArrow = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" class="iconify iconify--tabler" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 7L7 17M8 7h9v9"></path></svg>';

function renderCta() {
  return `<section class="section-37 cs-cta"><div class="div-block-495"><div class="div-block-494"><div class="div-block-496"><div class="div-block-497"><h1 class="ms-heading-2 ca">Curious about the journey? Let’s dive deeper</h1></div><div class="div-block-498"><p class="ms-body-text-1 ocp50 ca">This showcase is merely a glimpse; the true essence lies in the journey itself. If you&#x27;re intrigued, let&#x27;s chat—I’ll happily share insights, challenges, and even some juicy gossip from behind the scenes.</p></div><div class="div-block-499"><a href="mailto:anamitrajana@outlook.com?subject=Lets%20connect" class="button-1 w-inline-block"><div class="svg-filter_embed w-embed">${ctaButtonFilter}</div><div class="button-1_content-wrap"><div class="ms-body-text-1-b black">Let’s talk</div></div><div class="button-1_arrow-wrapper"><div class="button_arrow-icon w-embed">${ctaArrow}</div></div></a></div></div></div></div></section>`;
}

// The two cards that end every case study: All work (the homepage) and the
// next study in homepage order, named in one line.
function renderPager(study) {
  const at = allStudies.findIndex((s) => s.slug === study.slug);
  const next = allStudies[(at + 1) % allStudies.length];
  return `<nav class="cs-pager" aria-label="More work"><a class="cs-next cs-next--back" href="index.html"><span><span class="cs-tag">All work</span><span class="cs-next-title">Back to Selected works</span></span><img class="cs-next-arrow" src="${arrow}" loading="lazy" alt=""/></a>`
    + `<a class="cs-next" href="${next.slug}.html"><span><span class="cs-tag">Next case study</span><span class="cs-next-title">${escapeHtml(next.nextName || next.shortName)}</span></span><img class="cs-next-arrow" src="${arrow}" loading="lazy" alt=""/></a></nav>`;
}

function renderPage(study, page, index, shell) {
  const body = bodySections(study, page);
  let visualCount = 1;

  const renderBlock = (block) => {
    if (block.type === "p") return `<p>${inline(block.text)}</p>`;
    if (block.type === "h3") return `<h3>${inline(block.text)}</h3>`;
    if (block.type === "ul" || block.type === "ol") return `<${block.type} class="cs-list">${block.items.map((item) => `<li>${inline(item)}</li>`).join("")}</${block.type}>`;
    visualCount += 1;
    return renderFigure(block, `Visual ${visualCount} · placeholder`);
  };
  // A `gridSections` section: its intro, then its ### parts two to a row,
  // their headings and text side by side and the row's visuals below them.
  // Each part's visual follows its own text, so on phones they stay together.
  const renderGrid = (blocks) => {
    const intro = [];
    const parts = [];
    for (const block of blocks) {
      if (block.type === "h3") parts.push({ title: block.text, blocks: [] });
      else if (parts.length) parts.at(-1).blocks.push(block);
      else intro.push(block);
    }
    const part = ({ title, blocks }) => {
      const visuals = blocks.filter((b) => b.type === "figure").map(renderBlock).join("");
      const text = blocks.filter((b) => b.type !== "figure").map(renderBlock).join("");
      return `<div class="cs-subgrid-text"><h3>${inline(title)}</h3>${text}</div>${visuals}`;
    };
    const perRow = study.gridPerRow || 2;
    const rows = [];
    for (let i = 0; i < parts.length; i += perRow) rows.push(`<div class="cs-subgrid-row">${parts.slice(i, i + perRow).map(part).join("")}</div>`);
    return intro.map(renderBlock).join("") + `<div class="cs-subgrid">${rows.join("")}</div>`;
  };

  const sections = body.map((section) => {
    const blocks = study.gridSections?.includes(section.title) ? renderGrid(section.blocks) : section.blocks.map(renderBlock).join("");
    return `<section class="cs-section" id="${section.id}"><h2>${inline(section.title)}</h2>${blocks}</section>`;
  });

  const toc = body.map((s) => `<li><a href="#${s.id}" title="${escapeHtml(s.title)}">${inline(tocLabel(s.title))}</a></li>`).join("");
  const links = page.links.map((text) => `<span class="cs-tag cs-tag--pending" title="Link to come">${escapeHtml(text)}</span>`).join("");
  // A draft without a **Status:** line (Identity) gets no Status / Built with box.
  const status = page.status.length
    ? `<div class="cs-status"><div>${label("Status")}<ul>${page.status.map((s) => `<li>${inline(s)}</li>`).join("")}</ul></div><div>${label("Built with")}<p>${inline(page.builtWith)}</p>${links ? `<div class="cs-links">${links}</div>` : ""}</div></div>\n`
    : "";
  const tools = page.credits.tools ? `${label("Tools")}<p>${inline(page.credits.tools)}</p>` : "";
  const notes = page.credits.notes.map((note) => `<p class="cs-note">${inline(note)}</p>`).join("");
  // A draft with an empty credits block gets no "Role & team" footer.
  const credits = page.credits.role || notes ? `\n<footer class="cs-credits">${label("Role & team")}<p>${inline(page.credits.role)}</p>${tools}<span></span><div>${notes}</div></footer>` : "";

  const main = `<section class="mid-body">
${renderOpening(study, page)}
<main class="section-36 cs">
${status}${renderSummary(study, page)}
<div class="cs-body">
<nav class="cs-toc" aria-label="On this page">${label("On this page")}<ol>${toc}</ol></nav>
<article class="cs-article">${sections.join("\n")}</article>
</div>${credits}
${renderGallery()}
${renderCta()}
${renderPager(study)}
</main>
</section>`;

  const title = `${study.shortName} · Yanta case study`;
  const head = shell.head
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title><meta content="${escapeHtml(study.summary)}" name="description"/>`)
    .replace(/<meta content="[^"]*" property="og:title"\/>/, `<meta content="${escapeHtml(title)}" property="og:title"/>`)
    .replace(/<meta content="[^"]*" name="twitter:title"\/>/, `<meta content="${escapeHtml(title)}" name="twitter:title"/>`);

  return `${head}<link href="design-system/tokens.css" rel="stylesheet" type="text/css"/><link href="design-system/case-study.css" rel="stylesheet" type="text/css"/></head>${shell.nav}${main}${shell.footer}${shell.scripts}\n<script src="design-system/toc.js"></script>\n<script src="design-system/gallery.js"></script>${main.includes("<video") ? '\n<script src="design-system/video.js"></script>' : ""}\n</body></html>\n`;
}

// ---------------------------------------------------------------------------
// Homepage cards
// ---------------------------------------------------------------------------

// The card's picture: its thumbnail, as the older cards show theirs, or the
// titled placeholder until one exists.
function cardVisual(study, mobile) {
  if (study.thumbnail?.endsWith(".mp4")) {
    const poster = study.thumbnail.replace(/\.mp4$/, ".jpg");
    const posterAttr = fs.existsSync(path.join(root, poster)) ? ` poster="${versioned(poster)}"` : "";
    return `<video class="${mobile ? "image-283" : "image-307 ds-card-thumb"} ds-card-video" src="${versioned(study.thumbnail)}"${posterAttr} autoplay muted loop playsinline aria-hidden="true"></video>`;
  }
  if (study.thumbnail) {
    return mobile
      ? `<img src="${versioned(study.thumbnail)}" loading="lazy" alt="" class="image-283"/>`
      : `<img class="image-307 ds-card-thumb" src="${versioned(study.thumbnail)}" alt="" loading="lazy"/>`;
  }
  return `<div class="ds-card-visual${mobile ? " ds-card-visual--mobile" : ""}"><span class="ds-card-visual-title">${escapeHtml(study.shortName)}</span></div>`;
}

function desktopCard(study) {
  const tags = study.tags.map((t) => `<div class="v25-b1 interaction-tag light"> ${escapeHtml(t)} </div>`).join("");
  return `<div class="w-layout-vflex new-project-card"><a href="${study.slug}.html" class="link-block-13 w-inline-block"><div class="div-block-557-copy"><div class="div-block-583">${cardVisual(study, false)}</div><div class="div-block-578"><div class="v25-b1 interaction-tag-client light"> BOSTON BIOPROCESS · YANTA </div></div><div class="div-block-566"><div class="work-tags-flex-block">${tags}</div></div></div><div class="div-block-579"><div class="div-block-581"><p class="ms-body-text-1 ocp75">${escapeHtml(study.summary)}</p></div><div class="div-block-580"></div><div class="div-block-582"><p class="ms-body-text-1"><span class="opc-75">${escapeHtml(study.impact)}</span> <span class="text-span-1050">${escapeHtml(study.highlight)}</span></p></div></div></a></div>`;
}

function mobileCard(study) {
  const field = (cls, name, value, valueClass) => `<div class="${cls}"><div class="w-layout-vflex flex-block-97-mob"><h1 class="v25-h4 orange">${name}</h1><div class="project-mob-box"><p class="${valueClass}">${value}</p></div></div></div>`;
  return `<div class="div-block-451"><div class="heading-wrapper-mob"><div class="heading-box-wrapper"><div class="div-block-452"><h1 class="heading-55">0</h1><img src="${squareBullet}" loading="lazy" alt="" class="image-282"/></div><div class="div-block-453"><section class="project-detail-block-mob">${field("client-mob", "Company", "Boston Bioprocess · Yanta", "v25-h2 none")}${field("project-des-mob", "Project", escapeHtml(study.summary), "v25-b1")}${field("impact-mob", "Impact", `${escapeHtml(study.impact)} ${escapeHtml(study.highlight)}`, "v25-b1")}</section><div class="project-image-block-mob">${cardVisual(study, true)}<div class="div-block-461"><div class="v25-button-01"><a href="${study.slug}.html" class="link-block-8 w-inline-block"><p class="v25-b2 button">Showcase</p></a></div></div></div></div></div></div></div>`;
}

// Removes any previous copy of the block, then inserts it at the anchor, so
// moving an anchor here moves the cards on the next build.
function placeBlock(html, name, anchor, block) {
  const start = `<!-- ${name}:start -->`;
  const end = `<!-- ${name}:end -->`;
  const from = html.indexOf(start);
  if (from !== -1) html = html.slice(0, from) + html.slice(html.indexOf(end, from) + end.length);
  const marker = html.indexOf(anchor.marker, html.indexOf(anchor.after));
  if (marker === -1) throw new Error(`anchor for ${name} not found`);
  const at = anchor.insertAfterMarker ? marker + anchor.marker.length : marker;
  return html.slice(0, at) + start + block + end + html.slice(at);
}

// The older project pages get the end-of-page cards after their "Curious
// about the journey?" box.
function updateOlderPages() {
  for (const study of olderStudies) {
    const file = path.join(root, `${study.slug}.html`);
    const anchor = { after: '<section class="section-37">', marker: "</section>", insertAfterMarker: true };
    fs.writeFileSync(file, placeBlock(fs.readFileSync(file, "utf8"), "cs-pager", anchor, renderPager(study)));
  }
}

function stampDesignSystemLinks() {
  const dir = path.join(root, "design-system");
  const versions = Object.fromEntries(
    fs.readdirSync(dir)
      .filter((file) => /\.(css|js)$/.test(file))
      .map((file) => [file, crypto.createHash("sha1").update(fs.readFileSync(path.join(dir, file))).digest("hex").slice(0, 8)])
  );
  let pages = 0;
  for (const page of fs.readdirSync(root).filter((file) => file.endsWith(".html"))) {
    const file = path.join(root, page);
    const html = fs.readFileSync(file, "utf8");
    const out = html.replace(/(["'])design-system\/([\w.-]+\.(?:css|js))(?:\?v=[\w]+)?\1/g, (match, quote, name) =>
      versions[name] ? `${quote}design-system/${name}?v=${versions[name]}${quote}` : match);
    if (out !== html) fs.writeFileSync(file, out);
    if (out.includes("design-system/")) pages += 1;
  }
  return pages;
}

function updateIndex() {
  let html = fs.readFileSync(indexPage, "utf8");

  const links = '<link href="design-system/tokens.css" rel="stylesheet" type="text/css"/><link href="design-system/case-study.css" rel="stylesheet" type="text/css"/>';
  if (!html.includes("design-system/case-study.css")) {
    html = html.replace(/(<link href="assets\/cdn\.prod\.website-files\.com\/anamitras-portfolio\.webflow\.shared[^>]*>)/, `$1${links}`);
  }

  // The Yanta cards come first, then an "Earlier work" label above the older
  // projects. Desktop: their own grid, placed before the hidden legacy
  // .project-flex list. Mobile: the head of the numbered list.
  const earlierWork = (modifier) => `<div class="ds-work-group${modifier}"><span class="cs-tag">Earlier work</span></div>`;
  html = placeBlock(html, "yanta-desktop", { after: '<section class="section-49">', marker: '<div class="w-layout-vflex project-flex">' },
    `<div class="w-layout-grid grid-10">${caseStudies.map(desktopCard).join("")}</div>${earlierWork("")}`);
  html = placeBlock(html, "yanta-mobile", { after: '<section class="section-35">', marker: '<div class="div-block-451">' },
    caseStudies.map(mobileCard).join("") + earlierWork(" ds-work-group--mobile"));

  // The mobile list is numbered by hand in Webflow; renumber it in order.
  const from = html.indexOf('<section class="section-35">');
  const to = html.indexOf('<section class="section-49">');
  let n = 0;
  const renumbered = html.slice(from, to).replace(/<h1 class="heading-55">\d+<\/h1>/g, () => `<h1 class="heading-55">${++n}</h1>`);
  html = html.slice(0, from) + renumbered + html.slice(to);

  fs.writeFileSync(indexPage, html);
  return n;
}

// ---------------------------------------------------------------------------

if (!fs.existsSync(draftsDir)) {
  console.error("case-studies/ not found — the drafts folder is local-only (git-ignored).");
  process.exit(1);
}

const shell = loadShell();
const pages = caseStudies.map((study) => {
  const page = parseDraft(study.source);
  study.title = page.title;
  if (study.leadCards) {
    for (const title of study.leadCards) {
      if (!page.sections.some((s) => s.title === title)) throw new Error(`${study.source}: no "## ${title}" section for leadCards`);
    }
  } else {
    for (const key of ["Problem", "What I did", "Result"]) if (!page.tldr[key]) page.warnings.push(`no **${key}.** line`);
  }
  return page;
});

caseStudies.forEach((study, i) => {
  const page = pages[i];
  fs.writeFileSync(path.join(root, `${study.slug}.html`), renderPage(study, page, i, shell));
  const body = bodySections(study, page);
  const visuals = (page.hero && !study.heroVideo && !study.heroImage ? 1 : 0) + body.reduce((sum, s) => sum + s.blocks.filter((b) => b.type === "figure" && !b.images).length, 0);
  console.log(`Wrote ${study.slug}.html — ${study.leadCards ? `${study.leadCards.length} lead cards, ` : ""}${body.length} sections, ${visuals} visual placeholders`);
  for (const warning of page.warnings) console.warn(`  warning (${study.source}): ${warning}`);
});

const cards = updateIndex();
updateOlderPages();
console.log(`Added the All work / Next case study cards to ${olderStudies.length} older project pages`);
console.log(`Updated index.html — ${caseStudies.length} Yanta cards, mobile list renumbered 1–${cards}`);

// Every page links design-system files with ?v=<content hash>, so a browser
// that cached an older copy fetches the new one as soon as the file changes.
const stamped = stampDesignSystemLinks();
console.log(`Stamped design-system links on ${stamped} pages`);
