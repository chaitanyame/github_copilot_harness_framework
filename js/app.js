/**
 * Selfie PullAI - Main Application Entry Point
 * 
 * This is the main JavaScript file that orchestrates the application.
 * It imports modules and initializes the app on DOMContentLoaded.
 */

import { Store } from './modules/store.js';
import { DB } from './modules/db.js';
import { UI } from './modules/ui.js';
import { Processor } from './modules/processor.js';

// App initialization
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Selfie PullAI starting...');
  
  try {
    await initApp();
    console.log('Selfie PullAI ready!');
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
});

/**
 * Initialize the application
 */
async function initApp() {
  // Initialize IndexedDB
  await DB.initDB();
  console.log('Database initialized');
  
  // Initialize UI (which also initializes Canvas)
  UI.init();
  console.log('UI initialized');
  
  // Log capabilities
  const capabilities = Processor.getCapabilities();
  console.log('Processor capabilities:', capabilities);
  
  // Log initial state
  console.log('Templates loaded:', Store.getTemplates().length);
}

// Export for module usage
export { initApp };
