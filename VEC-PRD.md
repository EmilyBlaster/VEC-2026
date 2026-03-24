# Product Requirements Document
## Intuit for Education — Virtual Educator Conference (VEC)
**Platform:** Swoogo | **Status:** Draft | **Version:** 1.0

---

## 1. Project Overview

**Event Name:** Virtual Educator Conference — presented by Intuit for Education  
**Format:** Virtual (Swoogo-hosted EventHub)  
**Primary Goal:** Drive registrations and create a premium, high-energy event experience that mirrors the scale and prestige of Dreamforce/INBOUND while staying authentically on-brand with Intuit for Education's Wild color expression.  
**Target Audience:** K–12 and higher education educators, financial literacy instructors, school administrators, curriculum leads

---

## 2. Design Direction

### 2.1 Aesthetic Reference
- **Primary inspiration:** Salesforce Dreamforce — dark, dramatic full-bleed sections, bold typography, speaker spotlights, streaming/on-demand session cards, floating animated elements
- **Secondary inspiration:** INBOUND — tight sticky nav, countdown urgency, community stats, clean CTAs
- **Brand system:** Intuit for Education Financial Literacy Program guidelines, specifically the **Wild** end of the Mild-to-Wild color scale

### 2.2 Color Palette

**Official Intuit for Education Accent Colors**
*(Source: Financial Literacy Program Brand Guidelines, August 22, 2025)*

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--fuchsia` | Fuchsia | `#E523FF` | **Hero gradient dominant** — the most important color. Owns 60%+ of the hero canvas. Primary accent for "Wild" moments. |
| `--agave` | Agave 30 | `#00D0E0` | Hero gradient left-edge bleed. Cyan accent color, teal highlights. Max ~30% of any composition. |
| `--kiwi` | Kiwi | `#3BD85E` | Success states, Why Attend cards, stat highlights, green accent blocks. |
| `--cavendish` | Cavendish | `#FFE01B` | Countdown numbers, stat figures, pull-quote text on dark backgrounds. |
| `--tomato` | Tomato | `#FF5C37` | Hero gradient warm orange pocket. Accent for urgency/CTA moments. |
| `--watermelon` | Watermelon | `#FF6C7A` | Soft pink accent, speaker card tints, light section accents. ⚠️ Verify exact hex with brand team — partially obscured in source. |
| `--superblue` | SuperBlue | `#3D6AFF` | Intuit brand blue thread. Primary CTA buttons, logotype color, iconography base. |
| `--navy` | Deep Navy | `#060B2B` | Page background, dark section fills. |
| `--cream` | Off White | `#F5F3EE` | Light section backgrounds (agenda, sponsors). |

**Hero Gradient Color Roles (from DesiredGradientLead.png):**
- Fuchsia `#E523FF` = dominant, 60%+ of canvas
- Agave `#00D0E0` = left edge accent only
- Tomato `#FF5C37` = small warm pocket, center-bottom

**Design rule — Fuchsia wins.** If the gradient ever looks dark, purple-dominant, or cold, increase Fuchsia blob sizes or raise the base color lightness. The Agave cyan must never expand past ~30% width.

### 2.3 Gradient System

**Hero Mesh Gradient (primary):** Directly matches DesiredGradientLead.png — neon pink/magenta is the **dominant** color (60%+ of canvas). Blue-gray periwinkle bleeds in only from the far left edge. Warm coral-orange sits as a small pocket center-bottom. Base is vivid magenta, NOT dark navy.

```css
/* NEON PINK DOMINANT — matches DesiredGradientLead */
background:
  radial-gradient(ellipse 55% 100% at -5% 50%,  #8090D8 0%, transparent 60%),
  radial-gradient(ellipse 90% 85% at 95%  5%,   #FF007F 0%, transparent 58%),
  radial-gradient(ellipse 75% 65% at 105% 90%,  #E8008A 0%, transparent 52%),
  radial-gradient(ellipse 50% 45% at 48%  78%,  #FF5520 0%, transparent 50%),
  radial-gradient(ellipse 60% 60% at 55%  35%,  #CC22CC 0%, transparent 52%),
  radial-gradient(ellipse 80% 70% at 70%  55%,  #FF3399 0%, transparent 55%),
  #D0188A;
animation: gradShift 22s ease-in-out infinite alternate;

@keyframes gradShift {
  0%   { filter: hue-rotate(0deg)   saturate(1.15) brightness(1.0);  }
  40%  { filter: hue-rotate(12deg)  saturate(1.25) brightness(1.06); }
  70%  { filter: hue-rotate(-6deg)  saturate(1.1)  brightness(1.03); }
  100% { filter: hue-rotate(8deg)   saturate(1.2)  brightness(1.05); }
}
```

