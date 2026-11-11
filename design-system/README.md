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

**Case-study sections** (every project page, old and new) share one set: a **Cabin 500 heading** (24–32px, white), **heading 3** for sub-headings and lead statements (Cabin 500, 20–24px, white), and **Montserrat body copy** at 14px / 1.5, white at 75% (12px at ≤ 991px) — the older pages' `.ms-body-text-1.ocp75`, now the `--ds-body-*` tokens. Orange impact figures keep their own size. Weights are **regular (400) or medium (500) only** — headings, labels and bold emphasis are medium. Bold in the body (a list item's lead-in, a key term) is full white (`--ds-white`), a step up from the 75% body copy. The same body style covers the cards' paragraphs and list detail lines, the Status box, the credits and the homepage testimonials; captions (mono), placeholder notes, opening detail values and labels keep their own styles. Spacing under headings: **32px** after a section heading, **20px** after a heading 3, 18px between paragraphs. Don't add font families — nine already load; the goal is fewer, not more.

### Section headings (two levels, added 2026-11-05)

Homepage and one-pager sections open with one of two headings, each followed by the orange pixel arrow (Brand-hyperlink-arrow, 16 × 15).

| Level | Name | Class | Recipe | Tokens |
|---|---|---|---|---|
| 1 | **Section title** | `.ds-section-title` | Cabin 500, 28px / 1.15, white; the arrow follows the last word 8px away (no space, so it never wraps alone), .1em above the baseline. Below 992px it becomes a Section label | `--ds-section-title-font`, `--ds-section-title-size`, `--ds-section-title-weight`, `--ds-section-title-leading` |
| 2 | **Section label** | `.ds-section-label` | aktiv-grotesk 400, 16px / 1.5 (14px ≤ 479px), white; the arrow 10px after it | `--ds-section-label-font`, `--ds-section-label-size`, `--ds-section-label-size-compact`, `--ds-section-label-weight`, `--ds-section-label-leading` |

Both use `--ds-section-arrow-width` and `--ds-section-arrow-height` for the arrow.

- **Section title** is the one-pager's `hello-h2` ("What they say when I stop screen-sharing").
  - On the homepage, these headings use it: "Selected works", "What others think" and "What I've been up to". On About: "The other half" and "Unfiltered notes from visitors". "Selected works" and "Unfiltered notes" were the 40px `v25-title-text extra-large`, and both dropped their full stop.
  - On the About page, "The other half" uses it too (the page links `tokens.css` and `case-study.css` since 2026-11-05).
  - On phones and tablets (below 992px) it steps down to the Section label look, like every mobile heading.
- **Section label** is "Experience" and the mobile "Selected works". Both still use the Webflow classes (`.v25-h3` in a `.flex-block-78` row), which `.ds-section-label` matches.
- Section titles and labels are in sentence case: only the first word (and names) capitalised.
- Webflow gives every `img` `height: 15px; margin-bottom: 10px; display: block`. Both classes set the arrow's margin in full, otherwise it rides 10px high.

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
- **`8px` for buttons** (primary and secondary, `--ds-btn-radius`, since 2026-11-11).
- **`8px` for cards** too: the work cards, the testimonial cards and the visitor-note cards (since 2026-11-11).
- **`4px` for small chips and tags**, with `2px` for elements nested inside them.
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
- Menu items: Work · About · Lab · Resume, each a medium secondary button (see Buttons below), 12px apart (`--ds-btn-row-gap`). The current page's item keeps the hover look (brighter outline, faint fill). On tablets (768–991px) the typing tagline beside the logo is hidden so the menu doesn't run over it.

### Buttons (`buttons.css`, tokens in section 11 of `tokens.css`)
Three levels in three fixed sizes, aktiv-grotesk 500, sentence case. They replace the old gradient-frame button (`grad-bg`), the orange "Showcase" button and the orange "Let's talk" pill.

