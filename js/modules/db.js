/**
 * IndexedDB Module - Persistent Storage for History
 * 
 * Provides async operations for storing and retrieving
 * generated images (history). Uses IndexedDB for better
 * capacity than localStorage.
 */

const DB_NAME = 'SelfiePullAI';
const DB_VERSION = 1;
const STORE_NAME = 'history';
const MAX_HISTORY_ITEMS = 10;

let db = null;

/**
 * Initialize the database
 */
async function initDB() {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Failed to open IndexedDB:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
      // Create history store if it doesn't exist
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

/**
 * Save an image to history
 * @param {Object} historyItem - { id, timestamp, templateId, originalImage, editParams, finalImage }
 */
async function saveImage(historyItem) {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Add the new item
    const request = store.put({
      ...historyItem,
      id: historyItem.id || `img-${Date.now()}`,
      timestamp: historyItem.timestamp || Date.now()
    });

    request.onsuccess = async () => {
      // Enforce max history limit
      await enforceHistoryLimit();
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('Failed to save image:', request.error);
      reject(request.error);
    };
  });
}

/**
 * Get all images from history, sorted by timestamp (newest first)
 */
async function getImages() {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('timestamp');
    const request = index.openCursor(null, 'prev');

    const results = [];

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        resolve(results);
      }
    };

    request.onerror = () => {
      console.error('Failed to get images:', request.error);
      reject(request.error);
    };
  });
}

/**
 * Get a single image by ID
 */
async function getImage(id) {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete an image from history
 */
async function deleteImage(id) {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clear all history
 */
async function clearHistory() {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Enforce max history limit by removing oldest items
 */
async function enforceHistoryLimit() {
  const images = await getImages();
  
  if (images.length > MAX_HISTORY_ITEMS) {
    const toDelete = images.slice(MAX_HISTORY_ITEMS);
    for (const img of toDelete) {
      await deleteImage(img.id);
    }
  }
}

/**
 * Get history count
 */
async function getHistoryCount() {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.count();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Export DB API
export const DB = {
  initDB,
  saveImage,
  getImages,
  getImage,
  deleteImage,
  clearHistory,
  getHistoryCount,
  MAX_HISTORY_ITEMS
};
