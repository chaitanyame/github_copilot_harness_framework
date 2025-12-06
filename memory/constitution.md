# Selfie PullAI Constitution

## Vision
To build a high-performance, privacy-focused, client-side image processing application for selfies that leverages on-device AI (Gemini Nano Banana Image API) without compromising user data or application speed.

## Core Principles
1.  **Zero-Dependency & Lightweight**: We strictly use Vanilla HTML5, CSS3, and ES6+ JavaScript. No external frameworks or libraries are allowed, except for the specific AI API. The total bundle size must remain under 150KB.
2.  **Privacy First**: All image processing must occur client-side using the Canvas API. User images are never uploaded to a server. Data persistence is limited to local storage (max 10 items).
3.  **Performance Obsessed**: The application must load in under 2 seconds, process images in under 500ms, and maintain 60 FPS during interactions like carousel scrolling.
4.  **Mobile-First & Accessible**: Design starts at 320px width. The application must be fully accessible (WCAG 2.1 AA) and support touch interactions natively.
5.  **Seamless UX**: Features like drag-and-drop and real-time previews are mandatory to ensure a fluid user experience.

## Technical Standards
-   **Language**: ES6+ JavaScript (No TypeScript compilation step unless zero-runtime overhead).
-   **Markup**: Semantic HTML5.
-   **Styling**: CSS3 (Variables, Flexbox, Grid). No preprocessors that require heavy build steps unless output is standard CSS.
-   **Image Processing**: HTML5 Canvas API.
-   **AI Integration**: Gemini Nano Banana Image API.

## Libraries

### Specified Libraries
| Category | Library | Reason |
|----------|---------|--------|
| AI / Image Processing | Gemini Nano Banana Image API | Required for on-device AI features. |
| **Everything Else** | **NONE** | Strict zero-dependency policy to maintain <150KB bundle size. |

### Use Framework Defaults For
-   **DOM Manipulation**: Native `document.querySelector`, `addEventListener`, etc.
-   **State Management**: Native JavaScript Objects/Classes or `CustomEvent`.
-   **HTTP Client**: Native `fetch` API (if needed for API keys/config, not image upload).

## Quality Gates
-   [ ] **Bundle Size**: Total assets (HTML+CSS+JS) < 150KB.
-   [ ] **Performance**: Load time < 2s, Processing < 500ms, Animations 60 FPS.
-   [ ] **Accessibility**: Passes WCAG 2.1 AA audit.
-   [ ] **Cross-Browser**: Verified on Chrome, Firefox, Safari, Edge.
-   [ ] **Mobile**: Verified on iOS Safari and Android Chrome.

## File Conventions
-   `index.html`: Main entry point.
-   `css/style.css`: Main stylesheet.
-   `js/app.js`: Main application logic.
-   `js/modules/`: Separate modules for distinct functionality (e.g., `processor.js`, `ui.js`).
-   `assets/`: Static images and icons.

## Testing Strategy
-   **Manual Testing**: Since no automated UI framework is used to keep overhead low, rigorous manual testing is required on:
    -   Desktop: Chrome, Firefox, Safari, Edge.
    -   Mobile: iOS Safari, Android Chrome.
-   **Performance Profiling**: Use Chrome DevTools Performance tab to verify FPS and processing times.
-   **Lighthouse Audits**: Regular checks for Performance, Accessibility, and Best Practices.

## Governance & Decision Making
-   **Performance > Convenience**: Technical decisions must prioritize end-user performance and bundle size over developer convenience.
-   **Budget Enforcement**: Any new feature that threatens the 150KB limit or the 2s load time must be optimized or rejected.
-   **Client-Side Mandate**: Any architectural proposal involving server-side image processing is automatically rejected.
-   **UX Consistency**: All UI elements must support touch and mouse equally.
