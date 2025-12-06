/**
 * Store Module - State Management
 * 
 * Manages application state including:
 * - Current template selection
 * - User uploaded image
 * - Edit parameters (position, scale, rotation, opacity)
 * - History reference
 */

// Template data - trending celebrities
const TEMPLATES = [
  { id: 'celeb-1', name: 'Movie Star', category: 'Actor', imageUrl: 'https://picsum.photos/seed/celeb1/400/400', trendingScore: 98, trendingRank: 1 },
  { id: 'celeb-2', name: 'Pop Icon', category: 'Musician', imageUrl: 'https://picsum.photos/seed/celeb2/400/400', trendingScore: 95, trendingRank: 2 },
  { id: 'celeb-3', name: 'Sports Legend', category: 'Athlete', imageUrl: 'https://picsum.photos/seed/celeb3/400/400', trendingScore: 92, trendingRank: 3 },
  { id: 'celeb-4', name: 'Comedy King', category: 'Actor', imageUrl: 'https://picsum.photos/seed/celeb4/400/400', trendingScore: 90, trendingRank: 4 },
  { id: 'celeb-5', name: 'Rock Star', category: 'Musician', imageUrl: 'https://picsum.photos/seed/celeb5/400/400', trendingScore: 88, trendingRank: 5 },
  { id: 'celeb-6', name: 'Action Hero', category: 'Actor', imageUrl: 'https://picsum.photos/seed/celeb6/400/400', trendingScore: 85, trendingRank: 6 },
  { id: 'celeb-7', name: 'Tennis Star', category: 'Athlete', imageUrl: 'https://picsum.photos/seed/celeb7/400/400', trendingScore: 83, trendingRank: 7 },
  { id: 'celeb-8', name: 'Hip Hop Artist', category: 'Musician', imageUrl: 'https://picsum.photos/seed/celeb8/400/400', trendingScore: 80, trendingRank: 8 },
  { id: 'celeb-9', name: 'Drama Queen', category: 'Actor', imageUrl: 'https://picsum.photos/seed/celeb9/400/400', trendingScore: 78, trendingRank: 9 },
  { id: 'celeb-10', name: 'Soccer Champion', category: 'Athlete', imageUrl: 'https://picsum.photos/seed/celeb10/400/400', trendingScore: 75, trendingRank: 10 },
  { id: 'celeb-11', name: 'Country Star', category: 'Musician', imageUrl: 'https://picsum.photos/seed/celeb11/400/400', trendingScore: 72, trendingRank: 11 },
  { id: 'celeb-12', name: 'Thriller Actor', category: 'Actor', imageUrl: 'https://picsum.photos/seed/celeb12/400/400', trendingScore: 70, trendingRank: 12 }
];

// Default edit parameters
const DEFAULT_EDIT_PARAMS = {
  posX: 0,
  posY: 0,
  scale: 100,
  rotation: 0,
  opacity: 100
};

// Application state
let state = {
  templates: TEMPLATES,
  selectedTemplate: null,
  userImage: null,
  editParams: { ...DEFAULT_EDIT_PARAMS },
  history: [],
  isProcessing: false
};

// Subscribers for state changes
const subscribers = new Set();

/**
 * Get current state (immutable copy)
 */
function getState() {
  return { ...state };
}

/**
 * Get all templates
 */
function getTemplates() {
  return [...state.templates];
}

/**
 * Get selected template
 */
function getSelectedTemplate() {
  return state.selectedTemplate;
}

/**
 * Set selected template by ID
 */
function setSelectedTemplate(templateId) {
  const template = state.templates.find(t => t.id === templateId);
  if (template) {
    state.selectedTemplate = template;
    notifySubscribers('templateSelected', template);
  }
}

/**
 * Get user image
 */
function getUserImage() {
  return state.userImage;
}

/**
 * Set user image (base64 or blob URL)
 */
function setUserImage(imageData) {
  state.userImage = imageData;
  state.editParams = { ...DEFAULT_EDIT_PARAMS };
  notifySubscribers('userImageChanged', imageData);
}

/**
 * Get edit parameters
 */
function getEditParams() {
  return { ...state.editParams };
}

/**
 * Update edit parameters
 */
function updateEditParams(params) {
  state.editParams = { ...state.editParams, ...params };
  notifySubscribers('editParamsChanged', state.editParams);
}

/**
 * Reset edit parameters to default
 */
function resetEditParams() {
  state.editParams = { ...DEFAULT_EDIT_PARAMS };
  notifySubscribers('editParamsChanged', state.editParams);
}

/**
 * Reset entire state
 */
function resetState() {
  state.selectedTemplate = null;
  state.userImage = null;
  state.editParams = { ...DEFAULT_EDIT_PARAMS };
  state.isProcessing = false;
  notifySubscribers('stateReset', null);
}

/**
 * Set processing state
 */
function setProcessing(isProcessing) {
  state.isProcessing = isProcessing;
  notifySubscribers('processingChanged', isProcessing);
}

/**
 * Subscribe to state changes
 */
function subscribe(callback) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

/**
 * Notify all subscribers of state change
 */
function notifySubscribers(event, data) {
  subscribers.forEach(callback => {
    try {
      callback(event, data, getState());
    } catch (error) {
      console.error('Subscriber error:', error);
    }
  });
}

// Export store API
export const Store = {
  getState,
  getTemplates,
  getSelectedTemplate,
  setSelectedTemplate,
  getUserImage,
  setUserImage,
  getEditParams,
  updateEditParams,
  resetEditParams,
  resetState,
  setProcessing,
  subscribe,
  DEFAULT_EDIT_PARAMS
};
