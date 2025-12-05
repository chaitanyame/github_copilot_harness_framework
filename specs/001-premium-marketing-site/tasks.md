# Task List

**Feature Branch**: `001-premium-marketing-site`
Generated from: [plan.md](plan.md)
Date: 2024-12-04

## Overview
- **Total Tasks**: 28
- **Estimated Sessions**: 6

---

## Task Categories

### Category: Phase 1 - Project Scaffolding & Docker Setup

#### Task 1: Create Multi-Stage Dockerfile
- **ID**: T001
- **Priority**: P1
- **Complexity**: Medium
- **Depends On**: None
- **Estimated Effort**: 1 session (partial)

**Description**:
Create a multi-stage Dockerfile that:
1. Stage 1 (`builder`): Uses Node.js 20 Alpine image, installs dependencies, and builds the Next.js application.
2. Stage 2 (`runner`): Uses Nginx Alpine to serve the static export from `out/`.

**Acceptance Criteria**:
- [ ] Dockerfile exists at project root.
- [ ] `docker build -t premium-site .` completes without errors.
- [ ] Built image serves static files on port 80.

**Files to Modify/Create**:
- `Dockerfile`

**Testing Notes**:
Run `docker build -t premium-site .` and `docker run -p 8080:80 premium-site`. Visit `http://localhost:8080`.

---

#### Task 2: Create docker-compose.yml for Development
- **ID**: T002
- **Priority**: P1
- **Complexity**: Low
- **Depends On**: T001
- **Estimated Effort**: 1 session (partial)

**Description**:
Create a `docker-compose.yml` file for local development that:
1. Mounts the source code as a volume.
2. Runs `npm run dev` inside the container.
3. Exposes port 3000.

**Acceptance Criteria**:
- [ ] `docker-compose up` starts the Next.js dev server.
- [ ] Hot-reload works when source files change.

**Files to Modify/Create**:
- `docker-compose.yml`

**Testing Notes**:
Run `docker-compose up`, edit a file, and verify the browser updates.

---

#### Task 3: Create .dockerignore and .env.example
- **ID**: T003
- **Priority**: P2
- **Complexity**: Low
- **Depends On**: None
- **Estimated Effort**: 1 session (partial)

**Description**:
1. Create `.dockerignore` to exclude `node_modules`, `.next`, `out`, `.git`, etc.
2. Create `.env.example` with placeholder environment variables (if any).

**Acceptance Criteria**:
- [ ] `.dockerignore` excludes build artifacts and `node_modules`.
- [ ] `.env.example` exists (can be empty initially).

**Files to Modify/Create**:
- `.dockerignore`
- `.env.example`

**Testing Notes**:
Verify Docker build context is small by checking build speed.

---

#### Task 4: Initialize Next.js App with TypeScript & Tailwind
- **ID**: T004
- **Priority**: P1
- **Complexity**: Medium
- **Depends On**: T001, T002
- **Estimated Effort**: 1 session (partial)

**Description**:
Inside the Docker container, run the Next.js initializer:
1. Use App Router (`src/` directory).
2. Enable TypeScript.
3. Install Tailwind CSS.
4. Install dependencies: `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`.

**Acceptance Criteria**:
- [ ] `src/app/page.tsx` renders a "Hello World".
- [ ] Tailwind classes work (e.g., `bg-blue-500`).
- [ ] TypeScript compiles without errors.

**Files to Modify/Create**:
- `package.json`
- `tsconfig.json`
- `next.config.js` (or `.mjs`)
- `tailwind.config.ts`
- `postcss.config.js`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

**Testing Notes**:
Run `docker-compose up` and visit `http://localhost:3000`.

---

#### Task 5: Configure Tailwind Design Tokens
- **ID**: T005
- **Priority**: P1
- **Complexity**: Medium
- **Depends On**: T004
- **Estimated Effort**: 1 session (partial)

