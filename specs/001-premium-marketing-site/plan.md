# Implementation Plan

**Feature Branch**: `001-premium-marketing-site`
**Specification**: [spec.md](spec.md)
**Created**: 2024-12-04

## Specifications Covered
- [spec.md](spec.md) - Premium Marketing Website

---

## Tech Stack & Strategy

### Core Framework
| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | Next.js 14 (App Router) | SSG for performance, file-based routing, built-in image optimization. |
| Language | TypeScript | Type safety for maintainability. |
| Styling | Tailwind CSS | Utility-first for rapid, consistent styling; easy theming via CSS variables. |
| Animation | Framer Motion | Smooth scroll-triggered animations, `prefers-reduced-motion` aware. |
| Icons | Lucide React | Clean, consistent SVG icon set. |
| Utilities | `clsx`, `tailwind-merge` | Clean conditional class handling. |

### Containerization & Deployment (Docker)
| Tool | Purpose |
|------|---------|
| Docker | Local development and production builds inside containers. |
| `docker-compose.yml` | Orchestrate dev server and optional static file server. |
| Multi-stage Dockerfile | Stage 1: Build Next.js app. Stage 2: Serve static export via Nginx. |

### Content Management
-   **Approach**: JSON content files in `src/data/`.
    -   `products.ts` - Array of product objects.
    -   `faqs.ts` - FAQ entries for the Support page.
    -   `navigation.ts` - Header/Footer links.
-   **Rationale**: Simple, version-controlled, no external dependencies.

---

## Information Architecture

### Routing (Next.js App Router)
```
src/app/
├── layout.tsx          # Root layout (Header, Footer, ThemeProvider)
├── page.tsx            # Home Page
├── products/
│   └── [slug]/
│       └── page.tsx    # Product Detail Page (dynamic route)
├── support/
│   └── page.tsx        # Support/FAQ Page
├── contact/
│   └── page.tsx        # Contact Page
└── not-found.tsx       # Custom 404 Page
```

### Shared Layout Shell
-   `src/app/layout.tsx`:
    -   Wraps all pages.
    -   Renders `<Header />` and `<Footer />`.
    -   Provides `<ThemeProvider>` for dark mode context.
    -   Sets global metadata (site title, description).

---

## Design System Plan

### 1. Tokens (in `tailwind.config.ts`)
-   **Colors**: `neutral` palette (grayscale), `accent` (brand color, e.g., electric blue).
    -   Define CSS variables for light/dark: `--background`, `--foreground`, `--accent`.
-   **Typography**: `fontFamily: { display: ['var(--font-display)'], body: ['var(--font-body)'] }`.
    -   Display font: SF Pro Display alternative (e.g., Inter).
    -   Body font: System UI stack for performance.
-   **Spacing**: Standard Tailwind scale, with custom large values for "generous whitespace" (`spacing.hero`, `spacing.section`).
-   **Border Radius**: Consistent `rounded-xl` / `rounded-2xl` for cards.

### 2. Reusable Components (in `src/components/`)
| Component | Location | Description |
|-----------|----------|-------------|
| `Header` | `ui/Header.tsx` | Sticky nav, mobile hamburger, theme toggle. |
| `Footer` | `ui/Footer.tsx` | Links, copyright. |
| `Hero` | `sections/Hero.tsx` | Full-screen image/video, headline, CTA. |
| `ProductHighlight` | `sections/ProductHighlight.tsx` | Image + text block, alternating layouts. |
| `FeatureGrid` | `sections/FeatureGrid.tsx` | Grid of feature icons/descriptions. |
| `SpecsTable` | `sections/SpecsTable.tsx` | Two-column key-value table. |
| `ComparisonTable` | `sections/ComparisonTable.tsx` | Multi-column product comparison. |
| `FAQAccordion` | `sections/FAQAccordion.tsx` | Collapsible Q&A items. |
| `Button` | `ui/Button.tsx` | Primary/secondary variants. |
| `ThemeToggle` | `ui/ThemeToggle.tsx` | Sun/Moon icon toggle. |
| `AnimatedSection` | `animations/AnimatedSection.tsx` | Framer Motion wrapper for scroll-reveal. |

---

## Performance, Accessibility & SEO Strategy

### Performance
1.  **Static Export**: Use `next export` (or `output: 'export'` in `next.config.js`) to generate static HTML.
2.  **Image Optimization**: Use `next/image` with placeholder blur, lazy loading, and WebP format.
3.  **Font Optimization**: Use `next/font` to self-host fonts and avoid CLS.
4.  **Code Splitting**: Automatic via Next.js App Router.
5.  **Target**: Lighthouse Performance > 90.

### Accessibility (WCAG 2.1 AA)
1.  Semantic HTML (`<header>`, `<main>`, `<nav>`, `<article>`).
2.  All images have descriptive `alt` text.
3.  Keyboard navigation for all interactive elements.
4.  Color contrast ratio ≥ 4.5:1 (text), ≥ 3:1 (UI).
5.  `aria-labels` on icon-only buttons (e.g., theme toggle).
6.  Respect `prefers-reduced-motion`.

