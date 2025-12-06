# Selfie with Celebrity Generator Specification

## Overview
A modern, privacy-focused client-side web application that allows users to create "selfies" with celebrities. Users can select from trending templates, upload or capture their own photo, and use intuitive on-canvas controls to composite the images in real-time. The application operates entirely in the browser using the Canvas API, ensuring user privacy and high performance.

## User Stories
- As a **social media enthusiast**, I want to browse trending celebrity templates so that I can create relevant and popular content.
- As a **mobile user**, I want to easily take a selfie or upload one from my gallery so that I can quickly create a composite image.
- As a **creator**, I want to adjust the position, scale, rotation, and opacity of my photo so that the final image looks realistic.
- As a **privacy-conscious user**, I want all image processing to happen on my device so that my personal photos are never sent to a server.
- As a **returning user**, I want to see my recent creations so that I can download or share them again.

## Requirements

### Functional Requirements
1.  **Template Gallery**: Display 10-15 trending celebrity templates in a responsive carousel/grid. Each item shows the celebrity image, name, category (Actor, Musician, Athlete), and a "Trending" badge.
2.  **Image Input**: Support single-file upload (JPG, PNG, WebP, max 5MB) via drag-and-drop and file selection. Include an option to capture directly from the device camera.
3.  **Image Composition**: Real-time overlay of the user's photo onto the selected template using HTML5 Canvas.
4.  **Editing Controls**:
    -   Positioning (Drag to move X, Y)
    -   Scale/Zoom (Slider: 50% to 200%)
    -   Rotation (Slider/Gesture: 0° to 360°)
    -   Opacity (Slider: 0% to 100%)
5.  **Real-time Preview**: All adjustments must be reflected instantly on the canvas.
6.  **Export**: Download the final composition as PNG or JPG.
7.  **Sharing**: Provide options to copy to clipboard and share via WhatsApp or Instagram (using Web Share API where available).
8.  **History**: Persist the last 10 generated images in Local Storage.

### Non-Functional Requirements
-   **Performance**:
    -   App load time < 2 seconds.
    -   Image processing/rendering < 500ms.
    -   Animations and interactions at 60 FPS.
-   **Constraints**:
    -   Vanilla HTML5, CSS3, ES6+ JavaScript only.
    -   Total bundle size < 150KB.
    -   No server-side image uploads.
-   **Accessibility**: WCAG 2.1 AA compliant (keyboard navigation, aria-labels, contrast).
-   **Responsiveness**: Fully functional on devices from 320px to 2560px width.

## Technical Design

### Architecture
The application will be a Single Page Application (SPA) built with Vanilla JavaScript. It will use the Module pattern to separate concerns (UI, State, Image Processing).
-   **`index.html`**: Structure and layout.
-   **`css/style.css`**: Styling using CSS Variables for theming and Flexbox/Grid for layout.
-   **`js/app.js`**: Main entry point and event orchestration.
-   **`js/modules/store.js`**: Manages state (templates, history) and Local Storage.
-   **`js/modules/canvas.js`**: Handles all Canvas API operations (drawing, transformations).
-   **`js/modules/ui.js`**: Manages DOM updates and event listeners.

### Data Model

**Template**
```json
{
  "id": "string",
  "name": "string",
  "category": "Actor" | "Musician" | "Athlete",
  "imageUrl": "string",
  "trendingScore": "number",
  "trendingRank": "number"
}
```

**Output (History Item)**
```json
{
  "id": "string",
  "timestamp": "number",
  "templateId": "string",
  "originalImage": "string (base64/blob url)",
  "editParams": {
    "posX": "number",
    "posY": "number",
    "scale": "number",
    "rotation": "number",
    "opacity": "number"
  },
  "finalImage": "string (base64)"
}
```

### API/Interface
-   **Gemini Nano Banana Image API**: Used for specific AI enhancements if applicable (details to be confirmed during implementation).
-   **HTML5 Canvas API**: Primary engine for image manipulation.
-   **Web Share API**: For native sharing capabilities.
-   **Local Storage API**: For data persistence.

### Dependencies
-   None (Strict Vanilla JS).

## Acceptance Criteria
-   [ ] App bundle (HTML/CSS/JS) is under 150KB.
-   [ ] User can select a template from the gallery.
-   [ ] User can upload an image or take a photo.
-   [ ] User can successfully position, scale, and rotate their photo on the canvas.
-   [ ] The final image can be downloaded to the device.
-   [ ] The last 10 images are saved and visible in the history section.
-   [ ] App passes WCAG 2.1 AA accessibility audit.
-   [ ] App loads in under 2 seconds on a simulated 4G network.

## Edge Cases
-   **Large Files**: Prevent upload of files > 5MB with a clear error message.
-   **Unsupported Formats**: Handle non-image files gracefully.
-   **Storage Quota**: Handle Local Storage limits (e.g., by removing oldest history items).
-   **Offline Mode**: App should function fully offline after initial load (PWA capabilities recommended).
-   **Device Rotation**: Canvas and UI should adapt seamlessly to orientation changes.

## Testing Strategy
-   **Manual Testing**:
    -   **Cross-Browser**: Chrome, Firefox, Safari, Edge.
    -   **Mobile**: iOS Safari, Android Chrome.
-   **Performance**: Use Chrome DevTools to measure load time, bundle size, and FPS.
-   **Accessibility**: Use tools like WAVE or Lighthouse to verify compliance.

## Open Questions
-   **Template Assets**: Are the celebrity images provided, or should we use placeholders/Creative Commons images for the prototype?
-   **Gemini Nano Banana Image API**: What specific features of this API are required? (e.g., background removal, style transfer). For now, we will assume it's a client-side library or API available in the global scope.
