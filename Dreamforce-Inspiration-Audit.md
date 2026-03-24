# Dreamforce Inspiration Audit
## For: Intuit for Education Virtual Educator Conference (VEC)
**Source:** salesforce.com/dreamforce — Dreamforce 2025 post-event site
**Purpose:** Reference library to cherry-pick patterns for the VEC site. Not a blueprint — a menu.

---

## 1. Hero Section

### What Dreamforce Does
- **Full-viewport dark background** with a looping sizzle reel video behind the headline
- **7 floating 3D objects** drift independently in the hero space: a robot mascot (Astro), rocket, paper plane, confetti, party face emoji, heart, star — all at different sizes, speeds, and positions
- **Two CTAs**: "Watch now" (primary, filled) + "Join the list" (secondary, ghost)
- **Minimal text**: one large bold headline, one short subline, two buttons — nothing else
- The floating objects are partially behind and partially in front of the headline (z-index layering creates depth)

### What VEC Has / Should Keep
- ✅ **Keep the morphing fuchsia gradient** — more distinctive and brand-accurate than Dreamforce's dark video
- ✅ **Keep the noise texture** — adds the same organic depth that Dreamforce gets from video grain
- ✅ **Floating 3D objects now added** — piggy bank, coins, smiley, calculator, credit card
- ✅ Mix-blend-mode: screen removes black backgrounds so objects float cleanly

### Gap / Opportunity
- Consider a subtle CSS vignette (dark fade) at bottom of hero so it transitions cleanly into the stats bar
- The Dreamforce objects have a slight parallax on scroll — achievable with a few lines of JS (`window.scrollY * factor`)

---

## 2. Navigation

### What Dreamforce Does
- Sticky, minimal, dark background
- Logo left, very few nav links (no mega-menu)
- Single prominent CTA button right: "Watch now" or "Join the list" depending on event state
- No hamburger on desktop — ultra-clean

### What VEC Has / Should Keep
- ✅ VEC nav is already close to this pattern
- Consider: swap "Register Free" CTA pill color to **Kiwi `#3BD85E`** for maximum contrast against the fuchsia hero — it'll pop like nothing else

---

## 3. Stats / Social Proof Bar

### What Dreamforce Does
- Single large number in bold: **"500+ sessions"** — just that, very clean
- Plain text, no icons, sits below the hero as a thin full-width strip
- Background is slightly lighter than the main dark body, creates a subtle section break

### What VEC Has / Should Adopt
- ✅ VEC already has a stats bar with 4 numbers (5,000+ educators, 50+ sessions, 100% free, 20+ speakers)
- **Adopt**: The Cavendish yellow `#FFE01B` for the numbers on dark background — high contrast, very readable, matches Dreamforce's bold number treatment

---

## 4. Keynote / Featured Speaker Spotlight

### What Dreamforce Does
- Full-width alternating sections: large headline left, speaker headshot image right (or vice versa)
- Each section has its own dark tinted background — subtle but creates rhythm
- Star decorative element floats near each headline
- "Watch now" CTA per section
- Speaker photos are editorial quality, large, and slightly overlapping the section boundary

### What VEC Should Build (Gap)
- **Add a Keynote Spotlight section** between the stats bar and the glideshow
- Layout: headline + short description left, large speaker photo (or branded 3D illustration) right
- Use a Fuchsia-tinted dark card background for this section to keep Wild color energy
- CTA: "Register to Watch Live" instead of "Watch now"

---

## 5. Session Content Grid (On-Demand Cards)

### What Dreamforce Does
- Horizontally scrollable card carousel with thumbnail image, series name, episode count, and description
- Cards have a dark glass background, rounded corners, small category tag
- Left/right arrow navigation — no dots
- Featured "collection" badge on card if it's a series vs single episode
- Cards are 16:9 thumbnail ratio with overlaid play icon

### What VEC Has / Should Adopt
- ✅ VEC glideshow is similar but uses 3D icon assets instead of video thumbnails
- **Adopt**: Add an episode count tag ("50+ Sessions") and topic tag pills to each card
- **Adopt**: Arrow navigation instead of just dots — more Dreamforce-like

---

## 6. Speakers Section

### What Dreamforce Does
- Speaker cards are just headshot + name + title — nothing else
- Grid layout, 4 columns on desktop
- Photo is the hero — large, editorial, consistent style
- Hover: subtle scale and name highlight
- No glass cards — just clean white text on dark background

