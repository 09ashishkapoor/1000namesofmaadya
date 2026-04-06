# PRD: First-Visit UX and Reading Mode Refresh

## Task
Improve the presentation of the website without substantially changing wording, with a focus on first-time visitor clarity, mobile UX, and a better way to read the 1072 names.

## Goals
- Help first-time visitors understand what the text is within 5 seconds.
- Let users choose language immediately.
- Get users into the names with minimal friction.
- Preserve devotional/traditional tone.
- Preserve existing wording wherever possible because Hindi translation already matches.
- Preserve SEO by keeping key explanatory content crawlable.

## Non-Goals
- Rewriting core devotional copy.
- Large SEO/content strategy overhaul.
- Personalization / continue-where-you-left-off in this phase.

## User Types
1. Curious first-time visitor who wants to understand what this text is.
2. Devotee who wants to start reading quickly.
3. Repeat visitor using the site as reference.

## UX Direction
### Homepage above the fold
- Keep title.
- Keep one short explanatory line from existing content.
- Show language selector prominently.
- Show two clear actions:
  - Primary: Start Reading
  - Secondary: Learn About This Text

### Names experience
- Introduce a focused reading mode.
- Show 11 names at a time.
- Each name initially shows only the name/number.
- Tap/click reveals meaning + elaboration together.
- Search remains available but hidden behind a clear "Search Names" button on mobile.
- Prioritize quick entry into reading over immediate exposure to filters.

### About / significance / benefits content
- Keep wording unchanged as much as possible.
- Keep content crawlable on the homepage to reduce SEO risk.
- Move long explanatory sections below the primary reading path.
- Secondary CTA should jump to that lower explanatory section on the same page.

## Information Architecture
1. Hero / Intro
2. Immediate actions (Start Reading / Learn About This Text)
3. Reading Mode entry
4. Search toggle / search tools
5. Names list (11 at a time)
6. Explanatory sections lower on page
7. Existing supporting content / footer

## Mobile UX Principles
- Above-the-fold clarity over density.
- One primary action.
- Reduced scroll friction.
- Search hidden until requested.
- Reading controls large and thumb-friendly.

## Acceptance Criteria
- First screen communicates what the text is and offers language choice without heavy scrolling.
- A user can enter the names directly from the first screen.
- About/significance content remains available without blocking primary task flow.
- Existing wording is mostly preserved.
- SEO-sensitive explanatory content remains server-rendered/crawlable in HTML.
- Names can be consumed in an 11-at-a-time reading pattern with reveal behavior.

## Risks
- Moving too much content off the homepage could weaken SEO.
- Hiding too much behind interaction could reduce discoverability.
- Reading mode must not feel slower for repeat reference users.

## Recommended Phase Order
1. Reorganize homepage structure.
2. Add clear CTA paths.
3. Refine names reading mode UI.
4. Keep search accessible but secondary.
5. Validate mobile-first flow.