**Description**:
Update `tailwind.config.ts` to define the design system:
1. **Colors**: `neutral` (gray scale), `accent` (brand blue/purple).
2. **Typography**: `fontFamily.display` (Inter), `fontFamily.body` (system-ui).
3. **Spacing**: Add `hero` (100vh) and `section` (6rem) custom values.
4. **Dark Mode**: Enable `darkMode: 'class'`.

**Acceptance Criteria**:
- [ ] `bg-accent` and `text-neutral-900` classes work.
- [ ] `font-display` and `font-body` classes are available.
- [ ] `dark:bg-neutral-950` works when `.dark` class is on `<html>`.

**Files to Modify/Create**:
- `tailwind.config.ts`
- `src/app/globals.css` (CSS variables for colors)

**Testing Notes**:
Apply various token classes in `page.tsx` and verify visually.

---

#### Task 6: Set Up next/font with Inter
- **ID**: T006
- **Priority**: P2
- **Complexity**: Low
- **Depends On**: T004
- **Estimated Effort**: 1 session (partial)

**Description**:
Use `next/font/google` to self-host the Inter font for optimal performance.
1. Import Inter in `layout.tsx`.
2. Apply the font variable to the `<html>` tag.
3. Reference `--font-display` in Tailwind config.

**Acceptance Criteria**:
- [ ] Inter font is loaded and applied to headings.
- [ ] No FOUT (Flash of Unstyled Text) or CLS.

**Files to Modify/Create**:
- `src/app/layout.tsx`

**Testing Notes**:
Inspect Network tab to confirm font is self-hosted, not from Google CDN.

---

### Category: Phase 2 - Layout & Core UI Components

#### Task 7: Create ThemeProvider Context
- **ID**: T007
- **Priority**: P1
- **Complexity**: Medium
- **Depends On**: T005
- **Estimated Effort**: 1 session (partial)

**Description**:
Create a React context for theme management:
1. Read initial theme from `localStorage` or `prefers-color-scheme`.
2. Provide `theme`, `setTheme`, and `toggleTheme` via context.
3. Apply `.dark` class to `<html>` element.
4. Persist preference to `localStorage`.

**Acceptance Criteria**:
- [ ] Theme toggles between light and dark.
- [ ] Preference persists across page reloads.
- [ ] No flash of wrong theme on initial load.

**Files to Modify/Create**:
- `src/components/providers/ThemeProvider.tsx`

**Testing Notes**:
Toggle theme, reload page, and verify persistence.

---

#### Task 8: Create Header Component
- **ID**: T008
- **Priority**: P1
- **Complexity**: High
- **Depends On**: T007, T010
- **Estimated Effort**: 1 session (partial)

**Description**:
Build the global Header component:
1. Sticky positioning with backdrop blur.
2. Logo/brand name on the left.
3. Navigation links (Products, Support, Contact) on the right.
4. ThemeToggle button.
5. Mobile: Hamburger icon that opens a slide-out menu.

**Acceptance Criteria**:
- [ ] Header is fixed at the top on scroll.
- [ ] All nav links work.
- [ ] Mobile menu opens/closes smoothly.
- [ ] ThemeToggle is accessible (aria-label).

**Files to Modify/Create**:
- `src/components/ui/Header.tsx`
- `src/data/navigation.ts`

**Testing Notes**:
Resize browser to mobile width, test hamburger menu.

---

#### Task 9: Create Footer Component
- **ID**: T009
- **Priority**: P2
- **Complexity**: Low
- **Depends On**: None
- **Estimated Effort**: 1 session (partial)

**Description**:
Build a simple Footer component:
1. Three columns: Company, Products, Support links.
2. Copyright notice at the bottom.
3. Social media icon links (placeholder).

**Acceptance Criteria**:
- [ ] Footer renders at the bottom of all pages.
- [ ] Links are accessible and have correct `href`.

**Files to Modify/Create**:
- `src/components/ui/Footer.tsx`

**Testing Notes**:
Navigate to different pages and verify footer consistency.

---