### What VEC Has / Should Adapt
- ✅ VEC has glass morphism speaker cards — these are more premium-feeling than Dreamforce's
- Consider: Add a "Topic tag" pill below the speaker title using a brand accent color

---

## 7. Value Proposition / "Why Attend"

### What Dreamforce Does
- Dreamforce doesn't have an explicit "Why Attend" section — the page's entire rhythm does this implicitly through the keynote spotlights and session count
- The social proof (500+ sessions, CEO appearances) is woven throughout rather than isolated

### VEC Gap / Opportunity
- ✅ VEC has a dedicated "Why Attend" section — this is good for an educator audience that needs to justify attending to their school or district
- Consider adding a "What you'll walk away with" list instead of just benefit cards — more action-oriented for educators

---

## 8. Countdown / Urgency

### What Dreamforce Does
- Dreamforce 2025 is post-event so there's no countdown — instead a "Save the date" CTA
- Pre-event Dreamforce sites used a large typographic countdown — white numbers, dark background, no decorative frame

### What VEC Has
- ✅ VEC has a full countdown timer with Cavendish yellow numbers — this is more than Dreamforce does
- Consider: Place the countdown higher on the page (right below the hero) rather than mid-page — creates more urgency for registrations

---

## 9. Visual Rhythm and Dark/Light Alternation

### What Dreamforce Does
- Stays **dark throughout** — no light sections at all
- Section breaks are created purely through background tints (pure black → near-black → dark gray → etc.)
- The one exception is white text on a light-tinted photo background for social proof quotes

### What VEC Has / Should Consider
- VEC currently has a **cream light section** for the agenda — this is a deliberate Wild-to-Mild contrast moment
- The contrast is good for readability of session cards, but it does break the immersive dark energy
- **Option A:** Keep cream for accessibility + contrast relief
- **Option B:** Switch to a very dark navy (`#0A0F2E`) for agenda, use white cards with dark text — maintains the dark drama throughout
- **Recommendation:** Keep the cream section but make it the *only* light break, and push the wild dark purple/navy energy everywhere else

---

## 10. Footer

### What Dreamforce Does
- Ultra-minimal — Salesforce logo, legal links, nothing else
- Dark background matching the page
- No nav links, no social icons, no email signup

### What VEC Has
- VEC footer has logo + tagline + nav columns — this is more useful for an event site
- The minimal Dreamforce approach works because Salesforce is a known brand — VEC needs more wayfinding

---

## 11. Micro-Animations and Polish Details

### What Dreamforce Does (the stuff that makes it feel premium)
- Floating objects rotate and drift constantly — never stop, never loop obviously
- The sizzle reel video plays silently, looping, behind everything
- Scroll triggers: sections fade and slide in as you scroll down
- Arrow buttons on session carousel have a hover glow
- Play buttons on cards pulse subtly
- The "floating star" decorators appear and disappear between sections as transition punctuation

### What VEC Has / Should Add
- ✅ Floating 3D objects (just added)
- ✅ Scroll fade-in animations with IntersectionObserver
- **Add**: Subtle hover glow on session cards matching the card's accent color
- **Add**: A few small decorative elements between sections — not stars, but maybe small versions of the 3D icons (a tiny coin, a tiny smiley) floating at section dividers

---

## 12. The One Big Thing Dreamforce Does That VEC Doesn't Yet

**Dreamforce has a video sizzle reel** — a 30-60 second highlight video that autoplays silently in the hero. It's the single most emotionally powerful element on the page.

For VEC, once the event happens, you'll have session recordings and highlight moments. **For the pre-event page**, this is an opportunity to create a 30-second "what to expect" teaser — even a motion graphics piece using the brand assets (the 3D icons animated, the mesh gradient, bold text cuts) would be more powerful than any static design.

This is a post-launch add but worth planning for now.

---

## Summary: Cherry-Pick List for VEC

| Pattern | Priority | Effort | Status |
|---------|----------|--------|--------|
| Floating 3D objects in hero | High | Low | ✅ Done |
| Keynote spotlight section | High | Medium | Not yet |
| Dark section alternation (reduce cream) | Medium | Low | Optional |
| Arrow nav on session glideshow | Medium | Low | Not yet |
| Episode/session count tags on cards | Low | Low | Not yet |
| Parallax scroll on floating objects | Low | Low | Optional |
| Pre-event sizzle reel video | High | High | Post-launch |
| Countdown moved above the fold | High | Low | Consider |

---

*Dreamforce Inspiration Audit v1.0*
*Prepared by Caboodle Design for Intuit for Education VEC*
*March 2026*