| Level | Class | Look | Use it for |
| --- | --- | --- | --- |
| **Primary** | `.ds-btn.ds-btn--primary` | Black, 8px corners, with a 1.5px border lit from one corner: orange where the light hits the bottom-left corner, fading to a grey hairline around the rest. On hover the light spreads along the border and the black fill drops to 80%, so the orange glows through from the corner | The one action a view exists for. At most one per view |
| **Secondary** | `.ds-btn.ds-btn--secondary` | Ghost: a 1.5px outline (14% white) with no fill, 8px corners. On hover the outline brightens to 34% white and a faint 4% white fill comes in; nothing moves | Everything else: navigation, repeated per-item actions, alternatives |
| **Tertiary** | `.ds-btn-talk` | Dark brown glass pill (`--ds-glass-brown`) with an arrow circle tucked into it, a glass edge and an ember inside. On hover the circle pulls away with a liquid stretch, the arrow turns and the ember spreads | "Let's talk" only |
| **Tertiary, circle** | `.ds-btn-icon` | The tertiary's circle on its own: a 40px brown glass circle with the glass edge and one white icon. On hover an ember lights inside. Works on `<a>` and `<button>` | Icon-only controls: LinkedIn, X and email beside the intro pill; the testimonial deck's previous and next |

**Sizes.** Height, side padding, text size and icon gap are fixed per size (`--ds-btn-{sm,md,lg}-*`), on the common 32 / 40 / 48 ladder. Side padding is twice the vertical padding, the ratio the site's older buttons used (10px 20px, 20px 40px): around a 16px line that is 8 × 16, 12 × 24 and 16 × 32. A button is as wide as its label plus the side padding; nothing stretches it. Corners are 8px on primary and secondary at every size (`--ds-btn-radius`).

| Size | Class | Height | Side padding | Text | Used for |
| --- | --- | --- | --- | --- | --- |
| Small | `.ds-btn--sm` | 32px | 16px | 14px | Defined for dense rows; nothing uses it |
| Medium | (default) | 40px | 24px | 14px | Every button on the site |
| Large | `.ds-btn--lg` | 48px | 32px | 16px | One stand-out action; nothing uses it yet |

The tertiary has one size: 40px tall, a 124px pill and a 40px circle.

**Label rendering, handled in the component.**
- **Centred on capitals:** the space from the top edge to the top of a capital letter equals the space from the baseline to the bottom edge. aktiv-grotesk's 500 weight carries lopsided line metrics (its line box sits 0.12em above the capitals' centre), so plain centring left every label visibly high. `buttons.css` trims the label's line box to the capital height (`text-box`) and computes the padding from that; browsers without `text-box` get a 0.12em nudge (`--ds-btn-cap-nudge`).
- **Antialiased:** with the Mac's default text weighting, white 14px labels on dark fills looked bold.

**Icon-only buttons.** Add `.ds-btn--icon` to a primary or secondary for a square button the height of its size (40 × 40 at medium) holding one 18px icon, with an `aria-label`. Nothing uses it at the moment: the testimonial deck's previous and next are the tertiary circle (`.ds-btn-icon`), like the contact links.

**Border weight.** One standard for both levels: 1.5px (`--ds-btn-border-width`), a real CSS border that comes out of the padding, so the two levels are the same size. A standard-density screen cannot draw half a pixel (the browser draws 1.5px as 1px there and the button comes out 1px short), so the border is 2px on those screens and 1.5px from 2x up. Measured in a browser at true 1x and 2x: even on all four sides, 40px tall at both.

**What counts as primary.** A primary button is the single action that moves a visitor toward what the view is for. Navigation never qualifies, and neither does an action repeated for every item in a list. Where a view offers two versions of the same action, the recommended one is primary and the other secondary.

