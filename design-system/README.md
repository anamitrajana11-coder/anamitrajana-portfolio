# ANA™ Design System

The formalized design language of [anamitrajana-portfolio](https://anamitrajana11-coder.github.io/anamitrajana-portfolio/).
Every value in this document was **extracted from the live site's stylesheet** on 2026-08-19 — it describes what the site actually does, organized into rules for keeping it consistent.

**The pieces:**

| File | What it is |
|---|---|
| `design-system/README.md` | This document: the rules and reference |
| [`design-system/tokens.css`](tokens.css) | Every named value (colours, type, radii, component settings) as CSS variables, in three tiers (see "Tokens" below) |
| [`design-system/type.css`](type.css) | The text roles (Body 1, Body 2, Caption), applied across the whole site; loaded last on every page |
| [`design-system/buttons.css`](buttons.css) | The three button levels |
| [`design-system/layout.css`](layout.css) | The parts every page shares: page edges, scrollbar, card corners |
| [`design-system/case-study.css`](case-study.css) | The case-study page layout and homepage work cards, built only from the tokens (see §7) |
| [`/styleguide.html`](../styleguide.html) | The old visual style guide (August 2026). Out of date: it still shows the Webflow-era palette and type scale, with its own copy of those values |

---

## Tokens (cleaned up 2026-11-20)

Three tiers, each built on the one above:

| Tier | What it holds | Examples |
|---|---|---|
| **1. Primitives** | Raw values, named by what they are | `--ds-color-grey-800`, `--ds-color-orange-500`, `--ds-font-size-16`, `--ds-radius-8` |
| **2. Semantic** | Roles, named by what a value is for. Components use these | `--ds-color-text-secondary`, `--ds-color-border-default`, `--ds-color-surface-card`, `--ds-type-body-1-size` |
| **3. Component** | One component's own settings | `--ds-btn-*`, `--ds-card-radius`, `--ds-media-radius`, `--ds-team-*`, `--ds-section-arrow-*` |

**Naming rules**
- `--ds-<category>-<name>[-<variant>][-<state>]`, all lowercase, hyphenated.
- Font sizes and radii are named by their pixel value (`--ds-font-size-14`, `--ds-radius-6`).
- Colour ramps run from 950 (darkest) to 100 (lightest); the brand orange is 500. Colours at an alpha end in `-a<percent>` (`--ds-color-white-a75`); channel triplets for `rgb(… / alpha)` end in `-rgb`.
- Text styles are roles: `--ds-type-<role>-<property>`. `-phone` is the size at ≤ 479px; `tokens.css` switches each role's size to it there, so no rule needs its own media query.
- One name per value. A token nothing uses is deleted, not kept "just in case".

**What changed on 2026-11-20.** The 120 old tokens (27 of them unused) became 140 in the three tiers, every one in use; the count grew because roles now have names of their own on top of the raw values. Nothing on the site changed with the rename: every element's computed style on all 15 pages, at desktop and phone width, was compared before and after the rename. 27 unused tokens were removed (four light greys, `#333`, pink, the Webflow green, purple, the serif and pixel families, 36/40/64px sizes, semibold/bold/extrabold weights, 12/16/20/24px radii, the CTA gradient, the divider grey). Main renames:

| Old | New |
|---|---|
| `--ds-black`, `--ds-white` | `--ds-color-black`, `--ds-color-white`; as text colour `--ds-color-text-primary` |
| `--ds-orange` / `-deep` / `-darkest` / `-ember` / `--ds-coral` | `--ds-color-orange-500` / `-800` / `-950` / `-850` / `-400`; as text `--ds-color-text-accent` / `-highlight`, as a frame `--ds-color-border-accent`, as a focus outline `--ds-color-focus-ring` |
| `--ds-text-body`, `--ds-text-muted`, `--ds-body-color` | `--ds-color-text-soft`, `--ds-color-text-muted`, `--ds-type-body-1-color` (= `--ds-color-text-secondary`) |
| `--ds-surface-card`, `--ds-surface-1`, `--ds-grey-800` | `--ds-color-surface-card`, `--ds-color-surface-floating`, `--ds-color-surface-tooltip` |
| `--ds-border-strong` | `--ds-color-border-default` |
| `--ds-overlay-white-5/8/10`, `--ds-overlay-black-70` | `--ds-color-overlay-subtle/hover/active`, `--ds-color-scrim` |
| `--ds-brand-green`, `--ds-brand-green-light`, `--ds-red` | `--ds-color-success`, `--ds-color-text-success`, `--ds-color-text-error` |
| `--ds-font-primary` / `-secondary` / `-display` / `-mono` / `-body` | `--ds-font-family-sans` / `-body` / `-display` / `-mono`; `--ds-type-body-1-font` |
| `--ds-text-xs … -7xl` (sizes) | `--ds-font-size-12 … -56` |
| `--ds-weight-*`, `--ds-leading-heading` | `--ds-font-weight-*`, `--ds-line-height-tight` |
| `--ds-body-size` / `-compact` / `-leading` | `--ds-type-body-1-size` / `-size-phone` / `-line-height` |
| `--ds-section-title-*`, `--ds-section-label-*` | `--ds-type-section-title-*`, `--ds-type-section-label-*` (`-leading` → `-line-height`, `-compact` → `-phone`) |
| `--ds-radius-xs/sm/md`, `--ds-name-card-radius` | `--ds-radius-2/4/8`, `--ds-team-card-radius` |
| `--ds-grey-600` (avatar ring) | `--ds-team-avatar-ring` |
| `--ds-glass-brown`, `--ds-glass-tint-rgb`, `--ds-glow-rgb` | `--ds-btn-glass-fill`, `--ds-btn-glass-tint-rgb`, `--ds-btn-glow-rgb` |

---

## 1. Color

The identity is **white type on true black**, with orange as the signature accent. Use the semantic tokens; the primitives are there to build them.

### Text

| Token | Value | Use |
|---|---|---|
| `--ds-color-text-primary` | white | Headings, labels, names, bold words in body copy |
| `--ds-color-text-secondary` | white at 75% | Body copy (Body 1 and Body 2) |
| `--ds-color-text-tertiary` | white at 50% | Quieter body copy: the Experience years, the line under "Curious about the journey?" |
| `--ds-color-text-soft` | `#e4e6ee` | Values beside labels ("Boston Bioprocess" under "Company") |
| `--ds-color-text-muted` | `#a1a1a1` | Captions, tags, meta |
| `--ds-color-text-accent` | `#f15a24` | Orange headlines and marks |
| `--ds-color-text-highlight` | `#f87638` | Impact figures, the quote mark |
| `--ds-color-text-success` / `-error` | `#86ceb8` / `#ff4632` | "Live" status; form errors |

### Surfaces, borders and overlays

| Token | Value | Use |
|---|---|---|
| `--ds-color-surface-card` | `#090909` | Cards on the page |
| `--ds-color-surface-floating` | `#141314` | Cards that float with a shadow: testimonials, the feedback popup |
| `--ds-color-surface-tooltip` | `#222222` | Tooltips, the team name card |
| `--ds-color-surface-canvas` | `#161616` (`--ds-color-grey-875`) | The homepage's dotted Lab canvas |
| `--ds-color-border-default` | `#2c2c2c` | Card and tag frames |
| `--ds-color-border-accent` | `#641b00` | Highlighted frames and hover frames |
| `--ds-color-focus-ring` | `#f15a24` | Keyboard focus outline |
| `--ds-color-overlay-subtle` / `-hover` / `-active` | white at 5 / 8 / 10% | Faint fills, hover, pressed; the popup's frame |
| `--ds-color-scrim` | black at 70% | Shadow under floating panels |
| `--ds-color-success` | `#1d8e6b` | "Live" status tint (Yanta design system `brand-60`) |

### Project palettes (scoped — do not promote to global)

Each case study carries its own accent set, and that's intentional:

- **TMF** — `--tmf-blue: #2370f0`
- **Crayon** — purple `#7e06d2`, blue `#6184db`, cyan `#62c5b5`, red `#f55d59`
- **Firefighter** — red `#cc0505`, orange `#e56b66`
- **Combine library** — primary `#6157f8` + grey/error/success/warning ramps
- **Spark library** — interactive `#5532fa`, hover `#1e116e`

**Rule:** a project color lives only on its project page. Global UI (nav, footer, home, about) uses the tokens above only.

---

## 2. Typography

### Faces

| Token | Family | Use |
|---|---|---|
| `--ds-font-family-display` | `Cabin` 500 | Page titles, section titles, case-study headings |
| `--ds-font-family-sans` | `aktiv-grotesk` (Adobe Fonts kit `qjc6msf`) | Labels, names, captions, buttons, navigation |
| `--ds-font-family-body` | `Montserrat` | Body copy: Body 1 and Body 2 |
| `--ds-font-family-mono` | `Spline Sans Mono` | Tags |

Don't add font families: nine already load (several only for older case studies); the goal is fewer.

### Text styles (`type.css`, 2026-11-20)

Every piece of running text on the site is one of these roles. A role has one spec everywhere: same family, size, line height and weight. Colour is separate (see "Text" in §1): body text is 75% white unless marked otherwise.

| Role | Spec | Used for |
|---|---|---|
| **Body 1** | Montserrat 400, 16px / 24px; 14px / 21px on phones (≤ 479px). Bold words white at 500 | All reading text: the case studies (paragraphs, lists, summary cards, Status box, credits, the intro above the hero, Timeline and Team lines, the older studies' text and subheads), the homepage intro and section intros, About and Lab openings, the Résumé intro, the team name card |
| **Body 2** | Montserrat 400, 14px / 21px; 12px / 18px on phones. Highlighted words keep their colour at 500 | Smaller supporting text: work-card descriptions and results lines (desktop and phone lists), the homepage testimonials (keywords white at 500; Anamitra, 2026-11-20), the homepage Experience list, the visitor notes on About, the Lab cards, the line under "Curious about the journey?" |
| **Caption** | aktiv-grotesk 500, 12px / 18px, +0.5px, `--ds-color-text-muted`, at every width | People's roles (testimonials, visitor notes), dates, picture captions, a quote's attribution in a summary card |

- The older studies' subheads (`.ms-body-text-1-b`: "Project Scope:", the orange "01 …" items) are Body 1 at medium weight, in their own colour.
- The Webflow markup marks a paragraph's colour with `.ocp75` (secondary) or `.ocp50` (tertiary). Those used to fade the whole element with opacity, which faded its bold words too; `type.css` turns them into text colours, so bold words are always white.
- Not text roles (their own styles): headings and labels (Cabin titles, `.v25-h3` labels, section headings below), buttons, tags, the contents list, navigation and footer, form fields, the "Available for work" pill.
- Before 2026-11-20 body text came in four versions (16px on the case studies; 14px elsewhere, dropping to 12px on tablets; 14px semi-bold subheads), and small text in four (12px aktiv-grotesk captions; 12px grey labels that dropped to 10px on phones; 14px Montserrat at 50%; 14px aktiv-grotesk).

**Case-study sections** also use a **Cabin 500 heading** (24–32px, white) and **heading 3** for sub-headings and lead statements (Cabin 500, 20–24px, white). Weights are **regular (400) or medium (500) only**: headings, labels and bold emphasis are medium. Spacing under headings: **32px** after a section heading, **20px** after a heading 3, 18px between paragraphs.

### Section headings (two levels, added 2026-11-05)

Homepage and one-pager sections open with one of two headings, each followed by the orange pixel arrow (Brand-hyperlink-arrow, 16 × 15).

| Level | Name | Class | Recipe | Tokens |
|---|---|---|---|---|
| 1 | **Section title** | `.ds-section-title` | Cabin 500, 28px / 1.15, white; the arrow follows the last word 8px away (no space, so it never wraps alone), .1em above the baseline. Below 992px it becomes a Section label | `--ds-type-section-title-font`, `--ds-type-section-title-size`, `--ds-type-section-title-weight`, `--ds-type-section-title-line-height` |
| 2 | **Section label** | `.ds-section-label` | aktiv-grotesk 400, 16px / 1.5 (14px ≤ 479px), white; the arrow 10px after it | `--ds-type-section-label-font`, `--ds-type-section-label-size`, `--ds-type-section-label-size-phone`, `--ds-type-section-label-weight`, `--ds-type-section-label-line-height` |

Both use `--ds-section-arrow-width` and `--ds-section-arrow-height` for the arrow.

- **Section title** is the one-pager's `hello-h2` ("What they say when I stop screen-sharing").
  - On the homepage, these headings use it: "Selected works" and "What others think". On About: "The other half" and "Unfiltered notes from visitors". "Selected works" and "Unfiltered notes" were the 40px `v25-title-text extra-large`, and both dropped their full stop.
  - On the About page, "The other half" uses it too (the page links `tokens.css` and `case-study.css` since 2026-11-05).
  - On phones and tablets (below 992px) it steps down to the Section label look, like every mobile heading.
- **Section label** is "Experience" and the mobile "Selected works". Both still use the Webflow classes (`.v25-h3` in a `.flex-block-78` row), which `.ds-section-label` matches.
- Section titles and labels are in sentence case: only the first word (and names) capitalised.
- Webflow gives every `img` `height: 15px; margin-bottom: 10px; display: block`. Both classes set the arrow's margin in full, otherwise it rides 10px high.

### Sizes and weights

Font sizes in use: `12, 14, 16, 18, 20, 24, 28, 32, 48, 56` px (`--ds-font-size-*`). Weights: `400` regular and `500` medium (`--ds-font-weight-*`). Line heights: `1.15` for headings, `1.5` for body copy, labels and captions (`--ds-line-height-*`).

---

## 3. Shape & radius

- **`8px` for buttons** (primary and secondary, `--ds-btn-radius`, since 2026-11-11).
- **`8px` for every card** (`--ds-card-radius`, since 2026-11-11). The design system's cards use the token where they are defined in `case-study.css`: the case-study summary cards, the "Home" and "Next case study" cards, the work cards, the testimonial cards and the visitor-note cards. Webflow's own boxes get it in `layout.css` ("Cards"), which every page loads: the case studies' closing box ("Curious about the journey?"; its dotted panel is 6px inside the 2px orange frame, so the frame stays even), the phone-size work cards, and the Lab frames and live embeds. The résumé page's cards were already 8px. A new card takes `--ds-card-radius`.
- **`8px` for the feedback popup** on About (`--ds-card-radius`; 12px until 2026-11-11).
- **`8px` for pictures and videos in the case studies** (`--ds-media-radius`, since 2026-11-11): figures, videos, embeds, the closing photo gallery, and the placeholders that stand in for a missing picture. The Yanta studies' rules use the token where they are defined; the older studies' Webflow pictures and videos get it from one rule in `case-study.css`. The heroes (the picture or video at the top of each study) have them too; only Crayon's three small illustrations stay square.
- **`6px` for the team's hover name card** (`--ds-team-card-radius`, Anamitra's call, 2026-11-20; Webflow had 2px).
- **Not cards:** the footer has no corners.
- **`4px` for small chips and tags**, with `2px` for elements nested inside them.
- Webflow's original card radius was `20px` (78 uses); no card on the site uses it now.
- Full scale: `2, 4, 8, 12, 16, 20, 24` px (plus the name card's `6px`), then `100px` pill and `50%` circle.

---

## 4. Breakpoints

Standard Webflow set:

| Range | Meaning |
|---|---|
| ≥ 1500px | The tertiary button switches to its large size (14" laptops and bigger; a 13" MacBook Air window is about 1440–1470px) |
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

### Buttons (`buttons.css`, tokens under "Buttons" in the component tier of `tokens.css`)
Three levels in three fixed sizes, aktiv-grotesk 500, sentence case. They replace the old gradient-frame button (`grad-bg`), the orange "Showcase" button and the orange "Let's talk" pill.

| Level | Class | Look | Use it for |
| --- | --- | --- | --- |
| **Primary** | `.ds-btn.ds-btn--primary` | Black, 8px corners, with a 1.5px border lit from one corner: orange where the light hits the bottom-left corner, fading to a grey hairline around the rest. On hover the light spreads along the border and the black fill drops to 80%, so the orange glows through from the corner | The one action a view exists for. At most one per view |
| **Secondary** | `.ds-btn.ds-btn--secondary` | Ghost: a 1.5px outline (14% white) with no fill, 8px corners. On hover the outline brightens to 34% white and a faint 4% white fill comes in; nothing moves | Everything else: navigation, repeated per-item actions, alternatives |
| **Tertiary** | `.ds-btn-talk` | Dark brown glass pill (`--ds-btn-glass-fill`) with an arrow circle tucked into it, a glass edge and an ember inside. On hover the circle pulls away with a liquid stretch, the arrow turns and the ember spreads | "Let's talk", and "Explore the Lab" on the homepage's Lab canvas |
| **Tertiary, circle** | `.ds-btn-icon` | The tertiary's circle on its own: a 40px brown glass circle with the glass edge and one white icon. On hover an ember lights inside. Works on `<a>` and `<button>` | Icon-only controls: LinkedIn, X and email beside the intro pill; the testimonial deck's previous and next |

**Sizes.** Height, side padding, text size and icon gap are fixed per size (`--ds-btn-{sm,md,lg}-*`), on the common 32 / 40 / 48 ladder. Side padding is twice the vertical padding, the ratio the site's older buttons used (10px 20px, 20px 40px): around a 16px line that is 8 × 16, 12 × 24 and 16 × 32. A button is as wide as its label plus the side padding; nothing stretches it. Corners are 8px on primary and secondary at every size (`--ds-btn-radius`).

| Size | Class | Height | Side padding | Text | Used for |
| --- | --- | --- | --- | --- | --- |
| Small | `.ds-btn--sm` | 32px | 16px | 14px | Defined for dense rows; nothing uses it |
| Medium | (default) | 40px | 24px | 14px | Every button on the site |
| Large | `.ds-btn--lg` | 48px | 32px | 16px | One stand-out action; on primary and secondary nothing uses it yet, the tertiary uses it from 1500px |

The tertiary has two sizes, switched by screen width (Anamitra, 2026-11-20): **medium** below 1500px (40px tall, 14px label, 40px circle, the circle tucked 10px into the pill, sliding 22px on hover, 18px arrow) and **large** from 1500px, medium at 1.2× (48px tall, 16px label, 48px circle, tucked 12px, sliding 26px, 22px arrow; the ember and the circle's light grow with it through `--talk-k`). Every place that uses the tertiary switches together: "Let's talk" on the case studies and "Explore the Lab" on the homepage. The pill fits its label, with the label's side space kept at 1.2× in large: `--talk-pill-md` / `--talk-pill-lg` are 124 / 146px for "Let's talk" and 160 / 186px for "Explore the Lab" (set in `lab-canvas.css`). A new tertiary label sets both. The tokens are `--ds-btn-md-*` and `--ds-btn-lg-*`; the old `--ds-btn-height` and `--ds-btn-size` (the tertiary's fixed size) were removed.

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
| About, visitor notes | Drop your feedback | Secondary | Opens the form; optional |
| About, feedback form | Submit | **Primary** | The form's one committing action |
| Homepage and All works, phone list | Showcase | **Primary** | Each card's one action, under its picture with a 20px gap; a card fills most of a phone screen, so one shows at a time (Anamitra's call, 2026-11-11) |
| Lab | View | Secondary | Repeated on every experiment |
| Resume | Human optimized version · ATS optimized version | Secondary | Two versions of the same file, offered side by side as equals |
| Homepage, What others think | Previous · Next | Tertiary, circle | Icon-only controls that turn the cards, in the same circle as the contact links |
| Case studies, closing box | Let's talk | Tertiary | The one invitation to get in touch |
| Homepage, Lab canvas | Explore the Lab | Tertiary | The canvas's one action, centred on it (Anamitra's design, 2026-11-20) |
| Homepage intro, after the pill | LinkedIn · X · Email | Tertiary, circle | Three ways to reach out, as icons so they stay quiet beside the pill |