#### Task 10: Create Button and ThemeToggle Components
- **ID**: T010
- **Priority**: P1
- **Complexity**: Low
- **Depends On**: T005
- **Estimated Effort**: 1 session (partial)

**Description**:
1. **Button**: Reusable button with `variant` prop (`primary`, `secondary`, `ghost`).
2. **ThemeToggle**: Icon button (Sun/Moon from Lucide) that calls `toggleTheme()`.

**Acceptance Criteria**:
- [ ] Button renders all variants correctly.
- [ ] ThemeToggle toggles the theme.
- [ ] Both are keyboard accessible.

**Files to Modify/Create**:
- `src/components/ui/Button.tsx`
- `src/components/ui/ThemeToggle.tsx`

**Testing Notes**:
Tab to buttons and activate with Enter/Space.

---

#### Task 11: Wire Up Root Layout
- **ID**: T011
- **Priority**: P1
- **Complexity**: Medium
- **Depends On**: T007, T008, T009
- **Estimated Effort**: 1 session (partial)

**Description**:
Update `src/app/layout.tsx`:
1. Wrap children in `<ThemeProvider>`.
2. Render `<Header />` above `<main>`.
3. Render `<Footer />` below `<main>`.
4. Set global metadata (title, description).

**Acceptance Criteria**:
- [ ] Header and Footer appear on all pages.
- [ ] Theme context is available to all components.
- [ ] `<title>` is set correctly.

**Files to Modify/Create**:
- `src/app/layout.tsx`

**Testing Notes**:
Navigate between pages and verify layout consistency.

---

#### Task 12: Implement Dark Mode CSS Variables
- **ID**: T012
- **Priority**: P1
- **Complexity**: Medium
- **Depends On**: T005, T007
- **Estimated Effort**: 1 session (partial)

**Description**:
Define CSS custom properties in `globals.css`:
1. `:root` (light mode): `--background`, `--foreground`, `--accent`, etc.
2. `.dark` (dark mode): Override the same variables.
3. Use these variables in Tailwind config for `bg-background`, `text-foreground`.

**Acceptance Criteria**:
- [ ] Light mode has light background.
- [ ] Dark mode has dark background.
- [ ] All text and accents update correctly.

**Files to Modify/Create**:
- `src/app/globals.css`
- `tailwind.config.ts`

**Testing Notes**:
Toggle theme and verify all colors change.

---

### Category: Phase 3 - Home Page

#### Task 13: Create Hero Component
- **ID**: T013
- **Priority**: P1
- **Complexity**: Medium
- **Depends On**: T010
- **Estimated Effort**: 1 session (partial)

**Description**:
Build the full-screen Hero section:
1. Full viewport height (`min-h-screen`).
2. Centered headline, tagline, and CTA button.
3. Background image (placeholder) with overlay.
4. Fade-in animation on load.

**Acceptance Criteria**:
- [ ] Hero fills the viewport.
- [ ] Text is centered and readable over image.
- [ ] CTA button links to a product.

**Files to Modify/Create**:
- `src/components/sections/Hero.tsx`

**Testing Notes**:
View on mobile and desktop, check text readability.

---

#### Task 14: Create ProductHighlight Component
- **ID**: T014
- **Priority**: P1
- **Complexity**: Medium
- **Depends On**: T015
- **Estimated Effort**: 1 session (partial)

**Description**:
Build the alternating product highlight section:
1. Image on one side, text on the other.
2. `reverse` prop to flip layout.
3. "Learn More" link to product detail page.

**Acceptance Criteria**:
- [ ] Alternating layout works.
- [ ] Responsive: stacks vertically on mobile.
- [ ] Links navigate to correct product page.

**Files to Modify/Create**:
- `src/components/sections/ProductHighlight.tsx`

**Testing Notes**:
Render two highlights with `reverse` toggled.

---

#### Task 15: Create AnimatedSection Wrapper
- **ID**: T015
- **Priority**: P2
- **Complexity**: Medium
- **Depends On**: T004
- **Estimated Effort**: 1 session (partial)

