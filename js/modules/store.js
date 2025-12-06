/**
 * Store Module - State Management
 * 
 * Manages application state including:
 * - Current template selection (celebrity + scene)
 * - User uploaded image (face photo)
 * - Edit parameters (position, scale, rotation, opacity)
 * - History reference
 */

// Template data - Pre-made celebrity selfie scenes
// Each template is a scene where user's face will be composited
const TEMPLATES = [
  { 
    id: 'scene-1', 
    name: 'Beach Sunset Selfie', 
    celebrity: 'Amitabh Bachchan',
    scene: 'beach',
    description: 'Sunset selfie on the beach',
    prompt: 'A selfie photo of a person with Amitabh Bachchan on a beautiful beach at sunset, golden hour lighting, waves in background',
    previewUrl: 'assets/templates/beach-selfie.jpg',
    trendingScore: 98, 
    trendingRank: 1 
  },
  { 
    id: 'scene-2', 
    name: 'Red Carpet Moment', 
    celebrity: 'Shah Rukh Khan',
    scene: 'red-carpet',
    description: 'Red carpet premiere photo',
    prompt: 'A selfie photo of a person with Shah Rukh Khan at a red carpet movie premiere, flashbulbs, glamorous setting',
    previewUrl: 'assets/templates/red-carpet.jpg',
    trendingScore: 95, 
    trendingRank: 2 
  },
  { 
    id: 'scene-3', 
    name: 'Stadium Victory', 
    celebrity: 'Virat Kohli',
    scene: 'stadium',
    description: 'Cricket stadium celebration',
    prompt: 'A selfie photo of a person with Virat Kohli at a cricket stadium, cheering crowd, victory celebration',
    previewUrl: 'assets/templates/stadium.jpg',
    trendingScore: 92, 
    trendingRank: 3 
  },
  { 
    id: 'scene-4', 
    name: 'Coffee Shop Chat', 
    celebrity: 'Priyanka Chopra',
    scene: 'cafe',
    description: 'Casual coffee shop moment',
    prompt: 'A selfie photo of a person with Priyanka Chopra at a cozy coffee shop, warm lighting, casual friendly vibe',
    previewUrl: 'assets/templates/cafe.jpg',
    trendingScore: 90, 
    trendingRank: 4 
  },
  { 
    id: 'scene-5', 
    name: 'Mountain Adventure', 
    celebrity: 'Ranveer Singh',
    scene: 'mountain',
    description: 'Hiking adventure selfie',
    prompt: 'A selfie photo of a person with Ranveer Singh on a mountain peak, adventure hiking gear, beautiful vista',
    previewUrl: 'assets/templates/mountain.jpg',
    trendingScore: 88, 
    trendingRank: 5 
  },
  { 
    id: 'scene-6', 
    name: 'Film Set Visit', 
    celebrity: 'Alia Bhatt',
    scene: 'film-set',
    description: 'Behind the scenes on set',
    prompt: 'A selfie photo of a person with Alia Bhatt on a movie set, cameras and lights in background, film production',
    previewUrl: 'assets/templates/film-set.jpg',
    trendingScore: 85, 
    trendingRank: 6 
  },
  { 
    id: 'scene-7', 
    name: 'Concert Backstage', 
    celebrity: 'Arijit Singh',
    scene: 'concert',
    description: 'Backstage at a concert',
    prompt: 'A selfie photo of a person with Arijit Singh backstage at a concert, music equipment, stage lights',
    previewUrl: 'assets/templates/concert.jpg',
    trendingScore: 83, 
    trendingRank: 7 
  },
  { 
    id: 'scene-8', 
    name: 'Luxury Yacht', 
    celebrity: 'Deepika Padukone',
    scene: 'yacht',
    description: 'Luxury yacht party',
    prompt: 'A selfie photo of a person with Deepika Padukone on a luxury yacht, ocean in background, glamorous setting',
    previewUrl: 'assets/templates/yacht.jpg',
    trendingScore: 80, 
    trendingRank: 8 
  },
  { 
    id: 'scene-9', 
    name: 'Award Show', 
    celebrity: 'Ranbir Kapoor',
    scene: 'awards',
    description: 'At the award ceremony',
    prompt: 'A selfie photo of a person with Ranbir Kapoor at an award show, trophy in background, formal attire',
    previewUrl: 'assets/templates/awards.jpg',
    trendingScore: 78, 
    trendingRank: 9 
  },
  { 
    id: 'scene-10', 
    name: 'Street Food Fun', 
    celebrity: 'Akshay Kumar',
    scene: 'street',
    description: 'Street food adventure',
    prompt: 'A selfie photo of a person with Akshay Kumar at a street food stall, vibrant Indian street scene, fun casual moment',
    previewUrl: 'assets/templates/street-food.jpg',
    trendingScore: 75, 
    trendingRank: 10 
  },
  { 
    id: 'scene-11', 
    name: 'Gym Workout', 
    celebrity: 'Tiger Shroff',
    scene: 'gym',
    description: 'Gym workout session',
    prompt: 'A selfie photo of a person with Tiger Shroff at a fitness gym, workout equipment, healthy lifestyle',
    previewUrl: 'assets/templates/gym.jpg',
    trendingScore: 72, 
    trendingRank: 11 
  },
  { 
    id: 'scene-12', 
    name: 'Temple Visit', 
    celebrity: 'Katrina Kaif',
    scene: 'temple',
    description: 'Spiritual temple visit',
    prompt: 'A selfie photo of a person with Katrina Kaif at a beautiful Indian temple, traditional architecture, peaceful setting',
    previewUrl: 'assets/templates/temple.jpg',
    trendingScore: 70, 
    trendingRank: 12 
  }
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
