# Portfolio Website — Progress & Context Summary (`UNTIL_NOW.md`)

*Last Updated: September 25, 2026*

---

## 🎯 Project Overview & Vision
A distinctive, high-craft personal portfolio for **Varun Shetty** (Designer, Technologist & Visual Storyteller). 
The portfolio marries **tactile sketchbook / physical collage aesthetics** (hand-drawn doodles, washi tape, Polaroid frames, notebook spine) with **high-tempo cinematic tech & motion interactions** (sticky horizontal scroll reels, ambient glow, dynamic themes, sound/video modals, and interactive easter eggs).

---

## 🚀 What We Have Done So Far

### 1. Hero & Navigation
- **Playful Header & Mascot**: Integrated hand-drawn navigation with interactive smiling mascot (`.nav-smile`).
- **Secret Mini-Game Easter Egg**: Added compact 2-line handwritten hint (*"psst... / click 5 times"*) with a gentle, organic hand-drawn dotted arrow (`M 4 4 C 14 16, 28 18, 40 14`) pointing directly at the left corner of the smiley face's mouth (no star). Statically anchored with exact coordinates inside `.nav-smile-slot` to guarantee identical positioning across all monitor sizes.
- **Dynamic Theme Architecture**: Configured multi-stage theme classes (`theme-paper`, `theme-espresso`, default dark charcoal `#222222`) that smoothly adapt background colors based on the active scroll section.

### 2. Section 01: Things I’ve Made (Cinematic Horizontal Reel)
- **Pinned Reel Architecture**: Built a vertical-to-horizontal scroll runway (`.work-reel-pin` & `.work-reel-sticky`) showcasing 4 featured campaigns:
  1. **NIMBU** — Sparkling Citrus (Beverage packaging & AI art direction)
  2. **MITTI No. 07** — Luxury Editorial Perfume
  3. **RAGA** — Acoustic Concept (Melodic heritage x modern industrial tech)
  4. **MONSOON CLUB** — Weatherproof Footwear & Streetwear Drop
- **Floating HUD Bar (`.reel-hud`)**:
  - Live progress track bar with coral gradient fill.
  - Dynamic index counter (`01 / 04` through `04 / 04`).
  - Tactile typography and series kicker (`✦ Series 01 · AI Visual Campaigns`).
- **Sticky Pinning & Runway Fix (Latest Fix)**:
  - Extended the pinning runway from `380vh` to `500vh`.
  - Added an 82% glide mapping with a generous ~18% dwell buffer in `script.js` so that **Card 04 and the HUD bar remain rock-solid on the frame** instead of prematurely unpinning and shooting off-screen when scrolling through cards 03 and 04.
  - Cleaned ancestor overflow rules (`overflow-x: clip` on `html, body` and `overflow: visible` on `.work-section`) to eliminate scroll container traps that broke `position: sticky`.

### 3. Section 02: Motion & Videos (Motion Lab)
- **Storyboard Canvas**: Transition to a warm, light paper storyboard canvas featuring commercial spots, kinetic typography, and animated sequences.
- **Interactive Video Cards & Live Inline Player**: Integrated real looping playback (`Videos/Video 1.mp4`) directly inside the first featured card:
  - **Title & Craft**: Updated to **Intro Video** with craft tools **Adobe Illustrator · After Effects** (timer badge removed).
  - **Tags & Copy**: Replaced tags with **`2D Rigging`**, **`Beat Sync`**, and **`Kinetic Text`** with a focused high-tempo intro description.
  - **Vertical Reel 1080x1920 (9:16) Format**: Exact 9:16 aspect ratio (`1080x1920`) on Card 1 without cropping.
  - **Cards 2 & 3 16:9 Widescreen Alignment**: Set both Cards 2 and 3 video screens to canonical 16:9 (`aspect-ratio: 16 / 9`), perfectly balancing their stacked height with the 9:16 reel card.
  - **Removed Crossed Badge**: Removed the obsolete bottom-left badge (`.video-live-indicator`).
  - **Inline Exclusive Playback (No Modal)**: Guarded `openVideoModal` and card click listeners so clicking anywhere on the Intro Video card (title, tags, description) never triggers the modal popup lightbox.
  - **Hover Audio Control**: Kept the floating glassmorphic Mute/Unmute button in the top-right corner on hover, and direct click-to-audio functionality right on the card.

### 4. Section 03: Vision Board & Creative Playground
- **Tactile Playground**: Sticky notes, draggable design artifacts, and live experimental software showcases (e.g. Luna interactive lab card).
- **Spacing Polish**: Added clean breathing room between the experimental playground and the adjacent sketchbook section.

### 5. Section 04: About Me (Open Sketchbook Book Design)
- **Hardcover Book Aesthetic**: Retained the physical open-book metaphor with a rounded book spine, left lined paper (`#ead7bd`), and right graph paper (`--cream-soft`).
- **Typography & Content Redesign**:
  - Replaced cramped, illegible text with crisp, readable type hierarchy.
  - **Left Profile Page**: Washi-taped Polaroid portrait, refined title (*"Designer · Technologist · Visual Storyteller"*), structured disciplines (*"AI Creative Direction, Motion Design, Brand Systems, Dev Tools"*), and an off-the-clock section (*Cinema, Sound Design, Architecture, Automation*).
  - **Right Story Page**: Punchy statement (*"Design that earns a second look. Systems keep you there"*), structured manifesto cards (*"Things I care about"* vs *"How I actually work"*), and an active *"open for work"* status card.

### 6. Section 05: Contact & Closing Statement
- **Seamless Flow (Dividing Line Removed)**:
  - Eliminated the awkward horizontal line (`border-top`) and the `#11100f` opaque color-block seam between the About Book and the Contact footer.
  - Made the footer background transparent with a centered radial glow (`radial-gradient(circle at 50% 32%, rgba(239, 91, 69, 0.18), transparent 55%)`), allowing the canvas and dot grid to flow continuously into the contact section as one unified area.
- **Bold Closing CTA**: *"Let’s make something people actually remember"*, direct email action button with copy badge, floating doodles (juice box, ramen, dragon), and clean social links.

---

## 📋 Current Working Files & Structure
- [`index.html`](file:///o:/My%20projects/Portfilio%20website/portfolio%20site/index.html) — Semantic HTML structure across all 5 sections, modals, and doodles.
- [`styles.css`](file:///o:/My%20projects/Portfilio%20website/portfolio%20site/styles.css) — Master stylesheet (CSS variables, responsive layouts, animations, and pinned reel styles).
- [`script.js`](file:///o:/My%20projects/Portfilio%20website/portfolio%20site/script.js) — Scroll engine, theme triggers, reel interpolation with dwell buffers, and interactive micro-interactions.
- [`doodles/`](file:///o:/My%20projects/Portfilio%20website/portfolio%20site/doodles) — Hand-drawn SVG and WebP assets (doodles, illustrations, product imagery).

---

## 🔮 What We Are Focused On Next
1. **Interactive Refinements**: Testing mobile / touch responsiveness for the horizontal reel and modal overlays.
2. **Performance & Asset Loading**: Ensuring all WebP and SVG doodles load smoothly with zero layout shift.
3. **Copy & Visual Polish**: Fine-tuning any remaining text, links, or micro-animations as requested.
