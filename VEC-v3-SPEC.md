# VEC 2026 Event Site -- Design Specification

**Project:** Intuit for Education Virtual Educator Conference 2026
**Version:** v3 Prototype
**Date:** March 23, 2026
**Status:** Design Review

---

## 1. Overview

A single-page event website for the Intuit for Education Virtual Educator Conference (VEC) 2026. The design draws heavily from Dreamforce-level event site patterns -- large-scale visual moments, animated gradients, floating 3D icons, photo grids with stat overlays, and a curved text marquee -- all built with the Intuit for Education "Wild" color system.

The site is built as a **pure HTML/CSS/JS file** with no external UI frameworks (no Bootstrap, no Tailwind), making it fully compatible with Swoogo's custom code environment for production deployment.

---

## 2. Page Architecture

The page follows this section order:

| # | Section | Background | Purpose |
|---|---------|-----------|---------|
| 1 | **Sticky Nav** | Navy | Persistent navigation with logo + links + CTA |
| 2 | **Hero** | Mode A gradient (Fuchsia dominant, 6-blob system) | Event headline, date, dual CTAs |
| 3 | **Stats Bar** | Navy-mid | 4 key metrics: educators, sessions, tracks, free |
| 4 | **Why Attend** | Mode B gradient (Tomato dominant) | 4 numbered value proposition cards |
| 5 | **Community Photo Grid** | White-to-lavender gradient | Asymmetric photo mosaic with stat counter overlays |
| 6 | **Opening Keynote** | Navy with curved bottom edge | Split layout: text left, speaker photo right |
| 7 | **Audience Tracks** | Cream | 4 room cards with gradient accent backgrounds |
| 8 | **Schedule Cutout** | Navy | Day-of timeline with speaker photo cutout |
| 9 | **Session Glideshow** | Navy | Horizontally scrollable session preview cards |
| 10 | **Speakers** | Navy with curved bottom edge | 3x2 grid of speaker placeholder cards |
| 11 | **Curved Text Marquee** | Light blue-to-cream gradient | Dreamforce-style arced scrolling text |
| 12 | **Social Proof Stats** | Cream-to-blue gradient | 4 satisfaction/impact metrics |
| 13 | **Countdown** | Mode B gradient (Tomato dominant) | Live countdown timer + register CTA |
| 14 | **Sponsors** | Cream | Partner logo placeholders |
| 15 | **Footer** | Navy | 4-column layout with logo, links, legal |

---

## 3. Brand System

### Color Palette (CSS Custom Properties)

All colors are defined in `:root` and referenced via `var()` throughout. No hardcoded hex values inline.

| Name | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Fuchsia | #E523FF | `--fuchsia` | Hero gradient dominant, accent highlights |
| Agave | #00D0E0 | `--agave` | Cyan accent, stat numbers, blob accent |
| Kiwi | #3BD85E | `--kiwi` | CTA buttons, success states |
| Cavendish | #FFE01B | `--cavendish` | Warm accent, star decorators |
| Tomato | #FF5C37 | `--tomato` | Mode B gradient dominant, warm energy |
| Watermelon | #FF6C7A | `--watermelon` | Soft pink accent |
| SuperBlue | #3D6AFF | `--superblue` | Arc text, stat numbers, link color |
| Navy | #060B2B | `--navy` | Dark section backgrounds |
| White | #FFFFFF | `--white` | Light backgrounds, text on dark |
| Cream | #F7F5F0 | `--cream` | Warm off-white sections |

### Typography

| Role | Font | Weight | Source |
|------|------|--------|--------|
| Headlines/Display | Avenir Next Intuit | Heavy (900), Bold (700) | Local `/Fonts` folder via @font-face |
| Body Copy | Avenir Next Intuit | Medium (500), Regular (400) | Local `/Fonts` folder via @font-face |
| Labels/Tags/Mono | DM Mono | Regular (400) | Google Fonts CDN |
| Fallback | Montserrat | All weights | System/Google Fonts |

---

## 4. Gradient System

### Mode A -- Hero (Fuchsia Dominant)
- **6 individual animated `<div>` elements** with radial gradients
- Each blob has independent CSS keyframe animation (different durations, directions, scale)
- Colors: Fuchsia (primary mass), Agave (left edge), Tomato (warm pocket), Cavendish (golden spark)
- Blur range: 45px-100px per blob
- Movement: translate + scale transforms, 14-25s duration cycles
- **Must remain as individual divs** -- cannot be simplified to a single CSS gradient (required for morphing effect)

### Mode B -- Why Attend / Countdown (Tomato Dominant)
- Same 6-blob animated approach as Mode A
- Colors shifted: Tomato dominant, with Fuchsia, Watermelon, Cavendish accents
- Used on: Why Attend section, Countdown section

---

## 5. Key Design Components

