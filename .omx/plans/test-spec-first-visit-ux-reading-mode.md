# Test Spec: First-Visit UX and Reading Mode Refresh

## Objective
Verify that the UX refresh improves first-visit clarity and reading flow without materially changing devotional wording or harming SEO-sensitive content structure.

## Verification Areas

### 1. First-screen clarity
- Homepage shows title and a short explanatory line above the fold on mobile.
- Language selector is visible immediately.
- Primary CTA "Start Reading" is visible without long scrolling.
- Secondary CTA "Learn About This Text" is visible without long scrolling.

### 2. Reading path
- Start Reading jumps directly into the names experience with no intermediary friction.
- Names are shown in 11-item batches.
- Each item starts collapsed.
- Reveal action shows meaning + elaboration together.
- Next/previous or equivalent paging controls work correctly.

### 3. Search behavior
- Search is available from a clearly labeled button/toggle on mobile.
- Search can be opened without losing reading context.
- Search results still operate correctly with lazy loading / paged reading model.

### 4. Explanatory content placement
- About/significance/benefits remain present in crawlable HTML.
- Secondary CTA jumps to explanatory content on the same page.
- Existing wording remains substantially unchanged.

### 5. Mobile UX
- No excessive text wall before primary action.
- Tap targets for CTAs and reveal controls are large enough.
- Reading mode remains usable on narrow screens.

### 6. SEO-preservation checks
- Important explanatory headings/text remain in DOM HTML.
- Existing metadata/schema/canonical remain intact unless intentionally updated.
- Reorganization does not rely on JS-only rendering for essential explanatory copy.

## Manual Scenarios
1. First-time visitor on mobile lands on page, understands what the text is, chooses language, and starts reading within seconds.
2. Curious visitor uses Learn About This Text and can return to names easily.
3. Repeat visitor jumps straight into names and expands entries.
4. Mobile user opens Search Names only when needed.

## Regression Checks
- Language switching still updates landing and names UI.
- Lazy loading of names still works.
- Expand/collapse behavior remains correct.
- Navigation buttons still behave correctly.

## Evidence Required Before Implementation Completion
- Screenshot or manual confirmation of above-the-fold mobile layout.
- Functional verification of CTA jumps.
- Functional verification of 11-at-a-time reading flow.
- Confirmation that explanatory content remains crawlable on the page.
