---
name: Maa Ādya Mahākālī Sahasranāma
description: A mobile-first devotional reading experience for the 1,072 names of Maa Ādya Mahākālī.
colors:
  kali-crimson: "#dc143c"
  blood-red: "#8b0000"
  lamp-gold: "#ffd700"
  shrine-black: "#0a0a0a"
  night-surface: "#1a1a1a"
  raised-surface: "#2a2a2a"
  soft-ash: "#b0b0b0"
  smoke-pearl: "#f5f5f5"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "clamp(2rem, 7vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.01em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.kali-crimson}"
    textColor: "{colors.smoke-pearl}"
    rounded: "{rounded.full}"
    padding: "18px 40px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.blood-red}"
    textColor: "{colors.smoke-pearl}"
    rounded: "{rounded.full}"
  button-secondary:
    backgroundColor: "{colors.night-surface}"
    textColor: "{colors.smoke-pearl}"
    rounded: "{rounded.full}"
    padding: "18px 40px"
    typography: "{typography.label}"
  input-search:
    backgroundColor: "{colors.night-surface}"
    textColor: "{colors.smoke-pearl}"
    rounded: "{rounded.md}"
    padding: "14px 16px 14px 48px"
    typography: "{typography.body}"
  card-name:
    backgroundColor: "{colors.shrine-black}"
    textColor: "{colors.smoke-pearl}"
    rounded: "{rounded.lg}"
    padding: "24px"
  card-about:
    backgroundColor: "{colors.night-surface}"
    textColor: "{colors.smoke-pearl}"
    rounded: "{rounded.lg}"
    padding: "48px"
---

# Design System: Maa Ādya Mahākālī Sahasranāma

## Overview

**Creative North Star: "The Midnight Shrine"**

This system is a severe, timeless, ceremonial devotional surface. It is built for focus, not spectacle. The visual job is to hold attention on the names, the Goddess, and the act of reading, while creating an atmosphere that feels sacred and grounded rather than commercial or decorative.

The system uses darkness as an enclosure, crimson as invocation, and gold as consecration. Black is not emptiness here, it is sanctified space. Red is not generic urgency, it is Kali-associated force used with discipline. Gold is not luxury polish, it is ritual light. Typography stays modern and readable in the UI, then turns more devotional through serif emphasis where reverence matters.

This system explicitly rejects flashy or clickbait spiritual content, the generic modern SaaS site, noisy social-media aesthetic, dark horror or occult shock styling, and luxury-brand polish that feels commercial and detached from devotion.

**Key Characteristics:**

- Mobile-first and reading-first
- Ceremonial contrast with restrained accent use
- Dark devotional atmosphere with selective sacred highlights
- Rounded, touch-comfortable controls
- Calm structure over novelty

## Colors

The palette is a disciplined shrine palette: one forceful red, one consecrating gold, and a field of black, charcoal, and ash that keeps the sacred accents rare and meaningful.

### Primary

- **Kali Crimson** (`#dc143c`): The principal invocation color. Use it for primary calls to action, focus borders, active emphasis, chevrons, and sacred interface accents that must feel forceful but controlled.
- **Blood Red** (`#8b0000`): The deepened companion to Kali Crimson. Use it in gradients, pressed states, and darker accent transitions where the red needs more gravity.

### Secondary

- **Lamp Gold** (`#ffd700`): The consecrating highlight. Use it for devotional emphasis, select headings, sacred symbols, and rare links or highlights that should feel illuminated rather than promotional.

### Neutral

- **Shrine Black** (`#0a0a0a`): The foundational field. Use for page background, immersive sections, and the deepest visual ground.
- **Night Surface** (`#1a1a1a`): The default contained surface. Use for controls, cards, and elevated reading zones.
- **Raised Surface** (`#2a2a2a`): The upper tonal layer. Use sparingly for hovered or reinforced surfaces.
- **Soft Ash** (`#b0b0b0`): Secondary copy, supportive descriptions, and metadata.
- **Smoke Pearl** (`#f5f5f5`): Primary text and high-clarity interface content.

**The Consecrated Accent Rule.** Kali Crimson and Lamp Gold are sacred accents, not wallpaper. If a screen starts looking red-and-gold everywhere, it has lost devotional authority.

## Typography

**Display Font:** system sans (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`)
**Body Font:** system sans (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`)
**Label/Mono Font:** no separate mono voice in the current system

**Character:** The typography is direct and modern in the interface, then turns ceremonial through spacing, contrast, and selective serif use. Readability is always primary, but the system allows devotional emphasis through serif subheads, sacred symbols, and highlighted lines.

### Hierarchy