| Where | Button | Level | Why |
| --- | --- | --- | --- |
| Every page, top menu | Work · About · Lab · Resume | Secondary | Wayfinding, four equal choices |
| Homepage, Selected works heading | View all works | Secondary | Sits beside the section title as a quiet link to the full list |
| Homepage, What I've been up to | Explore the Lab | Secondary | A side path |
| About, visitor notes | Drop your feedback | Secondary | Opens the form; optional |
| About, feedback form | Submit | **Primary** | The form's one committing action |
| Homepage and All works, phone list | Showcase | Secondary | Repeated on every project |
| Lab | View | Secondary | Repeated on every experiment |
| Resume | Human optimized version · ATS optimized version | Secondary | Two versions of the same file, offered side by side as equals |
| Homepage, What others think | Previous · Next | Tertiary, circle | Icon-only controls that turn the cards, in the same circle as the contact links |
| Case studies, closing box | Let's talk | Tertiary | The one invitation to get in touch |
| Homepage intro, after the pill | LinkedIn · X · Email | Tertiary, circle | Three ways to reach out, as icons so they stay quiet beside the pill |

**How they're built.** Primary and secondary need no extra markup: `<a class="ds-btn ds-btn--primary">Label</a>` (or a `<button>`). The tertiary has its own markup, written by `talkButton()` in `build-case-studies.mjs`. The tertiary's glass edge and liquid stretch are SVG filters (`#ds-glass-rim`, `#ds-glass-rim-goo`, `#ds-goo`) in a hidden `<svg class="ds-filters">` at the top of every page's `<body>`; the build keeps that block and the `buttons.css` link on every page. Reduced motion turns the transitions off.

### Page edges (`layout.css`, and "Page edges" in `case-study.css`)
Everything on a page lines up on two edges: the logo's left edge and the same distance in from the right. That is `.mid-body`'s side padding plus a 10px gutter: 50px, 30px below 768px, and wider on screens past 1728px. On 2026-11-11 every page was measured at 1918, 1440, 1024, 820, 600 and 390px and the pieces that missed those edges were brought back:

| Where | What was off | Widths |
| --- | --- | --- |
| Every page | The homepage and All works had their own slim 10px scrollbar; other pages had the browser's (about 15px, or none), so the centred page moved sideways by a few pixels when going between them. One scrollbar for the whole site now | all widths |
| Top menu, every page | "Resume" ended 10px past the right edge | from 1280px |
| Top menu, every page | The menu ran over the typing tagline; the tagline is hidden there | 768–991px |
| Footer, every page | 50px side padding where the page edge is 30px | 480–767px |
| Case studies | Hero, body, closing box and end cards ran 10px past the right edge | from 1280px |
| Yanta case studies | Body, closing box and end cards sat 10px outside both edges | 992–1279px |
| Older case studies | Closing box and end cards sat 10px outside both edges | below 1280px |
| Homepage, "What I've been up to" | Cards stopped 52px short of the right edge on very wide screens; on phones they started 10px outside the left edge | from about 1700px; below 768px |
| Homepage, "What others think" | Title and cards 9px inside both edges | below 480px |
| Homepage and All works, numbered list | 10px outside both edges | 480–991px |

`layout.css` holds the fixes for the menu and footer, and the site's scrollbar, and is linked from every page; the section-level ones are in `case-study.css`. The bodies of the five older case studies (Webflow exports) were left as they are; some of their inner blocks keep their own insets.

### Active-page indicator (`bottom-bubble`)
A `40px × 3px` white pill under the active nav item.

### Card on black (`flex-block-81` pattern)
Black fill, `1px #111` hairline border, `20px` gaps, generous padding.