**Noise texture:** 18% opacity, `mix-blend-mode: overlay`, `background-size: 180px`.

**Key rule — pink wins.** The blue-gray periwinkle is an accent on the left edge only, never past ~30% of width. If the gradient ever looks dark or purple-dominant, increase pink blob sizes or raise the `#D0188A` base lightness.

**Card accent gradients** — use 2-color combinations from Wild palette:
- Cyan → SuperBlue (cool)
- Purple → Magenta (electric)
- Green → Cyan (neon)
- Navy → Purple (dark rich)

### 2.4 Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / Hero | `Montserrat` or `DM Sans` (Extra Bold 800) | 800 | Very large, condensed feel for hero headlines. Matches brand's bold, block-style display type |
| Section Headings | Same as display | 700 | |
| Body | `DM Sans` | 400–500 | Clean, highly legible |
| Labels / Eyebrows | `DM Mono` or `Space Mono` | 400 | Session tags, category labels |

> **Note for Claude Code:** Import from Google Fonts. Montserrat 800 + DM Sans 400/500/700.

### 2.5 Motion & Animation
- Hero gradient: slow animated `background-position` shift (20–30s loop) to create living, breathing mesh effect
- Floating particle/shape overlays in hero (CSS keyframe animated circles/blobs)
- Card hover: subtle lift + glow in matching accent color (`box-shadow` pulse)
- Section entrance: `Intersection Observer` fade-up stagger on scroll
- Countdown timer: animated flip or smooth decrement

---

## 3. Site Architecture

### Pages Required in Swoogo

| Page | Type | Priority |
|------|------|----------|
| Home / Landing | Marketing page | P0 |
| Register | Registration form | P0 |
| Agenda | Session listing | P0 |
| Speakers | Speaker bios | P0 |
| EventHub (Day-of) | Virtual hub | P0 |
| Waiting Room | Pre-session holding | P1 |
| Live Page | Session stream | P1 |
| On-Demand | Post-session recordings | P1 |
| Sponsors / Partners | Static page | P2 |
| FAQ | Static page | P2 |

---

## 4. Section Specifications — Home Page

### 4.1 Global Navigation (Sticky)
- Background: `--vec-navy` with subtle backdrop blur
- Left: Intuit for Education logo (white version) + "Virtual Educator Conference" wordmark
- Right nav links: Home, Agenda, Speakers, Sponsors, FAQ + **"Register Free" CTA button** (SuperBlue fill, white text, rounded)
- Mobile: Hamburger → full-screen drawer
- Height: ~68px desktop

### 4.2 Hero Banner
**This is the highest-priority visual element. Match the mesh gradient exactly.**
- Full viewport height (`100vh`) on desktop, `85vh` on mobile
- Background: Animated mesh gradient (see Section 2.3) with noise texture overlay
- Centered layout:
  - Eyebrow label: `"VIRTUAL EDUCATOR CONFERENCE"` — monospace, letter-spaced, white/cyan
  - Main headline: e.g. `"Where Financial Education Meets the Future"` — massive, 800 weight, white
  - Sub-headline: 1–2 sentence placeholder description
  - Date/location badge: pill-shaped, semi-transparent white border
  - Two CTAs: `Register Free` (SuperBlue solid) + `Learn More` (ghost/outline)
- Bottom: Scroll indicator or wave divider transitioning to next section

### 4.3 Stats Bar
- Full-width, dark background (navy or deep purple)
- 3–4 large animated counter stats: e.g. `5,000+ Educators` | `50+ Sessions` | `FREE to Attend` | `20+ Expert Speakers`
- Numbers in Energy Yellow; labels in white

### 4.4 About the Event
- Split layout: left body copy + right visual (gradient card or abstract visual)
- Background: `--vec-cream` (light section for contrast relief after dark hero)
- Tone: welcoming, educator-forward