- **Display** (700, `clamp(2rem, 7vw, 4.5rem)`, 1.1): Hero naming and major devotional entry points.
- **Headline** (700, `clamp(1.75rem, 4vw, 3rem)`, 1.2): Section titles and primary structural headings.
- **Title** (700, `1.375rem`, 1.3): Name cards and secondary devotional subheads, often in serif treatment for gravity.
- **Body** (400, `1rem`, 1.7): Reading copy, explanations, and list content. Keep long passages within a comfortable reading measure and never sacrifice legibility for atmosphere.
- **Label** (600, `0.9375rem`, 1.4): Buttons, toggles, and compact UI controls.

**The Legibility Before Mystique Rule.** If a type treatment feels more dramatic than readable on a phone, it is wrong. The site is devotional, but it is still a reading tool.

## Elevation

This system is ambient, not stacked like software cards in a dashboard. Depth comes first from tonal separation, overlays, and restrained glow. Shadows and blur exist, but they are atmospheric support, not the main organizing principle.

### Shadow Vocabulary

- **Ambient Low** (`0 2px 8px rgba(0, 0, 0, 0.18)`): Use for compact floating controls that need slight separation from the field.
- **Devotional Lift** (`0 4px 18px rgba(220, 20, 60, 0.42)`): Use on primary action surfaces that need sacred emphasis.
- **Reading Surface** (`0 6px 18px rgba(0, 0, 0, 0.24)`): Use on name cards and contained reading modules.
- **Content Vessel** (`0 8px 32px rgba(0, 0, 0, 0.3)`): Use on larger explanatory cards where tonal containment matters more than theatrical lift.

**The Atmosphere Before Object Rule.** Surfaces should feel held in darkness, not perched on top of it. If shadows start making components feel like generic product cards, reduce them.

## Components

### Buttons

These buttons should feel ceremonial and luminous, never corporate.

- **Shape:** fully pill-shaped (`9999px`) for major actions, with soft curves that stay touch-comfortable.
- **Primary:** crimson-to-blood-red surface with smoke-pearl text, devotional glow, and generous padding (`18px 40px`). Use for the main action only.
- **Hover / Focus:** use lift, border emphasis, and subtle glow. Never rely on frantic motion.
- **Secondary / Ghost:** dark translucent surface with pale text and a light border. It should feel like a respectful alternate route, not a weak afterthought.

### Cards / Containers

Cards are reading vessels, not repeated SaaS modules.

- **Corner Style:** gently rounded (`16px`) for major cards, `12px` for denser controls.
- **Background:** black-to-charcoal tonal layers with restrained gold or crimson influence.
- **Shadow Strategy:** use ambient separation only. Cards should feel settled into the page.
- **Border:** thin, low-contrast border or tonal edge. Never loud ornamental framing.
- **Internal Padding:** `24px` on name cards, `48px` on larger explanatory cards.

### Inputs / Fields

Inputs should feel calm, legible, and immediate on mobile.

- **Style:** dark filled field with high-contrast text, soft radius (`12px`), and clear internal left padding for icon placement.
- **Focus:** crimson border plus a low, restrained focus halo. The focus treatment must be obvious without becoming neon.
- **Error / Disabled:** error messaging should turn to crimson; disabled controls should fade in emphasis but remain readable.

### Navigation

Navigation is mobile-first and utility-first.

- **Floating nav button:** circular, prominent, and reachable with one hand. It may glow slightly, but it must remain calm enough to live over devotional content.
- **Section navigation:** textual links stay simple, high-contrast, and under decorative restraint.
- **State behavior:** active and hover states should clarify movement through the reading flow, not advertise themselves.

### Signature Component

**Name Card Reveal Pattern**
The name card is the system's signature reading unit. It combines a numbered devotional item, a concise meaning line, and an accessible reveal area for elaboration.

- The collapsed state must stay compact and scannable.
- The expanded state must feel like deeper study, not a modal interruption.
- On mobile, expansion should lengthen the page naturally, never create a nested scroll trap.

## Do's and Don'ts

### Do:

- **Do** keep the names and devotional content visually dominant over every decorative effect.
- **Do** use Kali Crimson (`#dc143c`) for primary emphasis, focus states, and key sacred actions only.
- **Do** use Lamp Gold (`#ffd700`) as ritual illumination, not as constant ornament.
- **Do** preserve strong contrast between Smoke Pearl (`#f5f5f5`) text and Shrine Black (`#0a0a0a`) or Night Surface (`#1a1a1a`) backgrounds.
- **Do** keep controls touch-comfortable, rounded, and readable on mobile first.
- **Do** let the interface feel severe, timeless, and ceremonial before it feels expressive.

### Don't:

- **Don't** make this feel like flashy or clickbait spiritual content.
- **Don't** make this resemble a generic modern SaaS site.
- **Don't** drift into a noisy social-media aesthetic.
- **Don't** push the visuals into a dark horror or occult shock experience.
- **Don't** polish it into luxury-brand commercial gloss.
- **Don't** use accent colors so often that the page starts feeling red-and-gold by default.
- **Don't** turn cards, glows, or blur into the main event. If someone notices the effect before the names, the hierarchy is broken.