**How they're built.** Primary and secondary need no extra markup: `<a class="ds-btn ds-btn--primary">Label</a>` (or a `<button>`). The tertiary has its own markup, written by `talkButton()` in `build-case-studies.mjs`. The tertiary's glass edge and liquid stretch are SVG filters (`#ds-glass-rim`, `#ds-glass-rim-goo`, `#ds-goo`) in a hidden `<svg class="ds-filters">` at the top of every page's `<body>`; the build keeps that block and the `buttons.css` link on every page. Reduced motion turns the transitions off.

**Safari rule for anything inside an SVG filter.** Animate it with `left`, `width` or `background-color`, never with `transform` or `opacity`. While a transform or opacity animation runs, Safari moves the element onto a layer of its own, outside its parent's SVG filter. Until 2026-11-11 the tertiary's circle slid with `transform`, so in Safari it showed as a bare black disc for the whole 0.9s slide: no glass, no edge, no melting into the pill. It now moves with `left`, and the embers fade with `background-color`. Chrome looks the same either way, so check the tertiary in Safari after any change to it.

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
card:   background: #090909 (--ds-color-surface-card); border: 2px solid #2c2c2c (--ds-color-grey-800); border-radius: 8px (--ds-card-radius; Webflow had 4px); the card clips its picture;
lines:  every line in the card is 2px (--ds-card-border-width): the frame, the tags, the line under the picture, the footer divider;
picture: square corners; a 2px #2c2c2c line under it (from 1280px);
tags:   Spline Sans Mono 12px/500, letter-spacing .5px, #a1a1a1, 2px #2c2c2c frame, 3px padding
client: same tag with a 2px #641b00 (--ds-color-orange-800) frame
impact: highlighted figure in #f87638 (--ds-color-orange-400)
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
- **Text:** the quote is Body 2 (`--ds-type-body-2-*`, 14px; 12px on phones), with a few keywords per quote in `<strong>`: full white at medium weight, the body copy's emphasis. Quotes have no quotation marks, since the coral mark above each one does that job. Name and role match the testimonials' `.v25-h3` (aktiv-grotesk 16px) and `.v25-h4.grey` (aktiv-grotesk 12px medium, muted).
- **Card details:** each card has 8px corners (`--ds-card-radius`, as every card), a client tag (`.cs-tag--accent`), the position dots, a Cabin quote mark in coral and the person's photo.