**Description**:
Create a Framer Motion wrapper for scroll-triggered animations:
1. Fade-in and slide-up on viewport entry.
2. Respect `prefers-reduced-motion`.

**Acceptance Criteria**:
- [ ] Children animate when scrolled into view.
- [ ] No animation if user prefers reduced motion.

**Files to Modify/Create**:
- `src/components/animations/AnimatedSection.tsx`

**Testing Notes**:
Scroll down the page and observe animations.

---

#### Task 16: Create Product Data File
- **ID**: T016
- **Priority**: P1
- **Complexity**: Low
- **Depends On**: None
- **Estimated Effort**: 1 session (partial)

**Description**:
Create `src/data/products.ts` with sample product data:
1. At least 2 products.
2. Fields: `id`, `slug`, `name`, `tagline`, `description`, `features[]`, `specs{}`, `images[]`.

**Acceptance Criteria**:
- [ ] Data is typed with TypeScript interface.
- [ ] Products are exportable and importable.

**Files to Modify/Create**:
- `src/data/products.ts`
- `src/types/product.ts`

**Testing Notes**:
Import and log data in `page.tsx` to verify.

---

#### Task 17: Build Home Page
- **ID**: T017
- **Priority**: P1
- **Complexity**: Medium
- **Depends On**: T013, T014, T15, T016
- **Estimated Effort**: 1 session (partial)

**Description**:
Assemble the Home page (`src/app/page.tsx`):
1. Hero section with main CTA.
2. 2+ ProductHighlight sections (mapped from data).
3. Each wrapped in AnimatedSection.

**Acceptance Criteria**:
- [ ] Home page renders Hero and highlights.
- [ ] Animations trigger on scroll.
- [ ] "Learn More" links work.

**Files to Modify/Create**:
- `src/app/page.tsx`

**Testing Notes**:
Navigate to `/` and scroll through the page.

---

### Category: Phase 4 - Product Detail Page

#### Task 18: Create FeatureGrid Component
- **ID**: T018
- **Priority**: P1
- **Complexity**: Medium
- **Depends On**: T015
- **Estimated Effort**: 1 session (partial)

**Description**:
Build a grid of feature cards:
1. Icon, title, and short description per feature.
2. Responsive grid (2 cols mobile, 3-4 cols desktop).
3. Animated on scroll.

**Acceptance Criteria**:
- [ ] Grid renders features from props.
- [ ] Icons from Lucide React.
- [ ] Accessible alt/aria for icons.

**Files to Modify/Create**:
- `src/components/sections/FeatureGrid.tsx`

**Testing Notes**:
Pass a features array and verify rendering.

---

#### Task 19: Create SpecsTable Component
- **ID**: T019
- **Priority**: P2
- **Complexity**: Low
- **Depends On**: None
- **Estimated Effort**: 1 session (partial)

**Description**:
Build a two-column table for technical specifications:
1. Key on left, value on right.
2. Zebra striping for readability.
3. Dark mode compatible.

**Acceptance Criteria**:
- [ ] Table renders key-value pairs.
- [ ] Accessible `<table>` with proper headers.

**Files to Modify/Create**:
- `src/components/sections/SpecsTable.tsx`

**Testing Notes**:
Pass a specs object and verify rendering.

---

#### Task 20: Create ComparisonTable Component
- **ID**: T020
- **Priority**: P2
- **Complexity**: Medium
- **Depends On**: None
- **Estimated Effort**: 1 session (partial)

**Description**:
Build a multi-column comparison table:
1. Row headers on the left, product columns to the right.
2. Highlight current product column.
3. Horizontally scrollable on mobile.

**Acceptance Criteria**:
- [ ] Table renders multiple products.
- [ ] Current product is visually highlighted.
- [ ] Scrollable on small screens.

**Files to Modify/Create**:
- `src/components/sections/ComparisonTable.tsx`

**Testing Notes**:
Pass comparison data and resize to mobile.

---

