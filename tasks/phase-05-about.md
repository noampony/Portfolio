# Phase 5 — My Impact Section

> Replaces the previous **About Me** section. This phase focuses on showcasing career impact through interactive impact cards inside a Circular Gallery carousel.

---

## - [ ] Task 5.1 — Define Impact Cards Data

**Goal:** Provide validated data for all career impact cards.

**Depends on:** 4.5, 3.2

**Estimated scope:** Small

**Files likely to change:**
- `lib/content/data/impact.ts`

**Inputs required:**
- Final list of impact cards from the specification
- Optional icons for each impact
- Final ordering of the cards

**Implementation requirements:**
- Create a strongly typed data model for impact cards.
- Each card should contain:
  - Title
  - Optional icon
  - Short description
  - List of impact bullet points
- Preserve the order defined in the specification.
- Keep the data presentation-agnostic.
- Avoid embedding UI logic into the data.

**Acceptance criteria:**
- All impact cards validate successfully.
- No placeholder or missing content remains.
- Data can be consumed directly by the UI.

**Verification steps:**
1. Build passes.
2. All cards render correctly from the data source.

**Security / Privacy checks:**
- Ensure all content is safe for public publication.
- Avoid confidential terminology or implementation details.

**Completion criteria:**
- All impact card data is complete, validated, and production-ready.

---

## - [ ] Task 5.2 — Implement the My Impact Section

**Goal:** Build the My Impact section and integrate the Circular Gallery carousel.

**Depends on:** 5.1

**Estimated scope:** Medium

**Files likely to change:**
- `components/sections/MyImpact.tsx`
- `app/page.tsx`
- `lib/navigation.ts`

**Inputs required:**
- React Bits Circular Gallery animation
- Website design system

**Implementation requirements:**
- Rename the section to **My Impact**.
- Add `id="impact"`.
- Update navigation to use `#impact`.
- Render every impact as an individual card.
- Integrate the React Bits Circular Gallery animation.
- Ensure the cards match the website style:
  - Colors
  - Typography
  - Borders
  - Shadows
  - Hover effects
  - Spacing
- Cards should remain fully readable throughout the animation.

**Acceptance criteria:**
- All impact cards appear inside the carousel.
- Section integrates seamlessly into the homepage.
- Visual design matches the rest of the website.

**Verification steps:**
1. Verify `#impact` anchor.
2. Verify every card is displayed correctly.

**Security / Privacy checks:**
- No confidential information is exposed.

**Accessibility checks:**
- Correct heading hierarchy.
- Cards remain keyboard accessible.

**Completion criteria:**
- The My Impact section renders correctly using the Circular Gallery.

---

## - [ ] Task 5.3 — Implement Carousel Behavior

**Goal:** Complete carousel interactions, responsiveness, and accessibility.

**Depends on:** 5.2

**Estimated scope:** Medium

**Files likely to change:**
- `components/sections/MyImpact.tsx`

**Implementation requirements:**
- Automatically advance to the next card every **3 seconds**.
- Pause autoplay while the active card is hovered.
- Resume autoplay when hover ends.
- Previous / Next navigation buttons on both sides.
- Horizontal mouse wheel / trackpad navigation.
- Touch swipe support on mobile.
- Responsive layout for desktop, tablet, and mobile.
- Respect `prefers-reduced-motion`:
  - Disable autoplay.
  - Reduce animations.
  - Keep manual navigation fully functional.

**Acceptance criteria:**
- Autoplay advances every 3 seconds.
- Hover pauses autoplay.
- Manual navigation works consistently.
- Horizontal scrolling works.
- Swipe gestures work on touch devices.
- Reduced-motion mode behaves correctly.

**Verification steps:**
1. Verify autoplay timing.
2. Verify hover pause/resume.
3. Verify previous/next buttons.
4. Verify horizontal scrolling.
5. Verify touch gestures.
6. Verify reduced-motion behavior.

**Security / Privacy checks:**
- None beyond global project requirements.

**Accessibility checks:**
- Keyboard navigation.
- Visible focus states.
- Accessible labels for navigation buttons.
- Reduced-motion support.

**Completion criteria:**
- Carousel behaves consistently across all supported devices.

---

## - [ ] Task 5.4 — Final Review of the My Impact Section

**Goal:** Verify the My Impact section satisfies all specification requirements.

**Depends on:** 5.3

**Estimated scope:** Small

**Files likely to change:**
- Fixes only

**Implementation requirements:**
Perform a complete validation of the section:

- All impact cards render correctly.
- Carousel behavior matches the specification.
- Navigation works correctly.
- Responsive layouts are polished.
- Reduced-motion behavior is respected.
- No placeholder content remains.

**Acceptance criteria:**
- All completion checks pass.

**Verification steps:**
- Keyboard navigation.
- Responsive layout.
- Autoplay verification.
- Hover pause verification.
- Navigation button verification.
- Scroll and swipe verification.
- Reduced-motion verification.
- Accessibility audit.

**Security / Privacy checks:**
- Public-safe content only.
- No confidential information.

**Accessibility checks:**
- Full accessibility baseline passes.

**Completion criteria:**
- The My Impact section is production-ready and satisfies the specification.