### Work card — v25 (`new-project-card`)
The newest card, used in the homepage "Selected works" grid and on the All works page. Tighter than the older cards:
```css
card:   background: #090909 (--ds-surface-card); border: 2px solid #2c2c2c (--ds-border-strong); border-radius: 8px (--ds-radius-md; Webflow had 4px); the card clips its picture;
lines:  every line in the card is 2px (--ds-card-border-width): the frame, the tags, the line under the picture, the footer divider;
picture: square corners; a 2px #2c2c2c line under it (from 1280px);
tags:   Spline Sans Mono 12px/500, letter-spacing .5px, #a1a1a1, 2px #2c2c2c frame, 3px padding
client: same tag with a 2px #641b00 (--ds-orange-deep) frame
impact: highlighted figure in #f87638 (--ds-coral)
```
Hovering a card grows its picture to 105% inside the 3:2 frame over half a second. The older cards do it with a Webflow interaction per card; the Yanta cards' thumbnails (`.ds-card-thumb`, from `thumbnail` in build-case-studies.mjs) do it in CSS. A thumbnail can be an `.mp4` (`.ds-card-video`): it always loops muted like a GIF, with no controls, and a `.jpg` of the same name as its poster while it loads. Until a thumbnail exists, a Yanta card shows a titled `.ds-card-visual` placeholder.

### All works page (`works.html`)
Every project in one list, with no groups: the four Yanta case studies, then Featurely AI, the two Toyota Mobility Foundation projects, Redlab and Crayon. It's reached only from the homepage's **View all works** button; the top menu's Work button goes to the homepage, and the "Home · Back to Selected works" card at the end of each case study goes back to the homepage's Selected works.
- **Layout:** the homepage's frame, with a page title, "All works." (`.v25-title-text.extra-large`, as "Welcome to the Lab."), where the intro sits (`.ds-works-head`). From 992px the cards sit in one two-column grid (`.ds-works-grid`); below that they become the homepage's numbered phone list (`.ds-works-list`).
- **Build:** the Yanta cards come from `build-case-studies.mjs`, which puts them at the head of both lists and renumbers the phone list. The older cards are in `works.html` itself.
- **Homepage:** "Selected works" keeps only the Yanta cards. Its heading row (`.ds-section-head`) has the title on the left and a secondary **View all works** button at the far right, in line with the cards' right edge, on desktop and on the phone list.

---

### Testimonial deck (homepage "What others think")
The homepage's testimonials are one card deck (`.ds-deck` of `.ds-quote` cards in [`case-study.css`](case-study.css), moved by [`deck.js`](deck.js)). It takes the four card slots to the right of the section's title column, which is unchanged.

- **Layout:** the cards share one grid cell, so they are all as tall as the longest quote. Four are fanned behind the front one. Cards are up to 600px wide (at most 70% of the slots), against the slots' right edge.
- **Motion:** every 7 seconds, or on the previous and next buttons (tertiary circles, `.ds-btn-icon`), the front card slides out to the left and settles at the back. The 7 seconds only run while the deck is on screen: they start once (nearly) all of it is in view and stop once more than half has scrolled away, so a visitor always starts on the first card; the previous arrow brings the back card forward. From 768px the leaving card stops at the slots' left edge (`--deck-out`), so it never covers the title column. The deck holds still for reduced motion.
- **Text:** the quote is the site's body copy (`--ds-body-*`, as `.ms-body-text-1.ocp75`), with a few keywords per quote in `<strong>`: full white at medium weight, the body copy's emphasis. Quotes have no quotation marks, since the coral mark above each one does that job. Name and role match the testimonials' `.v25-h3` (aktiv-grotesk 16px) and `.v25-h4.grey` (aktiv-grotesk 12px medium, muted).
- **Card details:** each card has 8px corners (`--ds-radius-md`, as the buttons and the visitor-note cards), a client tag (`.cs-tag--accent`), the position dots, a Cabin quote mark in coral and the person's photo.