#### Task 21: Build Product Detail Page
- **ID**: T021
- **Priority**: P1
- **Complexity**: High
- **Depends On**: T018, T019, T020, T016
- **Estimated Effort**: 1 session (partial)

**Description**:
Create `src/app/products/[slug]/page.tsx`:
1. Fetch product data by `slug` param.
2. Render Hero with product image.
3. Render FeatureGrid, SpecsTable, ComparisonTable.
4. Add page-specific metadata.

**Acceptance Criteria**:
- [ ] `/products/product-one` renders correct data.
- [ ] 404 for invalid slugs.
- [ ] Metadata is unique per product.

**Files to Modify/Create**:
- `src/app/products/[slug]/page.tsx`

**Testing Notes**:
Navigate to valid and invalid product URLs.

---

#### Task 22: Implement generateStaticParams
- **ID**: T022
- **Priority**: P1
- **Complexity**: Low
- **Depends On**: T021
- **Estimated Effort**: 1 session (partial)

**Description**:
Export `generateStaticParams` from the product page to enable static generation for all product slugs.

**Acceptance Criteria**:
- [ ] All product pages are statically generated at build time.
- [ ] Build output shows generated paths.

**Files to Modify/Create**:
- `src/app/products/[slug]/page.tsx`

**Testing Notes**:
Run `npm run build` and check output.

---

#### Task 23: Create Custom 404 Page
- **ID**: T023
- **Priority**: P3
- **Complexity**: Low
- **Depends On**: T011
- **Estimated Effort**: 1 session (partial)

**Description**:
Create `src/app/not-found.tsx` with a branded 404 message and a link to Home.

**Acceptance Criteria**:
- [ ] Invalid routes show the custom 404 page.
- [ ] Page matches the site's design.

**Files to Modify/Create**:
- `src/app/not-found.tsx`

**Testing Notes**:
Navigate to `/nonexistent-page`.

---

### Category: Phase 5 - Support & Contact Pages

#### Task 24: Create FAQ Data File
- **ID**: T024
- **Priority**: P1
- **Complexity**: Low
- **Depends On**: None
- **Estimated Effort**: 1 session (partial)

**Description**:
Create `src/data/faqs.ts` with 5-10 sample FAQ entries:
1. `question` and `answer` fields.
2. Typed with TypeScript interface.

**Acceptance Criteria**:
- [ ] Data is typed and exportable.

**Files to Modify/Create**:
- `src/data/faqs.ts`
- `src/types/faq.ts`

**Testing Notes**:
Import and log data.

---

#### Task 25: Create FAQAccordion Component
- **ID**: T025
- **Priority**: P1
- **Complexity**: Medium
- **Depends On**: T024
- **Estimated Effort**: 1 session (partial)

**Description**:
Build an accordion component:
1. Click to expand/collapse answers.
2. Only one item open at a time (or configurable).
3. Animated open/close.
4. Accessible (aria-expanded, keyboard nav).

**Acceptance Criteria**:
- [ ] Accordion expands/collapses on click.
- [ ] Keyboard navigable.
- [ ] `aria-expanded` is correct.

**Files to Modify/Create**:
- `src/components/sections/FAQAccordion.tsx`

**Testing Notes**:
Tab through and activate with Enter.

---

#### Task 26: Build Support Page
- **ID**: T026
- **Priority**: P1
- **Complexity**: Low
- **Depends On**: T25
- **Estimated Effort**: 1 session (partial)

**Description**:
Create `src/app/support/page.tsx`:
1. Heading and intro text.
2. FAQAccordion with data from `faqs.ts`.
3. Link to Contact page.

**Acceptance Criteria**:
- [ ] `/support` renders FAQ list.
- [ ] Accordion is functional.

**Files to Modify/Create**:
- `src/app/support/page.tsx`

**Testing Notes**:
Navigate to `/support` and interact with FAQs.

---

#### Task 27: Build Contact Page
- **ID**: T027
- **Priority**: P1
- **Complexity**: Medium
- **Depends On**: T010
- **Estimated Effort**: 1 session (partial)

