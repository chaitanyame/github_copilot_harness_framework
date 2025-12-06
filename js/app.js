/**
 * Selfie PullAI - Main Application Entry Point
 * 
 * This is the main JavaScript file that orchestrates the application.
 * It imports modules and initializes the app on DOMContentLoaded.
 */

// App initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log('Selfie PullAI initialized');
  
  // Verify CSS is loaded
  const bodyStyle = getComputedStyle(document.body);
  const bgColor = bodyStyle.backgroundColor;
  console.log('Background color:', bgColor);
  
  // Initialize modules (will be added in subsequent features)
  initApp();
});

/**
 * Initialize the application
 */
function initApp() {
  // Placeholder for future module initialization
  // - Store module
  // - Canvas module
  // - UI module
  // - Processor module (Gemini Nano Banana API)
  
  console.log('App modules ready for initialization');
}

// Export for module usage
export { initApp };
