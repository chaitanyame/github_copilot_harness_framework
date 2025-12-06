# Task List

**Feature Branch**: 001-selfie-celebrity-generator
Generated from: [plan.md](plan.md)
Date: 2025-12-05

## Overview
- **Total Tasks**: 20
- **Estimated Sessions**: 7

## Task Categories

### Category: Phase 1 - Project Setup & UI Skeleton

#### Task 1: Create Project Structure & Entry Point
- **ID**: T001
- **Priority**: P1
- **Complexity**: Low
- **Depends On**: None
- **Estimated Effort**: 0.5 session

**Description**:
Initialize the project with the required file structure (`index.html`, `css/style.css`, `js/app.js`, `js/modules/`). Create the `index.html` file with the basic HTML5 boilerplate and link the CSS and JS files.

**Acceptance Criteria**:
- [ ] `index.html` exists with valid HTML5 structure.
- [ ] `css/style.css` and `js/app.js` are linked correctly.
- [ ] Directory structure matches the constitution conventions.

**Files to Modify/Create**:
- `index.html`
- `css/style.css`
- `js/app.js`
- `js/modules/` (directory)

**Testing Notes**:
Open `index.html` in a browser and verify no console errors and that styles are applied (e.g., body background color).

---

#### Task 2: Implement CSS Variables & Reset
- **ID**: T002
- **Priority**: P1
- **Complexity**: Low
- **Depends On**: T001
- **Estimated Effort**: 0.5 session

**Description**:
Define CSS variables for colors, fonts, and spacing to ensure consistency. Implement a minimal CSS reset to normalize browser styles.

**Acceptance Criteria**:
- [ ] CSS variables defined for primary colors, fonts, and spacing.
- [ ] Basic reset applied (box-sizing, margin/padding removal).
- [ ] Mobile-first base styles established.

**Files to Modify/Create**:
- `css/style.css`

**Testing Notes**:
Inspect elements in browser dev tools to verify variables are available and reset styles are applied.

---

#### Task 3: Implement Responsive Layout Skeleton
- **ID**: T003
- **Priority**: P1
- **Complexity**: Medium
- **Depends On**: T002
- **Estimated Effort**: 1 session

**Description**:
Build the main layout using CSS Grid/Flexbox. Create placeholders for Header, Template Carousel, Upload Area, Editor Panel, and Action Buttons. Ensure responsiveness from 320px to 2560px.

**Acceptance Criteria**:
- [ ] Header, Carousel, Upload, Editor, and Actions sections exist.
- [ ] Layout adapts to mobile (stacked) and desktop (side-by-side or grid) views.
- [ ] Semantic HTML tags used (`header`, `main`, `section`, `footer`).

**Files to Modify/Create**:
- `index.html`
- `css/style.css`

**Testing Notes**:
Resize browser window to test responsiveness. Verify layout integrity on 320px width.

---

### Category: Phase 2 - Template Gallery & Data Layer

#### Task 4: Define Template Data & Store Module
- **ID**: T004
- **Priority**: P1
- **Complexity**: Low
- **Depends On**: T001
- **Estimated Effort**: 0.5 session

**Description**:
Create a hardcoded JSON array of celebrity templates. Implement the `Store` module to manage application state (current template, user image, history).

**Acceptance Criteria**:
- [ ] `js/modules/store.js` created.
- [ ] State management logic (getters/setters/subscribers) implemented.
- [ ] Hardcoded template data available in the store.

**Files to Modify/Create**:
- `js/modules/store.js`

**Testing Notes**:
Import `Store` in `app.js` and log initial state to console.

---

#### Task 5: Implement IndexedDB Wrapper
- **ID**: T005
- **Priority**: P2
- **Complexity**: Medium
- **Depends On**: T004
- **Estimated Effort**: 1 session

**Description**:
Create a utility module for IndexedDB to store generated images (history). This replaces LocalStorage to handle larger image data blobs.

**Acceptance Criteria**:
- [ ] `js/modules/db.js` (or similar) created.
- [ ] Functions for `saveImage`, `getImages`, `deleteImage` implemented.
- [ ] Database initialization logic handles upgrades.

**Files to Modify/Create**:
- `js/modules/db.js`

**Testing Notes**:
Write a temporary test script in `app.js` to save and retrieve a dummy object from IndexedDB.

---

#### Task 6: Build Template Carousel with Lazy Loading
- **ID**: T006
- **Priority**: P2
- **Complexity**: Medium
- **Depends On**: T003, T004
- **Estimated Effort**: 1 session

**Description**:
Render the template list into the UI. Implement a horizontal scroll or grid view. Use `IntersectionObserver` to lazy load template images.

**Acceptance Criteria**:
- [ ] Templates rendered from Store data.
- [ ] Images load only when scrolled into view.
- [ ] Selection logic updates the Store state.

**Files to Modify/Create**:
- `js/modules/ui.js`
- `index.html`
- `css/style.css`

