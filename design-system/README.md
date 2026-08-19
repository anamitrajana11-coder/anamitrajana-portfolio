# ANA™ Design System

The formalized design language of [anamitrajana-portfolio](https://anamitrajana11-coder.github.io/anamitrajana-portfolio/).
Every value in this document was **extracted from the live site's stylesheet** on 2026-08-19 — it describes what the site actually does, organized into rules for keeping it consistent.

**The three pieces:**

| File | What it is |
|---|---|
| `design-system/README.md` | This document — the rules and reference |
| [`design-system/tokens.css`](tokens.css) | The named values (colors, type, radii) as a CSS token sheet |
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
| Secondary | `Montserrat` | Google Fonts | Webflow body default (16px/28px) |
| Serif | `PT Serif` | Google Fonts | Editorial moments in case studies |
| Mono | `Spline Sans Mono` | Google Fonts | Code/data moments |
| Display | `Pixelify Sans` | Google Fonts | Playful accents |

**Rule:** new pages and components use **aktiv-grotesk**. Don't add font families — nine already load; the goal is fewer, not more.

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

---

## 6. Rules going forward

1. **Use tokens, not raw hex.** The stylesheet has 238 unique hardcoded colors; every new color choice should come from this document or be added here first.
2. **aktiv-grotesk for anything global**; project fonts stay inside their case study.
3. **Project palettes stay scoped** to their pages.
4. **20px cards, 4px buttons** — don't invent new radii.
5. **New sizes come from the type scale** above.
6. This folder is documentation-only today — `tokens.css` is not yet linked from any page, so it can be evolved freely without risk to the live site.

## Known debt (recorded, not yet fixed)

- 238 unique hardcoded colors bypass the named variables.
- Class names are Webflow auto-generated (`div-block-407`, `column-63`…) — 483 distinct custom classes with no semantic naming.
- The Webflow body default is green Montserrat (`#009b5c`), overridden everywhere in practice — a trap for new pages.
