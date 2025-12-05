# Premium Marketing Website Specification

## Overview
A visually stunning, high-performance marketing website for a fictional premium hardware company. The site will feature a clean, minimalist, content-first design inspired by high-end electronics brands (like Apple) but strictly using original assets and copy. It includes a Home page, Product Detail template, Support/FAQ, and Contact page, all built with a reusable component system supporting light and dark modes.

## User Personas
1.  **The Tech Enthusiast (Alex)**: Values detailed specs, build quality, and performance metrics. Wants to deep-dive into "Tech Specs" and "Comparison" sections.
2.  **The Aspirational Buyer (Sam)**: Drawn in by beautiful imagery and lifestyle branding. Browses the "Hero" and "Features" sections.
3.  **The Existing Customer (Jordan)**: Needs help with a product. Goes straight to "Support/FAQ" or "Contact".

## User Journeys
1.  **Discover Product**: Landing on Home Page -> Viewing Hero Animation -> Clicking "Learn More" on a product highlight.
2.  **Explore Features**: Product Detail Page -> Scrolling through "Features" (parallax/fade-ins) -> Viewing "Tech Specs".
3.  **Get Support**: Global Nav -> Support -> Searching FAQ -> Clicking "Contact Us".

## User Stories
- As a **visitor**, I want to be greeted by an immersive hero section so that I understand the premium nature of the brand immediately.
- As a **shopper**, I want to view detailed technical specifications and comparisons so I can make an informed decision.
- As a **user**, I want the website to seamlessly adapt to my system's light or dark mode preference so that it is comfortable to read.
- As a **mobile user**, I want a responsive navigation menu that is easy to use on a small screen.
- As a **customer**, I want to easily find answers to common questions on a FAQ page.

## Requirements

### Functional Requirements
1.  **Global Navigation**: Sticky header with links to Products, Support, Contact. Mobile-responsive hamburger menu.
2.  **Home Page**:
    - Full-screen Hero section with high-quality original imagery/video.
    - Product Highlight sections (alternating layout).
    - "Learn More" CTAs linking to Product Detail pages.
3.  **Product Detail Page Template**:
    - Hero section for the specific product.
    - "Features" section with scroll-triggered animations.
    - "Tech Specs" grid.
    - "Comparison" table (vs other models).
4.  **Support/FAQ Page**: Accordion-style FAQ list.
5.  **Contact Page**: Simple layout with email/phone info and a basic inquiry form (client-side validation only).
6.  **Theme Support**: Toggle for Light/Dark mode, defaulting to system preference.

### Non-Functional Requirements
-   **Performance**: Core Web Vitals passed; Lighthouse score > 90.
-   **Accessibility**: WCAG 2.1 AA compliant (contrast, keyboard nav, aria-labels).
-   **Design**: "Generous whitespace", "Strong typography", "Subtle animations" (using Framer Motion).
-   **Compliance**: **STRICT**: No Apple assets, no Apple copy ("Retina", "Liquid Retina", "ProMotion", etc.), no Apple product photos.

## Technical Design

### Architecture
-   **Framework**: Next.js (App Router).
-   **Styling**: Tailwind CSS with a custom `tailwind.config.ts` defining the "Premium" design tokens (colors, spacing, typography).
-   **Animation**: Framer Motion for scroll reveals and transitions.
-   **Icons**: Lucide React.

### Data Model
-   **Product Data**: Stored in a structured JSON file or TypeScript constant (`src/data/products.ts`) to populate the Product Detail template dynamically.
    -   `id`, `name`, `tagline`, `description`, `features[]`, `specs{}`, `images[]`.

### Dependencies
-   `framer-motion`
-   `lucide-react`
-   `clsx` / `tailwind-merge` (for component utility handling)

## Acceptance Criteria
-   [ ] Home page renders with Hero and at least 2 product highlights.
-   [ ] Product Detail page renders dynamic content based on route/slug.
-   [ ] Dark mode toggle works and persists preference.
-   [ ] Navigation is fully functional on Mobile and Desktop.
-   [ ] Lighthouse performance score is 90+ on desktop.
-   [ ] No copyright/trademark infringements found in text or images.

## Edge Cases
-   **Missing Product Data**: Show a graceful 404 page if an invalid product slug is accessed.
-   **Reduced Motion**: Disable or simplify Framer Motion animations if user prefers reduced motion.
-   **No JS**: Core content (text/images) must remain visible even if JS fails (SSR).

## Testing Strategy
-   **Unit**: Test utility functions and simple UI components (Buttons, Cards).
-   **E2E**: Playwright tests to verify navigation flow (Home -> Product -> Support).
-   **Visual**: Manual verification of responsiveness and dark mode contrast.