**Testing Notes**:
Scroll through the carousel and verify network requests for images occur only when visible. Click a template and verify state update.

---

### Category: Phase 3 - Image Input & Canvas Core

#### Task 7: Implement File Input & Drag-and-Drop
- **ID**: T007
- **Priority**: P1
- **Complexity**: Medium
- **Depends On**: T003
- **Estimated Effort**: 1 session

**Description**:
Implement handlers for file input selection and drag-and-drop events on the upload area. Validate file type and size (< 5MB).

**Acceptance Criteria**:
- [ ] Dragging a file over the area highlights it.
- [ ] Dropping a file reads it as a Data URL/Blob.
- [ ] Non-image files or large files trigger an error message.
- [ ] Valid image updates the Store state.

**Files to Modify/Create**:
- `js/modules/ui.js`
- `js/app.js`

**Testing Notes**:
Drag an image file onto the drop zone. Verify it is accepted. Try a PDF or >5MB file and verify rejection.

---

#### Task 8: Implement Camera Capture
- **ID**: T008
- **Priority**: P2
- **Complexity**: Medium
- **Depends On**: T007
- **Estimated Effort**: 1 session

**Description**:
Add a "Take Photo" button that opens the device camera using `navigator.mediaDevices.getUserMedia`. Capture a frame and pass it to the Store as the user image.

**Acceptance Criteria**:
- [ ] Camera stream opens in a video element (modal or inline).
- [ ] "Capture" button freezes the frame and converts to image.
- [ ] Camera stream stops after capture.
- [ ] Fallback/Error handling for devices without camera or permission denied.

**Files to Modify/Create**:
- `js/modules/ui.js`
- `index.html`

**Testing Notes**:
Test on a mobile device or laptop with webcam. Verify permission prompt and successful capture.

---

#### Task 9: Initialize Canvas & Basic Drawing
- **ID**: T009
- **Priority**: P1
- **Complexity**: High
- **Depends On**: T003, T004
- **Estimated Effort**: 1 session

**Description**:
Set up the HTML5 Canvas element. Implement the rendering loop to draw the selected template (background) and the user's uploaded image (foreground).

**Acceptance Criteria**:
- [ ] `js/modules/canvas.js` created.
- [ ] Canvas resizes correctly to fit container/aspect ratio.
- [ ] Template image draws on canvas.
- [ ] User image draws on top of template.

**Files to Modify/Create**:
- `js/modules/canvas.js`
- `js/app.js`

**Testing Notes**:
Select a template and upload an image. Verify both appear on the canvas.

---

#### Task 10: Integrate Gemini Nano Banana Image API
- **ID**: T010
- **Priority**: P1
- **Complexity**: High
- **Depends On**: T009
- **Estimated Effort**: 1 session

**Description**:
Integrate the "Gemini Nano Banana Image API" for image processing. If the API is for segmentation/background removal, apply it to the user image. If unavailable, implement a mock/fallback pass-through.

**Acceptance Criteria**:
- [ ] API client initialized (if applicable).
- [ ] User image processed through API before rendering.
- [ ] Fallback mechanism in place if API fails or is not present.

**Files to Modify/Create**:
- `js/modules/processor.js` (new module)
- `js/app.js`

**Testing Notes**:
Verify console logs for API interaction. Check if image is modified (e.g., background removed) if API is functional.

---

### Category: Phase 4 - Editor Controls & Real-time Preview

#### Task 11: Implement Canvas Interaction (Drag/Move)
- **ID**: T011
- **Priority**: P1
- **Complexity**: High
- **Depends On**: T009
- **Estimated Effort**: 1 session

**Description**:
Add event listeners (mouse and touch) to the canvas to allow dragging the user image. Update the position coordinates in the Store/State.

**Acceptance Criteria**:
- [ ] User image follows mouse/finger drag.
- [ ] Movement is smooth (60fps).
- [ ] Position state updates correctly.

**Files to Modify/Create**:
- `js/modules/canvas.js`
- `js/modules/ui.js`

**Testing Notes**:
Drag the image on canvas using mouse and touch simulator. Verify smooth movement.

---

#### Task 12: Implement Transformation Controls (Scale, Rotate, Opacity)
- **ID**: T012
- **Priority**: P1
- **Complexity**: Medium
- **Depends On**: T009
- **Estimated Effort**: 1 session

**Description**:
Create UI sliders for Scale, Rotation, and Opacity. Bind these inputs to update the rendering parameters.

**Acceptance Criteria**:
- [ ] Sliders update the visual state of the user image on canvas.
- [ ] Scale range: 50% - 200%.
- [ ] Rotation range: 0 - 360 degrees.
- [ ] Opacity range: 0 - 100%.

**Files to Modify/Create**:
- `index.html`
- `js/modules/ui.js`
- `js/modules/canvas.js`

**Testing Notes**:
Adjust sliders and verify immediate visual feedback on the canvas.

---