### Curved Text Marquee
- SVG `<textPath>` following a Dreamforce-identical quadratic bezier arc
- Path: `M -847,643 Q 847,-329 2541,643` (wide upward arc)
- ViewBox: `0 0 1694 674`
- Text scrolls continuously via JavaScript `startOffset` animation (0.5px/frame)
- Font: Avenir Next Heavy, 140px, SuperBlue fill
- Container: `overflow: hidden`, light blue gradient background
- Respects `prefers-reduced-motion`

### Floating 3D Icons
- **Piggy Bank**: Hero section, right side, large (280-320px), gentle float animation
- **Diamond**: Two instances -- top-left (tilted +20deg) and bottom-right (tilted -20deg) near track cards
- **Stacked Coins**: Centered below the curved text marquee
- All use `mix-blend-mode: screen` on dark backgrounds

### Community Photo Grid
- Asymmetric masonry layout: 4 columns top row, 3 columns bottom row
- Real placeholder photos (Pexels) with brand-colored gradient overlays
- Stat counter badges (5,000+, 20+, 4+, 50+) with animated count-up on scroll
- Each tile has a color-tinted overlay matching the Wild palette

### Sticky Registration Widget
- Fixed position, right side, appears on scroll (after hero)
- White glassmorphism card: `backdrop-filter: blur(20px)`, subtle shadow
- Contains: live countdown, "Did we mention FREE?" tagline, Register Now CTA
- Does not appear on mobile (hidden below 768px)

### Section Transitions
- Curved bottom edges on dark sections (Keynote, Speakers) using `::after` pseudo-elements
- 140% width, 100-140px height, `border-radius: 50% 50% 0 0`
- Creates smooth visual flow from dark to light sections

---

## 6. Animation Inventory

| Animation | Type | Duration | Trigger |
|-----------|------|----------|---------|
| Hero blob morphing | CSS keyframes | 14-25s each | Page load, infinite |
| Mode B blob morphing | CSS keyframes | 15-22s each | Page load, infinite |
| Floating 3D icons | CSS keyframes | 11-16s | Page load, infinite |
| Curved text scroll | JS requestAnimationFrame | Continuous | Page load |
| Stat counter count-up | JS IntersectionObserver | ~2s | Scroll into view |
| Section reveals | CSS opacity + translateY | 0.8s | Scroll into view |
| Glideshow horizontal scroll | CSS scroll-snap | User-driven | Drag/swipe |
| Sticky countdown | CSS transition | 0.4s | Scroll position |

All animations wrapped in `@media (prefers-reduced-motion: reduce)` to pause for accessibility.

---

## 7. Responsive Behavior

| Breakpoint | Behavior |
|-----------|----------|
| 1200px+ | Full desktop: 4-column grids, side-by-side layouts |
| 768px-1199px | Tablet: 2-column grids, reduced icon sizes |
| Below 768px | Mobile: single column, stacked layouts, hidden sticky widget |

---

## 8. Assets

### Images (Placeholder)
All photos sourced from Pexels (free license). Located in `/Placeholder Image for Grid/`:
- 9 educator/classroom photos used across Community Grid, Keynote, and Schedule sections
- To be replaced with actual event/brand photography

### 3D Icons
Located in `/Icons to Use/`:
- `piggy-bank.png` -- Hero floating icon
- `diamond.png` -- Decorative accents (2 instances)
- `stacked-coins.png` -- Marquee section accent
- `savings-growth.png` -- Countdown section accent
- Additional available: wallet, dollar-bill, dollar-coin, safe-and-assets, team, savings-dashboard

### Logos
- `Intuit for Education Horizontal logo_White.png` -- Nav and footer (white on dark)
- `Intuit for Education Horizontal logo.svg` -- Vector format available

---

## 9. Technical Notes

- **Single HTML file**: All CSS and JS inline for Swoogo compatibility
- **No external frameworks**: Pure CSS grid/flexbox layouts
- **Font loading**: @font-face with woff2/woff from local `/Fonts` directory
- **Image references**: Relative paths, no base64 encoding
- **Accessibility**: prefers-reduced-motion, semantic HTML, aria labels, alt text
- **Performance**: will-change on animated elements, GPU-accelerated transforms

---

## 10. Content Status

| Content Area | Status |
|-------------|--------|
| Headline/Tagline | Final draft |
| Event date | TBD (placeholder: October 15, 2026) |
| Session names | Real content from Event Brief |
| Room names | Real: Blue, Red, Orange, Green |
| Speaker names | Placeholder (TBD) |
| Speaker photos | Placeholder (TBD) |
| Sponsor logos | Placeholder |
| Registration URL | Placeholder (#) |
| Stats/metrics | Estimated (5,000+, 20+, 4+, 100% free) |

---

## 11. Next Steps

1. Stakeholder review of design direction and layout
2. Finalize event date and registration URL
3. Replace placeholder speaker names and photos
4. Replace placeholder sponsor logos
5. QA responsive behavior across devices
6. Deploy to Swoogo or production hosting
7. Connect live registration form
