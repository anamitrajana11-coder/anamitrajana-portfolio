# ANA™ Design System

The formalized design language of [anamitrajana-portfolio](https://anamitrajana11-coder.github.io/anamitrajana-portfolio/).
Every value in this document was **extracted from the live site's stylesheet** on 2026-08-19 — it describes what the site actually does, organized into rules for keeping it consistent.

**The three pieces:**

| File | What it is |
|---|---|
| `design-system/README.md` | This document — the rules and reference |
| [`design-system/tokens.css`](tokens.css) | The named values (colors, type, radii) as a CSS token sheet |
| [`design-system/case-study.css`](case-study.css) | The case-study page layout and homepage work cards, built only from the tokens (see §7) |
| [`/styleguide.html`](../styleguide.html) | Visual style guide — open it in a browser to *see* everything below |

---

## 1. Color

### Brand core

The identity is **white type on true black**, with orange as the signature accent and purple as the secondary brand color.

| Token | Value | Role |
|---|---|---|
| `--ds-black` | `#000000` | Page background everywhere |
| `--ds-white` | `#ffffff` | Primary text on dark |
| `--ds-orange` | `#f15a24` | Signature accent (logo era, CTA gradient) |
| `--ds-purple` | `#a798ff` | Brand color (Webflow `--brand-color`) |
| `--ds-purple-dark` | `#816cff` | Darker brand purple |
| `--ds-green` | `#009b5c` | Legacy body-text green (Webflow default) |
| `--ds-brand-green` | `#1d8e6b` | Yanta design system `brand-60` (`--primary-brand`); status tag fill (16%) and border (55%) |
| `--ds-brand-green-light` | `#86ceb8` | Yanta design system `brand-20`; status tag text and dot (9.5:1 on the fill) |

### Dark surfaces & overlays — the "glass on black" system

Panels are near-black with faint white overlay fills and hairline borders:

| Token | Value | Role |
|---|---|---|
| `--ds-surface-1` / `--ds-surface-2` | `#141314` / `#191414` | Near-black panels |
| `--ds-border-hairline` | `#111111` | 1px card borders on black |
| `--ds-overlay-white-5/8/10` | 5–10% white | Subtle fills, hover, active states |
| `--ds-overlay-black-50/70` | 50/70% black | Scrims behind modals/menus |

### Project palettes (scoped — do not promote to global)

Each case study carries its own accent set, and that's intentional:

- **TMF** — `--tmf-blue: #2370f0`
- **Crayon** — purple `#7e06d2`, blue `#6184db`, cyan `#62c5b5`, red `#f55d59`
- **Firefighter** — red `#cc0505`, orange `#e56b66`
- **Combine library** — primary `#6157f8` + grey/error/success/warning ramps
- **Spark library** — interactive `#5532fa`, hover `#1e116e`

**Rule:** a project color lives only on its project page. Global UI (nav, footer, home, about) uses brand core only.

---

## 2. Typography

### Faces

| Role | Family | Source | Where |
|---|---|---|---|
| **Primary** | `aktiv-grotesk` | Adobe Fonts (kit `qjc6msf`) | All global UI — 125 style rules |
| **Display** | `Cabin` 500 | Google Fonts | Page and section titles in the newest (v25) layer: "Selected works.", "Welcome to the Lab.", case-study headings — `--ds-font-display` |
| Secondary | `Montserrat` | Google Fonts | Webflow body default (16px/28px) |
| Serif | `PT Serif` | Google Fonts | Editorial moments in case studies |
| Mono | `Spline Sans Mono` | Google Fonts | Tags, captions, meta — the v25 card tags use it |
| Pixel | `Pixelify Sans` | Google Fonts | Playful accents |

**Rule:** new pages and components use **aktiv-grotesk** for text, **Cabin** for page and section titles, and **Spline Sans Mono** for tags and captions.

**Case-study sections** (every project page, old and new) share one set: a **Cabin 500 heading** (24–32px, white), **heading 3** for sub-headings and lead statements (Cabin 500, 20–24px, white), and **Montserrat body copy** at 14px / 1.5, white at 75% (12px at ≤ 991px) — the older pages' `.ms-body-text-1.ocp75`, now the `--ds-body-*` tokens. Orange impact figures keep their own size. Weights are **regular (400) or medium (500) only** — headings, labels and bold emphasis are medium. The same body style covers the cards' paragraphs and list detail lines, the Status box, the credits and the homepage testimonials; captions (mono), placeholder notes, opening detail values and labels keep their own styles. Spacing under headings: **32px** after a section heading, **20px** after a heading 3, 18px between paragraphs. Don't add font families — nine already load; the goal is fewer, not more.

### Type scale (px, ranked by actual use)

```
12  captions, labels          ← the most-used size on the site
14  nav, buttons, meta
16  body copy
18  lead paragraphs
20  small headings
24  h3-level                  ← most-used heading size
28  section subheads
32  h2-level
36  page headings
40 / 48 / 56 / 64  display & hero sizes
```

### Weights

`400` regular · `500` medium · `600` semibold (the workhorses, ~82 rules each) · `700` bold · `800` extrabold (display only).

---

## 3. Shape & radius

- **`20px` is the signature card radius** (78 uses — the roundest, most recognizable trait of the site).
- **`4px` for buttons and chips** (56 uses), with `2px` for elements nested inside them.
- Full scale: `2, 4, 8, 12, 16, 20, 24` px, then `100px` pill and `50%` circle.

---

## 4. Breakpoints

Standard Webflow set:

| Range | Meaning |
|---|---|
| ≥ 1280px | Wide desktop enhancements |
| base | Desktop |
| ≤ 991px | Tablet |
| ≤ 767px | Phone landscape |
| ≤ 479px | Phone portrait |

---

## 5. Components (global shell)

These appear on **every page** and define the site's chrome:

### Navigation bar
- `ANA™` logo (pixel-style mark, white on black)
- Floating pill menu (`bubbly-nav-menu`), transparent on black
- Menu items: WORK · ABOUT · LAB · RESUME — aktiv-grotesk `14px` white

### Nav CTA button (`grad-bg` + `text-block-black-bg`)
The signature button: a **2px gradient frame** around a black label.
```css
frame:  background-image: linear-gradient(15deg, #f15a24, #a43711 0%, #3b1001 80%, #0f0400 99%);
        border-radius: 4px; padding: 2px;
label:  background: #000; color: #fff; border-radius: 2px;
        padding: 4px 16px; font: 14px aktiv-grotesk;
```

### Active-page indicator (`bottom-bubble`)
A `40px × 3px` white pill under the active nav item.

### Card on black (`flex-block-81` pattern)
Black fill, `1px #111` hairline border, `20px` gaps, generous padding.

### Work card — v25 (`new-project-card`)
The newest card, used in the homepage "Selected works." grid. Tighter than the older cards:
```css
card:   background: #090909 (--ds-surface-card); border: 2px solid #2c2c2c (--ds-border-strong); border-radius: 4px;
tags:   Spline Sans Mono 12px/500, letter-spacing .5px, #a1a1a1, 2px #2c2c2c frame, 3px padding
client: same tag with a 2px #641b00 (--ds-orange-deep) frame
impact: highlighted figure in #f87638 (--ds-coral)
```
Hovering a card grows its picture to 105% inside the 3:2 frame over half a second. The older cards do it with a Webflow interaction per card; the Yanta cards' thumbnails (`.ds-card-thumb`, from `thumbnail` in build-case-studies.mjs) do it in CSS. A thumbnail can be an `.mp4` (`.ds-card-video`): it always loops muted like a GIF, with no controls, and a `.jpg` of the same name as its poster while it loads. Until a thumbnail exists, a Yanta card shows a titled `.ds-card-visual` placeholder.

---

## 7. Case-study pages

The Yanta case studies (`yanta-*.html`) are generated from the drafts by `build-case-studies.mjs` (drafts stay local; see the script header). They open exactly like the older project pages, then follow the case-study guide — verdict first, then decisions. Their layout lives in [`case-study.css`](case-study.css):

| Block | Class | Notes |
|---|---|---|
| Opening | Webflow `.section-36` markup | Same as `featurely.html` / `tmf1.html`: full-width hero visual (`.cs-visual--hero`, 1440 × 582; replaced by a study's `heroVideo` or `heroImage` once it exists), orange Cabin claim (`.ms-heading-2.orange`), Company / Role / Product, and Project details with Timeline and Team |
| Team avatars | `.cs-team` | The older pages' hover (slot widens 50 → 70px, white name card with an orange frame), done in CSS instead of Webflow interactions; names and photos go in the script's `team` config |
| Status | `.cs-status` | Status list (orange dash bullets), Built with, link chips (`.cs-tag--pending` until the link exists) |
| TL;DR | `.cs-tldr` | Problem / What I did / Result — three v25 cards; Result gets the orange-deep frame. A study with `leadCards` (Identity: The problem / Constraints / Approach; Ask AI: The problem / The decision / What I did; a study with four gets `.cs-tldr--4`, two by two below 1280px) shows those draft sections here instead, out of the body: lists become `.cs-tldr-list` items (lead-in as the title line; ↳, or 01, 02… for a sequence) and the last card gets the frame. In a card list, `**Lead.** {Status} [View](https://…)` puts a status tag (`.cs-tag--status`: a dark brand-green tint with a mid-green border and light-green text and dot, the usual dark-mode success tag; a Live tag's dot pulses, still for reduced motion) and a View button (`.cs-tag--link`, opens in a new tab) beside the lead |
| List | `.cs-list` | Body-copy lists from `* item` / `1. item` lines in a draft: orange dash bullets, or orange mono step numbers (01, 02…) for a sequence; a bold lead-in reads as the item's title |
| Figure | `.cs-figure` | `.cs-visual` placeholder until the image exists (a draft's `[Visual: …]` line), then the image itself (an image line, `![alt text](assets/… "Caption")`, linked with a `?v=` content hash). Several images on one line make `.cs-figure-row`: equal 4:3 tiles cropped to fill, 20px apart, stacked below 768px. Images that follow one another with no caption between them are 20px apart too. An image line pointing at an `.mp4` plays it in `.cs-figure-media`: looping and muted, click to pause, like the hero video, but it only starts loading as it scrolls near. A title that starts with `Credit:` puts `.cs-credit`, a tag, in the image's bottom-right corner instead of a caption. Mono caption with an orange `↳` |
| Body | `.cs-body` | Sticky "On this page" contents in a 200px column (entries of 1–5 words: `tocLabel()` and `tocLabels` in the build script), text and visuals across the rest — the same split as the older pages. A draft's `###` line is a heading-3 sub-heading inside its section, 56px below what precedes it (only `##` sections are listed in the contents). A study's `gridSections` lays a section's `###` parts out two to a row (`.cs-subgrid`): the two parts' headings and text side by side, then the row's 3:2 visuals and captions below them (`.cs-subgrid-row`): one visual takes the full width, two sit side by side; an odd last part's text takes the full width too. Stacked below 768px, each visual after its own text — Ask AI's Key design decisions |
| Closing | Webflow `.section-47` + `.section-37`, `.cs-gallery`, `.cs-cta` | Shared by all four Yanta pages, after the body and before the next-study card: the older pages' gallery (three rows of 4:3 tiles) fading into "Curious about the journey?" and Let's talk. Images come from `assets/yanta/gallery/` in file-name order (15: five per row, each row ending with its first again, as on the older pages); an empty slot shows a numbered `.cs-gallery-slot`. The files are 480 × 360, tile-sized, so nobody can open one and read the details. `gallery.js` drifts the rows sideways by up to 13svh as the gallery scrolls past, and the button's arrow slides out and turns on hover, both done here because Webflow ties its versions to each older page; still for reduced motion |
| Credits, next | `.cs-credits`, `.cs-pager` of `.cs-next` cards | Role and tools as label/text pairs; then, on every case study (the build adds them to the older pages too, after Let's talk), two v25 cards side by side (stacked below 768px): All work, back to the homepage with the arrow mirrored, and the next case study, named in one line (`nextName`, else `shortName`) |

The older project pages also lead with the TL;DR cards, in a `.cs.cs-lead` wrapper below their opening: their Problem / Solution row became cards (two, `.cs-tldr--2`, or three when the underlying issue is its own card), built from the page's own text, with `.cs-tldr-list` for ↳ items. Featurely's Summary then spans its row (`.cs-fill`). In their body, each section's title sits above its content (the Webflow 3 + 9 column rows stack), as on the Yanta pages; a short line that belongs to a title ("(3 mins) Everything you need to know…", image credits) sits on the title's line, right-aligned and vertically centred, from 992px up, and wraps below it on smaller screens.

The "On this page" contents (`.cs-toc`, highlighted by [`toc.js`](toc.js)) is also on the older project pages (Featurely, TMF 1 and 2, RedLab, Crayon): their full-width rows sit in `.cs-toc-layout` beside it, in a 200px column on desktop; below 992px the contents hide and those pages look exactly as before. Each row's id matches its contents link.

To swap a placeholder for a real visual, replace the `<div class="cs-visual">…</div>` inside its `<figure>` with an `<img>` and keep the `<figcaption>`.

---

## 8. Rules going forward

1. **Use tokens, not raw hex.** The stylesheet has 238 unique hardcoded colors; every new color choice should come from this document or be added here first.
2. **aktiv-grotesk for text, Cabin for titles**; project fonts stay inside their case study.
3. **Project palettes stay scoped** to their pages.
4. **No new radii.** Older pages use 20px cards and 4px buttons; new v25 work (cards, case studies) uses 4px with a 2px `#2c2c2c` frame.
5. **New sizes come from the type scale** above.
6. `tokens.css` only defines `--ds-*` variables, so linking it changes nothing on its own. It is linked from `index.html` and the case-study pages.

## Known debt (recorded, not yet fixed)

- 238 unique hardcoded colors bypass the named variables.
- Class names are Webflow auto-generated (`div-block-407`, `column-63`…) — 483 distinct custom classes with no semantic naming.
- The Webflow body default is green Montserrat (`#009b5c`), overridden everywhere in practice — a trap for new pages.
