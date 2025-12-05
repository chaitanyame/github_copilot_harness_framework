# High-End Marketing Website Constitution

## Vision
To build a visually stunning, high-performance marketing website inspired by Apple’s design philosophy—clean, minimalist, and content-first—while strictly adhering to copyright laws and avoiding any trademark infringement. The site must be accessible, responsive, and built on a maintainable, component-driven architecture.

## Core Principles
1.  **Design Integrity**: Prioritize generous whitespace, strong typography, and visual hierarchy. "Less is more."
2.  **Performance First**: Every animation and asset must be optimized. Target high Lighthouse scores (90+).
3.  **Strict Compliance**: Zero tolerance for copying Apple’s assets, text, logos, or product photography. Inspiration is structural/aesthetic, not literal.
4.  **Accessibility**: WCAG 2.1 AA compliance is mandatory, not optional. Semantic HTML is the foundation.
5.  **Maintainability**: Build a reusable design system (tokens for colors, spacing, typography) before building pages.

## Technical Standards
- **Language**: TypeScript
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS (configured with design tokens)
- **Animation**: Framer Motion
- **Package Manager**: npm or pnpm

## Libraries

### Specified Libraries
| Category | Library | Reason |
|----------|---------|--------|
| UI Framework | Next.js | Best-in-class performance and SEO for marketing sites. |
| Styling | Tailwind CSS | Efficient for implementing a strict design system. |
| Animation | Framer Motion | High-fidelity animations required for "high-end" feel. |
| Icons | Lucide React | Clean, consistent SVG icons. |

### Use Framework Defaults For
- UI Testing (Playwright)
- Validation (Zod)
- HTTP Client (fetch)

## Quality Gates
- [ ] **Lighthouse Performance**: > 90 on Desktop and Mobile.
- [ ] **Accessibility**: No WCAG violations (axe-core/Lighthouse).
- [ ] **Responsiveness**: Verified on Mobile, Tablet, and Desktop breakpoints.
- [ ] **Linting**: Zero ESLint warnings/errors.
- [ ] **Tests**: All unit and E2E tests pass.

## File Conventions
- **Components**: `src/components/{Category}/{ComponentName}.tsx`
- **Pages**: `src/app/{route}/page.tsx` (Next.js App Router)
- **Tokens**: `tailwind.config.ts` for all design tokens (colors, spacing).
- **Assets**: `public/assets/{type}/` (optimized images/videos).

## Testing Strategy
- **Unit Tests**: Jest/React Testing Library for individual components and logic.
- **E2E Tests**: Playwright for critical user journeys and visual regression testing.
- **Visual Checks**: Manual review of animations and responsiveness.

## Documentation Requirements
- **Design System**: Document usage of tokens and core components.
- **Setup**: Clear instructions for running locally and building.
- **Decisions**: ADRs (Architecture Decision Records) for major tech choices.

## Non-Goals
- **No E-commerce**: No cart, checkout, or payment processing.
- **No Clones**: Do not replicate specific Apple layouts pixel-for-pixel.
- **No User Accounts**: Public-facing marketing content only.
