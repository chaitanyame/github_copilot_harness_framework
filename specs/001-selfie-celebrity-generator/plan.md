# Implementation Plan

**Feature Branch**: 001-selfie-celebrity-generator
**Specification**: [spec.md](spec.md)
**Created**: 2025-12-05

## Specifications Covered
- [spec.md](spec.md)

## Implementation Phases

### Phase 1: Project Setup & UI Skeleton
**Goal**: Establish the single-file structure and basic responsive layout.
**Duration**: 1 Session

#### Tasks
1. Create `index.html` with embedded CSS/JS structure.
   - Depends on: None
   - Complexity: Low
2. Implement responsive grid/flexbox layout (Header, Carousel, Upload, Editor, Actions).
   - Depends on: Task 1
   - Complexity: Medium
3. Implement basic CSS variables and reset for mobile-first design.
   - Depends on: Task 1
   - Complexity: Low

### Phase 2: Template Gallery & Data Layer
**Goal**: Display trending templates and manage application state.
**Duration**: 1 Session

#### Tasks
1. Define hardcoded JSON array for celebrity templates.
   - Depends on: None
   - Complexity: Low
2. Implement `Store` module for state management (Templates, History).
   - Depends on: None
   - Complexity: Medium
3. Build Template Carousel with lazy loading (Intersection Observer).
   - Depends on: Task 1, Phase 1
   - Complexity: Medium
4. Implement IndexedDB wrapper for storing history (replacing LocalStorage for capacity).
   - Depends on: Task 2
   - Complexity: Medium

### Phase 3: Image Input & Canvas Core
**Goal**: Handle image uploads and basic rendering on Canvas.
**Duration**: 2 Sessions

#### Tasks
1. Implement Drag-and-Drop and File Input handlers.
   - Depends on: Phase 1
   - Complexity: Medium
2. Implement Camera Capture integration (`navigator.mediaDevices`).
   - Depends on: Phase 1
   - Complexity: Medium
3. Initialize Canvas and implement basic image drawing (Template + User Image).
   - Depends on: Phase 1
   - Complexity: High
4. Integrate "Gemini Nano Banana Image API" (or fallback to standard Canvas API if unavailable) for initial processing.
   - Depends on: Task 3
   - Complexity: High

### Phase 4: Editor Controls & Real-time Preview
**Goal**: Enable user manipulation of the image (Position, Scale, Rotate, Opacity).
**Duration**: 2 Sessions

#### Tasks
1. Implement touch/mouse event listeners for Canvas dragging (Positioning).
   - Depends on: Phase 3
   - Complexity: High
2. Implement Slider controls for Scale, Rotation, and Opacity.
   - Depends on: Phase 3
   - Complexity: Medium
3. Implement `requestAnimationFrame` loop for smooth rendering.
   - Depends on: Task 1, Task 2
   - Complexity: High
4. Debounce slider inputs to optimize performance.
   - Depends on: Task 2
   - Complexity: Low

### Phase 5: Export, History & Polish
**Goal**: Finalize the workflow, save outputs, and ensure performance/accessibility.
**Duration**: 1 Session

#### Tasks
1. Implement Image Export (Download as PNG/JPG).
   - Depends on: Phase 4
   - Complexity: Medium
2. Implement Share functionality (Web Share API, Clipboard).
   - Depends on: Phase 4
   - Complexity: Medium
3. Connect History UI to IndexedDB data.
   - Depends on: Phase 2 (Task 4)
   - Complexity: Medium
4. Conduct Accessibility Audit (WCAG 2.1 AA) and fix issues.
   - Depends on: All previous
   - Complexity: Medium
5. Final Bundle Optimization (Minification check).
   - Depends on: All previous
   - Complexity: Low

## Risk Assessment
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| "Gemini Nano Banana Image API" unavailability or documentation lack | High | High | Fallback to standard Canvas API for all manipulations; encapsulate in adapter pattern. |
| IndexedDB complexity vs LocalStorage | Medium | Low | Use a lightweight wrapper or simple promise-based utility. |
| Mobile performance (60FPS) on low-end devices | Medium | High | Aggressive optimization of Canvas draw calls; limit image resolution if needed. |
| Bundle size > 150KB with images | Medium | High | Ensure template images are external/lazy-loaded, not embedded base64. |

## Success Criteria
- [ ] App loads in < 2 seconds on simulated 4G.
- [ ] Bundle size (HTML+CSS+JS) < 150KB.
- [ ] User can complete the flow (Select -> Upload -> Edit -> Download) in < 1 minute.
- [ ] 60 FPS maintained during drag/scale operations.
- [ ] History persists across reloads (up to 10 items).

## Open Decisions
- **Gemini Nano Banana Image API**: Exact capabilities are unknown. Will assume it provides optimized image operations or segmentation. If it's purely for "style transfer" or "AI generation", we might need to adjust the "overlay" approach.
- **Template Images**: Hosting strategy for template images to keep initial bundle small. Will assume external URLs for now.