### Visitor feedback popover ("Drop your feedback", About page)
Since 2026-11-05 the button opens a popover in the manner of shadcn/ui's Popover (`.ds-popover`, styled in [`case-study.css`](case-study.css), run by [`feedback.js`](feedback.js)). Webflow no longer touches it.
- **Panel:** 380px wide, 8px under the button, right-aligned to it. It uses `--ds-surface-1`, a 1px `--ds-overlay-white-10` border, `--ds-radius-lg` corners and a soft shadow, and fades and scales in over .15s.
- **Opening and closing:** the button opens and closes it; Escape or a click outside closes it too. There's no title and no ✕. Opening puts the cursor in Name.
- **Form:** hairline rows with the label on the left and a borderless field on the right (Name, Role, Company marked "Optional"), then the message. A row lightens while its field has focus. An empty required field gets a small red dot (`--ds-red`, 6px) at the end of its row; the message's sits at its top right. Hovering the dot shows a "Required field" tooltip to its left. Screen readers hear "Required". There are no red lines. The labels reset Webflow's uppercase `label` style.
- **Footer:** Submit on the left, the form's primary button, and an info badge ("Goes straight to my inbox") on the right. On phones the badge moves under it.
- **Sending:** the form's `action` is Formspree (`https://formspree.io/f/xdeejpvv`). Formspree emails each note under the subject "New portfolio feedback" and keeps 30 days in its dashboard; the free plan allows 50 a month. On success a thank-you replaces the rows, and the next opening brings a fresh form. On failure a red line shows and the text stays. A hidden `_gotcha` field catches bots.
- **Webflow:** the button links to plain `#`. A link to `#feedback-popover` would set off Webflow's smooth scroll.
- **The wall:** the visitor notes are a fixed copy of Webflow's list, each note a `.feedback-card` with 8px corners (`--ds-radius-md`, the buttons' radius). A new note only shows up when it's added to `about.html` by hand.
- **Where:** the section ("Unfiltered notes from visitors") is the last one on the About page, above the footer; it moved there from the homepage on 2026-11-11. About loads `feedback.js`; the homepage no longer does.

### Homepage intro pill ("Available for work")
The Webflow "Available for work" pill (`.flex-block-105`) sits under the intro's headline and its line on years of experience. It is 40px tall, the height of the three contact buttons after it (LinkedIn, X and email, `.ds-btn-icon` in `.ds-hero-links`, 12px from the pill and 12px apart, `--ds-btn-row-gap`; on phones they wrap under it). Three things draw the eye to it, and all three hold still for reduced motion:
- **Border beam:** a faint, broad wash of `--ds-orange` travels round the 2px outline every 3.5s. It spreads over three quarters of the outline with a soft peak in the middle, mixed at 10% (`--ds-beam-strength`) over the resting `--ds-orange-ember` border, so it reads as a quiet shimmer. Until 2026-11-11 it was a narrow full-strength spark, which read as sharp and distracting. It's a conic gradient in the border, turned by `--ds-beam-angle`.
- **Glow:** the dot's glow breathes slowly every 2.8s: it grows to 1.2× while fading out completely, then comes back.
- **Rotating text:** "Available for work", "Based in US" (with a small inline US flag, `.ds-flag`) and "Open to relocate" take turns, 3s each. Screen readers hear all three once.

### Info badge (`.ds-info-badge`)
A soft pill for a quiet note beside an action: an ⓘ icon (14px) and aktiv-grotesk 12px in `--ds-text-muted`, on a `--ds-overlay-white-5` fill with a 1px `--ds-overlay-white-8` border and `--ds-radius-pill` corners. It stays on one line. The mono `.cs-tag` is for labels; this is for a sentence.
---

## 7. Case-study pages

The Yanta case studies (`yanta-*.html`) are generated from the drafts by `build-case-studies.mjs` (drafts stay local; see the script header). They open exactly like the older project pages, then follow the case-study guide — verdict first, then decisions. Their layout lives in [`case-study.css`](case-study.css):