**Description**:
Create `src/app/contact/page.tsx`:
1. Contact information (email, phone).
2. Simple form: Name, Email, Message.
3. Client-side validation (required fields, email format).
4. "Submit" button (no backend, just UI).

**Acceptance Criteria**:
- [ ] `/contact` renders form.
- [ ] Validation errors display.
- [ ] Form is accessible.

**Files to Modify/Create**:
- `src/app/contact/page.tsx`

**Testing Notes**:
Submit empty form, submit with invalid email.

---

### Category: Phase 6 - Polish, Performance & Testing

#### Task 28: Performance, Accessibility & E2E Testing
- **ID**: T028
- **Priority**: P1
- **Complexity**: High
- **Depends On**: T017, T021, T026, T027
- **Estimated Effort**: 1 session

**Description**:
Final polish:
1. Optimize all images (placeholder SVGs or optimized JPGs).
2. Add SEO metadata to all pages (title, description, OG tags).
3. Run Lighthouse and fix issues until score > 90.
4. Run `axe-core` and fix accessibility issues.
5. Write Playwright E2E tests for:
   - Home -> Product navigation.
   - Theme toggle.
   - FAQ accordion.
6. Finalize Docker production build.

**Acceptance Criteria**:
- [ ] Lighthouse Performance ≥ 90.
- [ ] No WCAG AA violations.
- [ ] All Playwright tests pass.
- [ ] `docker build` produces a working static site.

**Files to Modify/Create**:
- `tests/e2e/navigation.spec.ts`
- `tests/e2e/theme.spec.ts`
- `playwright.config.ts`
- Various page files (for metadata)

**Testing Notes**:
Run `npx playwright test` and `npm run build`.

---

## Dependency Graph

```
T001 ─┬─> T002 ─┐
      │         │
      └─> T003  │
                v
            T004 ─> T005 ─> T006
                      │
                      v
            ┌─────> T007 ─────┐
            │         │       │
T009 ───────┼─> T010 ─┼───────┤
            │         v       │
            │       T008 <────┤
            │         │       │
            └─────> T011 <────┘
                      │
                      v
                    T012
                      │
      ┌───────────────┼───────────────┐
      v               v               v
    T013            T015            T016
      │               │               │
      v               v               │
    T014 <───────────-┘               │
      │                               │
      └───────────> T017 <────────────┘
                      │
      ┌───────────────┼───────────────┐
      v               v               v
    T018            T019            T020
      │               │               │
      └───────────────┼───────────────┘
                      v
                    T021 ─> T022
                      │
                      v
                    T023
                      │
      ┌───────────────┼───────────────┐
      v               v               v
    T024 ─> T025    T026            T027
              │       │               │
              └───────┼───────────────┘
                      v
                    T028
```

## Suggested Order
1. T001 - Create Multi-Stage Dockerfile
2. T002 - Create docker-compose.yml
3. T003 - Create .dockerignore and .env.example
4. T004 - Initialize Next.js App
5. T005 - Configure Tailwind Design Tokens
6. T006 - Set Up next/font
7. T007 - Create ThemeProvider Context
8. T010 - Create Button and ThemeToggle Components
9. T009 - Create Footer Component
10. T008 - Create Header Component
11. T011 - Wire Up Root Layout
12. T012 - Implement Dark Mode CSS Variables
13. T016 - Create Product Data File
14. T015 - Create AnimatedSection Wrapper
15. T013 - Create Hero Component
16. T014 - Create ProductHighlight Component
17. T017 - Build Home Page
18. T019 - Create SpecsTable Component
19. T020 - Create ComparisonTable Component
20. T018 - Create FeatureGrid Component
21. T021 - Build Product Detail Page
22. T022 - Implement generateStaticParams
23. T023 - Create Custom 404 Page
24. T024 - Create FAQ Data File
25. T025 - Create FAQAccordion Component
26. T026 - Build Support Page
27. T027 - Build Contact Page
28. T028 - Performance, Accessibility & E2E Testing