### Lab canvas (homepage, after "What others think"; `lab-canvas.css`, `lab-canvas.js`)
A dark card scattered with Lab experiments, the tools behind them and a few cursors, with the orange particle sphere from the Lab's "Pixel galaxy" turning at the top. Designed on a canvas artboard (2026-11-20) and moved onto the page as is.

- **Card:** `--ds-color-surface-canvas` (#161616) with white dots at 7.2% every 24px, a 2px `--ds-color-border-default` frame and 8px corners (`--ds-radius-8`). It sits on the page edges, 140px below "What others think" and 140px above the footer. It replaced the "What I've been up to" section, which Anamitra removed on 2026-11-20.
- **Stage:** the pieces keep the positions they were designed at, on a fixed 1336 × 532 stage (the card is 1340 × 536 with its frame). `lab-canvas.js` enlarges the stage to fill the card with CSS `zoom`, not a scale transform (2026-11-20): zoom lays the stage out at its real size, so text and icons are drawn sharp; with a scale transform, browsers could draw the stage small and blow it up, which blurred the prompt box and the menus on a 27" screen. From 768px the card keeps the 2.5 : 1 shape and everything shows; below that the card is 3 : 2 (1 : 1 on phones) and the stage is cropped at the sides, so the pieces stay readable.
- **Button:** the tertiary, "Explore the Lab", centred on the card at its real size (not scaled with the stage); large from 1500px, where the canvas has grown past its designed size.
- **Line above the button:** a Figma text layer shown selected (`.lab-textbox`): Body 1 (Montserrat 16px / 24px, 14px on phones, 75% white; from 1500px it grows with the button's large size to 20px / 30px, `--ds-lab-line-size-lg`, Anamitra on a 27" screen, 2026-11-20), in Figma's 1px blue (#0d99ff) selection outline with a 7px white square on each corner, centred 24px above the button (36px from 1500px; `--ds-lab-line-gap`, `--ds-lab-line-gap-lg`) at real size (Anamitra, 2026-11-20). It tells visitors what the Lab holds; the copy is still being chosen.
- **Motion:** every piece floats a few pixels on 8, 10 or 12 second loops (`.fl1`–`.fl3`, offset by `.d1`–`.d3`), except the Ask AI prompt box, the Figma toolbar and the dashboard prototype (bottom right), which hold still (Anamitra, 2026-11-20): the browser animates a float by sliding a snapshot of the piece between screen pixels, which softened their small text and thin icons, most visibly on big screens. Give any new picture or logo a float; keep pieces with small text still. The sphere is 3,000 orange squares drawn on a `<canvas>`; its soft look is accepted (Anamitra compared a pixel-sharp version on 2026-11-20 and kept this one); it turns only while the card is on screen, and the pointer pushes the particles near it away. With reduced motion nothing floats and the sphere is drawn once, still (it still reacts to the pointer).
- **Ask AI prompt box:** Yanta's prototype composer, dark, top left (Anamitra, 2026-11-20). The question ("Plot DO vs time for Batch 333") types itself, waits 2.6s, erases, pauses and types again, in a loop, only while the card is on screen; the caret blinks while it waits; nothing can be edited. The plus and mic turn Yanta grey (gray 50 at 20%) on hover, the send button a lighter teal (#1f8199), each a step darker while pressed. The model picker uses the toolbar's menu, 8px below it, but its rows turn Yanta gray-70 (#525e6f) on hover instead of Figma blue: Yanta has no such blue, and white text on gray-70 is 6.6:1, WCAG AA (gray-60 would be 4.2:1) (Anamitra, 2026-11-20). The model name is medium (500), as the site's buttons. Its rows: Haiku 4.5 (Fastest), Sonnet 4.6 (Balanced, ticked) and Opus 4.5 (Most capable), the prototype's three models and plain-language labels; picking one shows it in the picker. With reduced motion the question just sits there. Both menus share one menu code path in `lab-canvas.js` (one open at a time).
- **Figma toolbar:** centred at the bottom of the card, 28px in like the framed pictures, as Figma's sits at the bottom of its canvas (Anamitra, 2026-11-20; it was under the button, and the pen curve and the purple cursor moved up into that space, the Webflow logo taking the curve's old place on the right). It behaves like Figma's dark UI3 toolbar: tools turn #383838 on hover and #444 while pressed; a click makes a tool the selected one, in Figma blue (#0d99ff). The chevrons open Figma's menus for their slot, Move (Move, Hand tool, Scale), Frame (Frame, Section, Slice), Shape (Rectangle, Line, Arrow, Ellipse, Polygon, Star, Image/video…) and Pen (Pen, Pencil): a #1e1e1e panel with 13px corners, 8px above the bar, rows 24px tall in 11px aktiv-grotesk with a tick, an icon lined up with the toolbar's, the name and Figma's shortcut; rows turn blue on hover. Every menu fits inside the card. Picking a row puts that tool in the slot, ticks it and selects it; Image/video… only highlights. The bar ends with Text (Figma's Actions button was removed). A click elsewhere or Escape closes the menu. Each menu lives inside its owner and is placed by `lab-canvas.css`; while one is open its piece is lifted above the others and the stage above the button, so the tall Shape menu shows over the button's bottom edge (clicks still reach the button). Resizing the window closes the menu. Built from a capture of Figma's shape menu. The toolbar is decorative (`aria-hidden`, out of the tab order).
- **Frames:** the two framed pictures are sized by their picture (frame 9 / 10px, mat 8 / 9px, even on all sides) and pinned to corners 28px in: the Rangers frame top-right (`right`/`top`), the poster bottom-left (`left`/`bottom`). Webflow gives every `<img>` a 10px bottom margin, which `lab-canvas.css` removes inside the stage; without that the frames had a 10px gap under the picture.
- **Pieces:** pictures and logos are in `assets/lab-canvas/`, including the "Anamitra" cursor name tag (`name-tag-anamitra.png`, drawn at 4× in aktiv-grotesk 14px so it scales like the rest; Anamitra asked for it as a picture, not text, 2026-11-20). The Figma toolbar, cursors, pen curve and the Ask AI prompt box are drawn in the markup. Keep pieces clear of the button: its circle slides 22px right on hover, and below 1280px the button is large next to the scaled pieces (v0 was removed for crowding it). Their colours, corners and fonts copy the products they show (Figma, Yanta), so they are illustration, scoped to the canvas like a project palette; rules 1 and 4 below don't apply inside it. The prompt box uses the site's aktiv-grotesk and Spline Sans Mono instead of Yanta's Public Sans and JetBrains Mono.

### Visitor feedback popover ("Drop your feedback", About page)
Since 2026-11-05 the button opens a popover in the manner of shadcn/ui's Popover (`.ds-popover`, styled in [`case-study.css`](case-study.css), run by [`feedback.js`](feedback.js)). Webflow no longer touches it.
- **Panel:** 380px wide, 8px under the button, right-aligned to it. It uses `--ds-color-surface-floating`, a 1px `--ds-color-overlay-active` border, 8px corners (`--ds-card-radius`) and a soft shadow, and fades and scales in over .15s.
- **Opening and closing:** the button opens and closes it; Escape or a click outside closes it too. There's no title and no ✕. Opening puts the cursor in Name.
- **Form:** hairline rows with the label on the left and a borderless field on the right (Name, Role, Company marked "Optional"), then the message. A row lightens while its field has focus. An empty required field gets a small red dot (`--ds-color-red-500`, 6px) at the end of its row; the message's sits at its top right. Hovering the dot shows a "Required field" tooltip to its left. Screen readers hear "Required". There are no red lines. The labels reset Webflow's uppercase `label` style.
- **Footer:** Submit on the left, the form's primary button, and an info badge ("Goes straight to my inbox") on the right. On phones the badge moves under it.
- **Sending:** the form's `action` is Formspree (`https://formspree.io/f/xdeejpvv`). Formspree emails each note under the subject "New portfolio feedback" and keeps 30 days in its dashboard; the free plan allows 50 a month. On success a thank-you replaces the rows, and the next opening brings a fresh form. On failure a red line shows and the text stays. A hidden `_gotcha` field catches bots.
- **Webflow:** the button links to plain `#`. A link to `#feedback-popover` would set off Webflow's smooth scroll.
- **The wall:** the visitor notes are a fixed copy of Webflow's list, each note a `.feedback-card` with 8px corners (`--ds-card-radius`, as every card). A new note only shows up when it's added to `about.html` by hand.
- **Where:** the section ("Unfiltered notes from visitors") is the last one on the About page, above the footer; it moved there from the homepage on 2026-11-11. About loads `feedback.js`; the homepage no longer does.

### Homepage intro pill ("Available for work")
The Webflow "Available for work" pill (`.flex-block-105`) sits under the intro's headline and its line on years of experience. It is 40px tall, the height of the three contact buttons after it (LinkedIn, X and email, `.ds-btn-icon` in `.ds-hero-links`, 12px from the pill and 12px apart, `--ds-btn-row-gap`; on phones they wrap under it). Three things draw the eye to it, and all three hold still for reduced motion:
- **Border beam:** a faint, broad wash of `--ds-color-orange-500` travels round the 2px outline every 3.5s. It spreads over three quarters of the outline with a soft peak in the middle, mixed at 10% (`--ds-beam-strength`) over the resting `--ds-color-orange-850` border, so it reads as a quiet shimmer. Until 2026-11-11 it was a narrow full-strength spark, which read as sharp and distracting. It's a conic gradient in the border, turned by `--ds-beam-angle`.
- **Glow:** the dot's glow breathes slowly every 2.8s: it grows to 1.2× while fading out completely, then comes back.
- **Rotating text:** "Available for work", "Based in US" (with a small inline US flag, `.ds-flag`) and "Open to relocate" take turns, 3s each. Screen readers hear all three once.

### Info badge (`.ds-info-badge`)
A soft pill for a quiet note beside an action: an ⓘ icon (14px) and aktiv-grotesk 12px in `--ds-color-grey-400`, on a `--ds-color-overlay-subtle` fill with a 1px `--ds-color-overlay-hover` border and `--ds-radius-pill` corners. It stays on one line. The mono `.cs-tag` is for labels; this is for a sentence.
---

## 7. Case-study pages

The Yanta case studies (`yanta-*.html`) are generated from the drafts by `build-case-studies.mjs` (drafts stay local; see the script header). They open exactly like the older project pages, then follow the case-study guide — verdict first, then decisions. Their layout lives in [`case-study.css`](case-study.css):

| Block | Class | Notes |
|---|---|---|
| Opening | Webflow `.section-36` markup | Same as `featurely.html` / `tmf1.html`: full-width hero visual (`.cs-visual--hero`, 1440 × 582; replaced by a study's `heroVideo` or `heroImage` once it exists), orange Cabin claim (`.ms-heading-2.orange`), Company / Role / Product, and Project details with Timeline and Team. A timeline in phases (separated by "; " in the draft) shows one phase per line, below the label (`.cs-timeline`) |
| Intro | `.cs-intro` | Above the hero on all nine case studies (Anamitra, 2026-11-20): the About page's opening layout and Webflow markup (`.v25-title-text.extra-large` title left, `.ms-body-text-1.ocp75` paragraphs right in a box at most 360px wide against the right edge, stacked below 768px), on the page's edges at every width, 72px above the hero (48px ≤ 991px). Text comes from each study's `intro` in `build-case-studies.mjs`; for now the study's name and its work-card description |
| Team avatars | `.cs-team` | The older pages' hover (slot widens 43 → 61px and the name card appears), done in CSS instead of Webflow interactions; names and photos go in the script's `team` config. On every project page the photos have a 2px mid-grey ring (`--ds-team-avatar-ring`, #555) and the name card is dark grey (`--ds-color-surface-tooltip`, #222) with the name and role in the body copy's type (`--ds-type-body-1-font`, `--ds-type-body-1-size` / `-compact`, `--ds-type-body-1-line-height`, regular weight), the name white and the role `--ds-type-body-1-color` (75% white), no border, 6px corners, 4px top / 8px sides / 6px bottom, 12px below the photo; teams of 7+ sit in rows of four, 12px apart (Anamitra, 2026-11-20; was white with black text in a 2px orange frame, and orange rings on the photos) |
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
2. **Text uses a role.** Running text is Body 1, Body 2 or Caption (`type.css`); add a selector to a role rather than giving text its own size. Cabin for titles, aktiv-grotesk for labels and UI, Montserrat for body copy; project fonts stay inside their case study.
3. **Project palettes stay scoped** to their pages.
4. **No new radii.** Buttons, cards, the popup, and case-study pictures and videos are 8px (`--ds-btn-radius`, `--ds-card-radius`, `--ds-media-radius`); the team's name card is 6px (`--ds-team-card-radius`); chips and tags are 4px.
5. **Components use semantic tokens** (`--ds-color-text-*`, `--ds-color-surface-*`, `--ds-color-border-*`, `--ds-type-*`), not primitives, wherever a role fits. New sizes come from the font sizes above.
6. `tokens.css` only defines `--ds-*` variables, so linking it changes nothing on its own. It and `type.css` are linked from every page; `build-case-studies.mjs` keeps the links and their `?v=` stamps.

## Known debt (recorded, not yet fixed)

- 238 unique hardcoded colors bypass the named variables.
- Class names are Webflow auto-generated (`div-block-407`, `column-63`…) — 483 distinct custom classes with no semantic naming.
- The Webflow body default is green Montserrat (`#009b5c`), overridden everywhere in practice — a trap for new pages.