#### Task 13: Optimize Rendering Loop
- **ID**: T013
- **Priority**: P2
- **Complexity**: Medium
- **Depends On**: T011, T012
- **Estimated Effort**: 0.5 session

**Description**:
Ensure the canvas rendering uses `requestAnimationFrame`. Debounce slider inputs if necessary to prevent excessive state updates, though direct canvas drawing should be fast enough.

**Acceptance Criteria**:
- [ ] Rendering logic decoupled from input events via `requestAnimationFrame`.
- [ ] No visual lag during rapid slider movement.

**Files to Modify/Create**:
- `js/modules/canvas.js`

**Testing Notes**:
Use Performance tab in DevTools to check for frame drops during interaction.

---

### Category: Phase 5 - Export, History & Polish

#### Task 14: Implement Image Export
- **ID**: T014
- **Priority**: P1
- **Complexity**: Medium
- **Depends On**: T009
- **Estimated Effort**: 0.5 session

**Description**:
Add functionality to the "Download" button. Convert the canvas content to a Blob/Data URL and trigger a browser download.

**Acceptance Criteria**:
- [ ] Clicking Download saves the image as PNG/JPG.
- [ ] Filename includes timestamp or template name.

**Files to Modify/Create**:
- `js/modules/ui.js`
- `js/modules/canvas.js`

**Testing Notes**:
Click download and verify the saved file opens and looks correct.

---

#### Task 15: Implement Share Functionality
- **ID**: T015
- **Priority**: P2
- **Complexity**: Medium
- **Depends On**: T014
- **Estimated Effort**: 0.5 session

**Description**:
Use the Web Share API to share the generated image. Fallback to clipboard copy if Web Share is unsupported.

**Acceptance Criteria**:
- [ ] "Share" button invokes native share sheet on mobile.
- [ ] Fallback copies image or shows instructions on desktop if needed.

**Files to Modify/Create**:
- `js/modules/ui.js`

**Testing Notes**:
Test on mobile device to verify native share sheet.

---

#### Task 16: Connect History UI
- **ID**: T016
- **Priority**: P2
- **Complexity**: Medium
- **Depends On**: T005, T014
- **Estimated Effort**: 0.5 session

**Description**:
When an image is downloaded/shared, save it to IndexedDB. Render the list of recent images in the History section.

**Acceptance Criteria**:
- [ ] Generated images saved to DB.
- [ ] History section displays thumbnails of recent images.
- [ ] Clicking a history item re-loads it or allows download.

**Files to Modify/Create**:
- `js/modules/ui.js`
- `js/modules/store.js`

**Testing Notes**:
Generate 3 images. Reload page. Verify 3 images appear in history.

---

#### Task 17: Accessibility Audit & Fixes
- **ID**: T017
- **Priority**: P1
- **Complexity**: Medium
- **Depends On**: All UI tasks
- **Estimated Effort**: 1 session

**Description**:
Run accessibility checks. Ensure all interactive elements have aria-labels, focus states are visible, and contrast ratios are sufficient.

**Acceptance Criteria**:
- [ ] Keyboard navigation works for all controls.
- [ ] Screen readers announce buttons and sliders correctly.
- [ ] WCAG 2.1 AA compliance.

**Files to Modify/Create**:
- `index.html`
- `css/style.css`

**Testing Notes**:
Use Tab key to navigate entire app. Use a screen reader (VoiceOver/NVDA) to verify announcements.

---

#### Task 18: Final Bundle Optimization
- **ID**: T018
- **Priority**: P2
- **Complexity**: Low
- **Depends On**: All tasks
- **Estimated Effort**: 0.5 session

**Description**:
Review code for unused functions. Ensure assets are optimized. Verify total size is under 150KB (excluding external template images).

**Acceptance Criteria**:
- [ ] Main bundle < 150KB.
- [ ] Code is clean and commented.

**Files to Modify/Create**:
- All JS/CSS files

**Testing Notes**:
Check network tab for transfer size of initial load.

---

## Dependency Graph

```
T001 -> T002 -> T003 -> T006 -> T007 -> T008
  |       |
  v       v
T004 -> T005 -> T016
  |
  v
T009 -> T010 -> T011 -> T013
  |       |
  v       v
T012 -> T014 -> T015
          |
          v
        T017 -> T018
```

## Suggested Order
1. T001 - Create Project Structure
2. T002 - CSS Variables & Reset
3. T003 - Responsive Layout Skeleton
4. T004 - Define Template Data & Store
5. T006 - Template Carousel
6. T007 - File Input & Drag-and-Drop
7. T009 - Initialize Canvas
8. T010 - Integrate Gemini Nano Banana API
9. T011 - Canvas Interaction
10. T012 - Transformation Controls
11. T013 - Optimize Rendering
12. T014 - Image Export
13. T005 - IndexedDB Wrapper
14. T016 - Connect History UI
15. T008 - Camera Capture
16. T015 - Share Functionality
17. T017 - Accessibility Audit
18. T018 - Final Optimization