| Block | Class | Notes |
|---|---|---|
| Opening | Webflow `.section-36` markup | Same as `featurely.html` / `tmf1.html`: full-width hero visual (`.cs-visual--hero`, 1440 × 582; replaced by a study's `heroVideo` or `heroImage` once it exists), orange Cabin claim (`.ms-heading-2.orange`), Company / Role / Product, and Project details with Timeline and Team. A timeline in phases (separated by "; " in the draft) shows one phase per line, below the label (`.cs-timeline`) |
| Team avatars | `.cs-team` | The older pages' hover (slot widens 50 → 70px, white name card with an orange frame), done in CSS instead of Webflow interactions; names and photos go in the script's `team` config |
| Status | `.cs-status` | Status list (orange dash bullets), Built with, link chips (`.cs-tag--pending` until the link exists) |
| TL;DR | `.cs-tldr` | Problem / What I did / Result — three v25 cards; Result gets the orange-deep frame. A study with `leadCards` (Identity: The problem / Constraints / Approach; Ask AI: The problem / The decision / What I did; a study with four gets `.cs-tldr--4`, two by two below 1280px) shows those draft sections here instead, out of the body: lists become `.cs-tldr-list` items (lead-in as the title line; ↳, or 01, 02… for a sequence) and the last card gets the frame. In a card list, `**Lead.** {Status} [View](https://…)` puts a status tag (`.cs-tag--status`: a dark brand-green tint with a mid-green border and light-green text and dot, the usual dark-mode success tag; a Live tag's dot pulses, still for reduced motion) and a View button (`.cs-tag--link`, opens in a new tab) beside the lead |
| List | `.cs-list` | Body-copy lists from `* item` / `1. item` lines in a draft: orange dash bullets, or orange mono step numbers (01, 02…) for a sequence; a bold lead-in reads as the item's title |
| Figure | `.cs-figure` | `.cs-visual` placeholder until the image exists (a draft's `[Visual: …]` line), then the image itself (an image line, `![alt text](assets/… "Caption")`, linked with a `?v=` content hash). Several images on one line make `.cs-figure-row`: equal 4:3 tiles cropped to fill, 20px apart, stacked below 768px. Images that follow one another with no caption between them are 20px apart too. An image line pointing at an `.mp4` plays it in `.cs-figure-media`: looping and muted, click to pause, like the hero video, but it only starts loading as it scrolls near. A title that starts with `Credit:` puts `.cs-credit`, a tag, in the image's bottom-right corner instead of a caption. Mono caption with an orange `↳` |
| Body | `.cs-body` | Sticky "On this page" contents in a 200px column (entries of 1–5 words: `tocLabel()` and `tocLabels` in the build script), text and visuals across the rest — the same split as the older pages. A draft's `###` line is a heading-3 sub-heading inside its section, 56px below what precedes it (only `##` sections are listed in the contents). A study's `gridSections` lays a section's `###` parts out two to a row (`.cs-subgrid`): the two parts' headings and text side by side, then the row's visuals and captions below them (`.cs-subgrid-row`): two sit side by side, cropped to 3:2 so they line up; one alone takes the full width and keeps its own proportions (a 16:9 recording stays 16:9); an odd last part's text takes the full width too; `gridPerRow: 1` gives every part its own row, text then visual, both full width. Stacked below 768px, each visual after its own text — Ask AI's Key design decisions |
| Closing | Webflow `.section-47` + `.section-37`, `.cs-gallery`, `.cs-cta` | Shared by all four Yanta pages, after the body and before the next-study card: the older pages' gallery (three rows of 4:3 tiles) fading into "Curious about the journey?" and Let's talk. Images come from `assets/yanta/gallery/` in file-name order (15: five per row, each row ending with its first again, as on the older pages); an empty slot shows a numbered `.cs-gallery-slot`. The files are 480 × 360, tile-sized, so nobody can open one and read the details. `gallery.js` drifts the rows sideways by up to 13svh as the gallery scrolls past, and the button's arrow slides out and turns on hover, both done here because Webflow ties its versions to each older page; still for reduced motion |
| Credits, next | `.cs-credits`, `.cs-pager` of `.cs-next` cards | Role and tools as label/text pairs; then, on every case study (the build adds them to the older pages too, after Let's talk), two v25 cards side by side (stacked below 768px): Home ("Back to Selected works", to `index.html#selected-works`, which lands on the works) with the arrow mirrored, and the next case study, named in one line (`nextName`, else `shortName`) |

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