### SEO
1.  Unique `<title>` and `<meta name="description">` per page via Next.js `metadata` API.
2.  Open Graph and Twitter card tags.
3.  Canonical URLs.
4.  Structured data (JSON-LD) for product pages (optional).
5.  `robots.txt` and `sitemap.xml` (via `next-sitemap` or manual).

---

## Implementation Phases

### Phase 1: Project Scaffolding & Docker Setup
**Goal**: Runnable Next.js app inside Docker with basic project structure.
**Duration**: 1 session

#### Tasks
1.  Create `Dockerfile` (multi-stage: Node build, Nginx serve).
    - Complexity: Medium
2.  Create `docker-compose.yml` for local dev (`npm run dev`).
    - Complexity: Low
3.  Create `.dockerignore` and `.env.example`.
    - Complexity: Low
4.  Initialize Next.js app inside `src/` with TypeScript & Tailwind.
    - Depends on: Docker setup
    - Complexity: Medium
5.  Configure `tailwind.config.ts` with design tokens (colors, typography, spacing).
    - Depends on: Next.js init
    - Complexity: Medium
6.  Set up `next/font` with chosen fonts.
    - Complexity: Low

### Phase 2: Layout & Core UI Components
**Goal**: Global layout shell with Header, Footer, and theme toggle.
**Duration**: 1 session

#### Tasks
1.  Create `ThemeProvider` context and hook.
    - Complexity: Medium
2.  Create `Header` component (nav links, mobile menu, theme toggle).
    - Complexity: High
3.  Create `Footer` component.
    - Complexity: Low
4.  Create `Button` and `ThemeToggle` UI components.
    - Complexity: Low
5.  Wire up `layout.tsx` with Header, Footer, ThemeProvider.
    - Depends on: Tasks 1-4
    - Complexity: Medium
6.  Implement dark mode CSS variables and Tailwind `darkMode: 'class'`.
    - Complexity: Medium

### Phase 3: Home Page
**Goal**: Complete Home page with Hero and Product Highlights.
**Duration**: 1 session

#### Tasks
1.  Create `Hero` component with full-screen image, headline, tagline, CTA.
    - Complexity: Medium
2.  Create `ProductHighlight` component with alternating image/text.
    - Complexity: Medium
3.  Create `AnimatedSection` wrapper for scroll-triggered fade-in.
    - Complexity: Medium
4.  Create sample product data in `src/data/products.ts`.
    - Complexity: Low
5.  Build Home page (`src/app/page.tsx`) using above components.
    - Depends on: Tasks 1-4
    - Complexity: Medium

### Phase 4: Product Detail Page
**Goal**: Dynamic product page with Features, Specs, and Comparison.
**Duration**: 1 session

#### Tasks
1.  Create `FeatureGrid` component.
    - Complexity: Medium
2.  Create `SpecsTable` component.
    - Complexity: Low
3.  Create `ComparisonTable` component.
    - Complexity: Medium
4.  Build Product Detail page (`src/app/products/[slug]/page.tsx`).
    - Depends on: Tasks 1-3
    - Complexity: High
5.  Implement `generateStaticParams` for SSG.
    - Complexity: Low
6.  Create custom `not-found.tsx` for invalid slugs.
    - Complexity: Low

### Phase 5: Support & Contact Pages
**Goal**: FAQ accordion and contact form.
**Duration**: 1 session

#### Tasks
1.  Create FAQ data in `src/data/faqs.ts`.
    - Complexity: Low
2.  Create `FAQAccordion` component with expand/collapse.
    - Complexity: Medium
3.  Build Support page (`src/app/support/page.tsx`).
    - Depends on: Tasks 1-2
    - Complexity: Low
4.  Build Contact page with form (client-side validation).
    - Complexity: Medium

### Phase 6: Polish, Performance & Testing
**Goal**: Lighthouse 90+, accessibility audit, E2E tests.
**Duration**: 1 session

#### Tasks
1.  Audit and optimize images (WebP, sizing, blur placeholders).
    - Complexity: Medium
2.  Add SEO metadata to all pages.
    - Complexity: Low
3.  Run Lighthouse audit and fix issues.
    - Complexity: Medium
4.  Run `axe-core` accessibility audit.
    - Complexity: Medium
5.  Write Playwright E2E tests for core user journeys.
    - Complexity: High
6.  Finalize Docker production build and test static export.
    - Complexity: Medium

---

## Risk Assessment
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Framer Motion bundle size | Medium | Medium | Use `LazyMotion` and feature bundles. |
| Dark mode flash on load | Medium | Low | Use `next-themes` or inline script. |
| Image licensing issues | Low | High | Use only Unsplash/Pexels or self-created placeholders. |
| Docker build caching issues | Low | Low | Optimize Dockerfile layer order. |

## Success Criteria
- [ ] All 4 pages render correctly in light and dark modes.
- [ ] Navigation works on mobile and desktop.
- [ ] Lighthouse Performance score ≥ 90.
- [ ] No WCAG AA violations.
- [ ] Docker build produces a working static site.
- [ ] All Playwright E2E tests pass.

## Open Decisions
- **Font Choice**: Use Inter (open source) or explore Geist (Vercel's new font)?
- **CMS Later**: Keep architecture simple for future headless CMS integration?