### 4.5 Featured Speakers
**Dreamforce-style speaker spotlight section**
- Dark background with subtle purple gradient
- Section title: Large bold, white
- Speaker cards: headshot (circle or rounded square), name bold, title/org smaller
- Cards: 3-column grid desktop, 1-col mobile
- Card background: semi-transparent dark glass card with SuperBlue border glow on hover
- Placeholder: 6 cards with lorem speaker names/titles

### 4.6 Agenda Preview
- Tabbed or horizontally scrollable timeline
- Each session card: time slot, session title (bold), speaker name, topic tag (color-coded pill)
- Tag color system: SuperBlue = Financial Literacy | Green = Technology | Purple = Pedagogy | Yellow = Keynote
- CTA: "View Full Agenda" button

### 4.7 Countdown Timer
- Bold, centered section with dark/gradient background
- Large flip-card or digital countdown: Days | Hours | Minutes | Seconds
- Numerals: `--vec-yellow` or `--vec-cyan`
- Body text: registration nudge + CTA

### 4.8 Why Attend / Value Props
- 3–4 horizontal cards or icon blocks
- Wild card backgrounds: one cyan, one purple, one navy with green accent
- Icons: minimal line or filled, matching card accent

### 4.9 Sponsor Logos
- Light section (`--vec-cream`)
- Logo strip, grayscale on rest, color on hover
- Optional tier labels: Presenting | Gold | Silver

### 4.11 Footer

- Dark navy background
- Left: Logo + event tagline
- Center: Nav links
- Right: Social icons, email signup
- Bottom: Legal / privacy links, Intuit copyright

---

## 5. Morphing Gradient System — How It Works

The hero uses **six independently animated blob elements** rather than a single static CSS gradient. Each blob is a soft, blurred circle in an official brand color, drifting around the canvas on its own timer. Because none of the timers share a common divisor, the gradient never visibly loops — it's in a unique state at all times.

| Blob | Color | Hex | Role | Animation Duration |
|------|-------|-----|------|--------------------|
| 1 | Fuchsia | `#E523FF` | Large dominant mass, top-right | 18s |
| 2 | Fuchsia | `#E523FF` | Fills lower-right corner | 22s |
| 3 | Agave | `#00D0E0` | Cyan soul, bleeds from left edge | 25s |
| 4 | Tomato | `#FF5C37` | Warm orange pocket, center-bottom | 20s |
| 5 | Fuchsia | `#E523FF` | Mid-canvas fill, lazy wide drift | 28s |
| 6 | Agave | `#00D0E0` | Second cyan shimmer, wanders inward | 32s |

**Base color:** `#CC10EE` — vivid fuchsia so the canvas is never dark even between blob positions.

**Noise texture:** SVG fractal noise overlay at 18% opacity, `mix-blend-mode: overlay`, creating the organic grain visible in the DesiredGradientLead reference.

**Design rule — Fuchsia wins.** If the gradient ever looks cold, dark, or purple-dominant during testing: increase the Fuchsia blob sizes, raise the base color lightness, or reduce Agave blob opacity.

---

## 6. Platform Implementation Guide

This design has been tested and prototyped in HTML/CSS/JS. Below are platform-specific notes for building it in each target environment.

---

### 6.1 Lovable

**Best for:** Full site build with React components, clean code export, good for getting to a shareable URL fast.

**Approach:**
- Paste the full HTML prototype into Lovable's prompt as context, or upload the `.html` file and say *"Convert this to a React app maintaining all styles and animations exactly."*
- Lovable generates React + Tailwind by default. For this project, tell it: *"Do not use Tailwind for the gradient or blob animations — keep those as raw CSS keyframes in a `<style>` tag or a dedicated CSS module."* Tailwind cannot express multi-keyframe blob animations.
- Load Google Fonts via the `<link>` tag in `index.html`: Montserrat 800/900 + DM Sans 400/500/700 + DM Mono 400.
- For the morphing gradient: prompt Lovable to create a `MorphingGradient.jsx` component that renders the 6 blob divs with their individual CSS animations, placed absolutely behind hero content.

**Key prompts to use in Lovable:**
> *"The hero background is made of 6 absolutely positioned div elements with radial-gradient backgrounds and individual CSS keyframe animations. Keep all blob animations in raw CSS, not Tailwind classes."*

> *"Images with black backgrounds (logo, icons) need `mix-blend-mode: screen` applied so black disappears on dark backgrounds."*

> *"All brand colors are defined as CSS custom properties on :root — do not hardcode hex values inline."*

**Watch out for:** Lovable sometimes replaces custom CSS with Tailwind equivalents. If it does, prompt: *"Revert the blob animation CSS to the raw keyframe version — Tailwind classes cannot replicate this."*

---

### 6.2 Replit

**Best for:** Direct HTML/CSS/JS editing, fastest to test, easiest to share via Replit URL, great for iterating on the gradient live.

**Approach:**
- Create a new Replit with the **HTML/CSS/JS** template.
- Paste the full `VEC-v2.html` contents directly into `index.html`. It is a single self-contained file — no dependencies needed.
- All images (logo, 3D icons) are base64-encoded inside the file, so it works immediately with zero setup.
- Use Replit's built-in preview to see the live result instantly.

**Iterating on the gradient in Replit:**
The blob CSS lives between lines `~70–160` of the file. To experiment:
- Increase blob `width`/`height` to make colors cover more canvas.
- Change `animation` duration (e.g. `18s` → `12s`) to speed up morphing.
- Adjust blob `opacity` to make colors more or less intense.
- Swap hex values to test different color combinations.

**Key prompts for Replit AI:**
> *"The morphing gradient uses 6 div elements with class `hero__blob--1` through `hero__blob--6`. Each has a unique CSS keyframe animation. Adjust blob 3 to drift further into the center of the canvas."*

**Watch out for:** Replit's HTML preview sometimes strips `<style>` tags with complex keyframes. If animations disappear, add `!important` to the animation property or move styles to a separate `styles.css` file.

---

### 6.3 Builder.io

**Best for:** Visual drag-and-drop editing after the coded foundation is set, connecting to a CMS for copy updates, handing off to a non-developer for content edits later.

**Approach:**
- Builder.io works best when you import the design as a **Custom Code Component**.
- In Builder, go to **Content → Custom Component** and paste the hero section HTML + CSS as an embedded block.
- The morphing gradient (the 6 blob divs + CSS) should live in a **Custom Code block** — Builder's drag-and-drop cannot create CSS keyframe animations visually, so this section must stay as code.
- Everything *around* the gradient (text content, CTAs, speaker cards, agenda) can then be managed in Builder's visual editor once the code foundation is in.

**Key prompts for Builder.io AI:**
> *"Create a Hero section component with a full-viewport height container. The background is handled by injected CSS — do not add any background color to this component. Layer the text content above the background using z-index: 2."*

**Watch out for:** Builder's visual editor will try to add inline `background` styles to containers. Always check that the hero container has `background: none` in Builder's style panel so it doesn't fight the CSS blob system.

---

### 6.4 Figma Make

**Best for:** Generating a Figma design from the prototype to share with stakeholders, create assets, or hand off to a Figma-based design team.

**Approach:**
- Figma Make (aka Figma's AI generation tool) works best from a detailed visual description + color tokens rather than raw code.
- Feed it the color palette and section specs from this PRD rather than the HTML file.
- For the gradient: Figma cannot animate, but you can create a **static snapshot** of the gradient for design mockups using Figma's mesh gradient plugin or by importing a screenshot of the animated gradient at its best-looking frame.

**Recommended Figma Make prompt:**
> *"Design a virtual event landing page for 'Intuit for Education Virtual Educator Conference.' Hero section: full-viewport height with a vivid fuchsia (#E523FF) mesh gradient — pink/magenta dominant, cyan (#00D0E0) bleeding in from the left edge only, warm orange (#FF5C37) pocket at center-bottom. White headline text, Montserrat 900 bold, very large. Navigation: frosted glass, white logo left, nav links right. Below hero: dark navy stats bar with yellow (#FFE01B) large numbers. Dark background throughout except one cream (#F5F3EE) section for agenda. Style: bold, high-energy, 'Wild' end of a mild-to-wild scale."*

**For the gradient specifically in Figma:**
- Use the **Mesh Gradient** Figma plugin to recreate the color positions.
- Place color stops: Fuchsia `#E523FF` top-right (large), Agave `#00D0E0` left edge, Tomato `#FF5C37` center-bottom, base fill `#CC10EE`.
- Add a noise texture overlay: use a noise PNG at 18% opacity on a layer above the gradient with `Overlay` blend mode.

**Watch out for:** Figma Make may default to a more conservative/corporate look. If the output looks mild or flat, add to your prompt: *"The style should be wild, neon, saturated — NOT corporate or conservative. More rave poster than business brochure."*

---

## 7. Swoogo Implementation Notes

### 7.1 Platform Capabilities
Swoogo uses a drag-and-drop page builder with widgets. For this level of custom design, the key tools are:
- **Snippets Widget** *(added 2025)* — drag-and-drop embed of raw HTML/CSS/JS. This is the primary vehicle for our custom sections.
- **Custom HTML Widget** — older version of the same concept, also works.
- **Global CSS field** — in site settings, paste CSS variables and font imports here once so they apply across all pages.
- **Registration Form Widget** — limited styling, but you can wrap it in a styled container.
- **Session List Widget** — for agenda page; style around it with custom CSS.
- **Speaker Widget** — for speaker listing.

### 7.2 Recommended Build Approach in Swoogo
1. Start with a **blank page template** — not a pre-styled theme.
2. Add a **Snippets Widget** spanning full width for each major section (Hero, Stats, Glideshow, Speakers, etc.)
3. Paste the relevant HTML + `<style>` block from the prototype into each widget.
4. Load Google Fonts once in the **Global CSS** field: `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');`
5. Define all CSS custom properties (color tokens) in Global CSS so every widget inherits them.
6. The morphing gradient blobs **will work** in Swoogo's Snippets Widget — CSS animations are fully supported.

### 7.3 Known Swoogo Constraints
- Registration form widget styling is limited — wrap it in a styled container but let Swoogo's form render underneath.
- JavaScript intersection observers and countdown timers should be tested — JS in widgets may be sandboxed depending on your plan.
- Video backgrounds require a `<video>` tag inside a Snippets Widget; Swoogo has no native video background feature.
- Always confirm your plan includes **Snippets Widget** and **Global CSS** access with your Swoogo account manager before building.

### 7.4 Asset Dimensions

| Asset | Dimensions | Format | Notes |
|-------|------------|--------|-------|
| Hero background (fallback image) | 1920 × 900px | JPG/WebP | Only needed if CSS gradient fails |
| Event / nav logo (white version) | Max 220 × 60px | SVG preferred, PNG ok | `mix-blend-mode: screen` for dark backgrounds |
| 3D icon assets | 400 × 400px min | PNG, transparent background | Use `mix-blend-mode: screen` on dark; true transparent PNG on light |
| Speaker headshots | 400 × 400px | JPG or PNG | Always square; cropped to circle in CSS |
| Sponsor logos | Up to 400 × 200px | PNG, transparent background | No white boxes |
| Session card thumbnail | 800 × 450px | JPG | 16:9 ratio |
| Email header | 600 × 200px | JPG or PNG | Swoogo email editor is 600px wide |
| OG / social share image | 1200 × 630px | JPG | Set in event settings — controls LinkedIn/Slack previews |
| Favicon | 32 × 32px | PNG or ICO | Shows in browser tab |
| Max content width | 1280px centered | — | Full-bleed backgrounds, centered content |
| Mobile breakpoint | 768px | — | Swoogo is fully responsive |

---

## 8. Confirmed Event Content (from VEC 2026 Programs Event Brief)

### 8.1 Event Format
- **Format:** Virtual, multi-room breakout structure
- **Platform:** Zoom (room-based)
- **Audience segments:** General Teachers, CTE Teachers, Higher Ed Faculty, Administrators

### 8.2 Official Agenda Structure

**Main Stage (All Attendees)**

| Time | Session | Details |
|------|---------|---------|
| Opening | Welcome and Introduction (15 min) | Opening Remarks, Engagement Activity, Navigation Support |
| Closing | Wrap Up and Send Off (15 min) | Gamification Results, Calls to Action, Post-Survey |

**Breakout Rooms — Attendees self-select their track**

| Room | Color | Audience |
|------|-------|----------|
| Blue Room | SuperBlue `#3D6AFF` | General Teachers |
| Red Room | Tomato `#FF5C37` / deep red `#C43A00` | CTE Teachers Only |
| Orange Room | Tomato/amber `#E87A00` | Higher Education |
| Green Room | Kiwi `#3BD85E` | Administrators Only |

**Session Schedule by Room**

| Slot | Blue Room | Red Room | Orange Room | Green Room |
|------|-----------|----------|-------------|------------|
| Targeted Session (30 min) | General Teacher Content | CTE Teachers Content | Higher Ed Content | Admin Content |
| Breakout 1 (30 min) | Tax Activity Session | CTE Alignment and Certifications | FYE Budgeting Activity | Partner Session |
| Breakout 2 (30 min) | Holding Financial Discussions | QuickBooks for CTE | QuickBooks for Higher Ed | Partner Session |
| Breakout 3 (30 min) | Credit and Debt Activity Session | Self-Paced Course Highlights | HEFWA Competencies | Partner Session |
| Breakout 4 (30 min) | Budgeting and Tools Activity Session | AI and Financial Calculators | Higher Ed Partner Spotlight | Partner Session |

**Note:** 5-minute breaks between each breakout slot. Attendees navigate back to Main Stage for closing.

### 8.3 Agenda UX Notes for the Site
- The agenda section should **show all four rooms side by side** in a 4-column grid so educators can immediately see which room is right for them — this is how the prototype is built
- Room color coding must match the brand palette (Blue, Tomato-Red, Tomato-Orange, Kiwi-Green) for instant visual association
- A prominent "Which Room Is Right for Me?" CTA or filter is a high-value addition — educators need to self-select by audience type
- The gamification results at Wrap Up suggest a leaderboard or points element — worth adding to the site as a teaser ("Earn points. Win prizes.")

### 8.4 Remaining Copy Placeholders (Awaiting Confirmation)

| Element | Status | Notes |
|---------|--------|-------|
| Event date | TBD | Replace countdown target date |
| Speaker names and headshots | TBD | 6 speaker cards in prototype |
| Partner session details | TBD | Green Room sessions labeled "Partner Session" |
| Gamification details | TBD | What are the prizes/points system? |
| Registration URL | TBD | Currently `href="#"` throughout |
| Event tagline | TBD | Placeholder: "The premier virtual gathering for financial education leaders." |

---

## 9. Gradient Reference — Two Official Modes

From the brand guidelines (Mesh Background examples, August 2025), there are two validated mesh gradient treatments:

### Mode A — Fuchsia Dominant *(current hero)*
The DesiredGradientLead reference: Fuchsia `#E523FF` dominates (60%+ of canvas), Agave `#00D0E0` left-edge accent, Tomato `#FF5C37` warm pocket center-bottom. Base: `#CC10EE`.

### Mode B — Tomato/Orange Dominant *(from 604.png "Know Money" example)*
Orange/warm tones dominate: Tomato `#FF5C37` and warm amber drive the mid-canvas energy. Fuchsia `#E523FF` bleeds in from upper-right. Agave `#00D0E0` / SuperBlue creates the cool left-edge. This version reads warmer, more energetic, slightly more approachable.

**Suggested use for VEC:**
- Hero banner: **Mode A (Fuchsia dominant)** — more premium, dramatic, Dreamforce-energy
- Section accent cards, Why Attend cards, inner page banners: **Mode B (Tomato dominant)** — warm, welcoming, educator-friendly
- Both modes use the same 6-blob animated system; just swap the dominant color blob hex values

**Mode B CSS (Tomato dominant):**
```css
background:
  radial-gradient(ellipse 50% 100% at -5% 50%, #00D0E0 0%, transparent 56%),  /* Agave left */
  radial-gradient(ellipse 90% 80% at 100% 0%,  #FF5C37 0%, transparent 55%),  /* Tomato top-right DOMINANT */
  radial-gradient(ellipse 75% 65% at 108% 95%, #FF5C37 0%, transparent 50%),  /* Tomato lower-right */
  radial-gradient(ellipse 48% 42% at 50% 80%,  #E523FF 0%, transparent 48%),  /* Fuchsia accent center */
  radial-gradient(ellipse 70% 60% at 65% 45%,  #FF5C37 0%, transparent 52%),  /* Tomato mid fill */
  radial-gradient(ellipse 50% 50% at 30% 30%,  #E87A00 0%, transparent 48%),  /* Amber bridge */
  #E85A00; /* Base: warm orange — canvas starts HOT */
```

---

## 10. Accessibility Requirements
- WCAG 2.1 AA minimum
- All text on gradient backgrounds must pass 4.5:1 contrast ratio — use white or Cavendish yellow `#FFE01B`
- All images require `alt` attributes
- Keyboard-navigable nav and CTAs
- ARIA labels on countdown timer and interactive elements
- `@media (prefers-reduced-motion: reduce)` must pause all blob animations and the glideshow autoplay

---

## 11. Implementation Instructions for AI Coding Tools

When prompting any AI coding tool (Lovable, Claude Code, Replit AI, Builder.io, etc.):

1. **Morphing gradient**: 6 independently animated `div` blobs — NOT a single CSS `background` with stacked radial-gradients. Each blob has its own `@keyframes` with different duration so they never sync.
2. **No emojis anywhere** — use typographic numbers (01, 02, 03) or SVG icons instead.
3. **Logo/icon blend mode**: `mix-blend-mode: screen` on all images placed on dark backgrounds. Use true transparent PNG for images on light backgrounds.
4. **Fonts**: Montserrat 800/900 (display) + DM Sans 400/500/700 (body) + DM Mono 400 (labels/mono). Load from Google Fonts.
5. **Color tokens**: All 6 official brand accent colors defined as CSS custom properties on `:root`. Never hardcode hex values inline.
6. **No external UI frameworks** (no Bootstrap, no Tailwind CDN) for the Swoogo build — pure CSS for compatibility.
7. **Glideshow**: The session cards scroll section uses JavaScript `IntersectionObserver` + manual scroll with dot navigation — NOT a third-party carousel library.
8. **Countdown timer**: Vanilla JS `setInterval` targeting a hardcoded event date placeholder.
9. **Scroll animations**: `IntersectionObserver` fade-up with staggered `transition-delay` on section entry.
10. **Glass cards**: `background: rgba(255,255,255,0.07)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(255,255,255,0.14)`.

---

*PRD v2.0 — Prepared for Caboodle Design / Intuit for Education*
*Last updated: March 2026*
*Awaiting: final copy, confirmed event date, speaker headshots, sponsor logos, Swoogo account access*

### 5.1 Platform Capabilities
Swoogo uses a **drag-and-drop page builder** with "Content Widgets." For custom design at this level, you will primarily use:
- **Custom HTML Widget** — embed raw HTML/CSS/JS sections (most design control)
- **Image Widget** — for static hero or section backgrounds
- **Registration Form Widget** — for the reg page (cannot be deeply restyled via HTML)
- **Session List Widget** — for agenda page
- **Speaker Widget** — for speaker listing

### 5.2 Recommended Approach for Custom Code
Because Swoogo's default templates won't match this design spec, the recommended strategy is:
1. Use Swoogo's **blank page template** as the base
2. Inject the full branded page layout as a **Custom HTML Widget** that spans full-width
3. Use `<style>` blocks embedded within each widget for scoped CSS
4. For global styles (nav, footer), Swoogo allows a **Global CSS field** in site settings — use this for CSS variables and resets

### 5.3 Dimension Specs

| Asset | Dimensions | Format | Notes |
|-------|------------|--------|-------|
| Hero banner image (if static) | 1920 × 900px | JPG/WebP | For image-based hero fallback |
| Hero gradient (CSS) | Full-width CSS | n/a | Preferred over static image |
| Speaker headshots | 400 × 400px | JPG/PNG | Square, cropped to circle in CSS |
| Sponsor logos | Up to 400 × 200px | SVG or PNG (transparent bg) | |
| Favicon | 32 × 32px | PNG | |
| Social share image (OG) | 1200 × 630px | JPG | For link previews |
| Nav logo | Max 220 × 60px | SVG preferred | White version |
| Session card thumbnail | 800 × 450px | JPG | 16:9 ratio |
| Email header (Swoogo emails) | 600 × 200px | JPG/PNG | |
| Mobile breakpoint | 768px | — | Swoogo is mobile-responsive |
| Max content width | 1280px | — | Centered, with full-bleed backgrounds |

### 5.4 Known Swoogo Constraints to Design Around
- Registration form widget styling is limited — design a styled wrapper/intro above the form, then let Swoogo's form render underneath
- Custom fonts must be loaded via `@import` in a `<style>` tag within each Custom HTML Widget, or via Global CSS
- JavaScript in Custom HTML Widgets may be sandboxed — test intersection observers and countdown timers carefully
- Video backgrounds in hero sections: use `<video>` tags inside Custom HTML Widget if desired (Swoogo doesn't natively support video backgrounds)


