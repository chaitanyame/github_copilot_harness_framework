/**
 * Processor Module - Google Gemini API Integration
 * 
 * Generates celebrity selfie images by:
 * 1. Taking user's face photo
 * 2. Taking selected template (celebrity + scene)
 * 3. Calling Google Gemini API to generate composite selfie
 */

// API Configuration - Google Gemini API
const API_CONFIG = {
  apiKey: null,
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
  model: 'gemini-2.5-flash-preview-05-20' // Use latest flash model for image gen
};

/**
 * Set the Gemini API key
 * @param {string} key - Your API key
 */
function setApiKey(key) {
  API_CONFIG.apiKey = key;
  console.log('Google Gemini API key configured');
}

/**
 * Check if API is configured
 */
function isApiConfigured() {
  return API_CONFIG.apiKey !== null && API_CONFIG.apiKey.length > 0;
}

/**
 * Generate celebrity selfie using AI
 * @param {string} userImageData - User's face photo (base64 data URL)
 * @param {Object} template - Selected template with celebrity + scene + prompt
 * @returns {Promise<string>} - Generated selfie image (base64 data URL)
 */
async function generateSelfiePull(userImageData, template) {
  console.log('Generating selfie with:', template.celebrity, 'in', template.scene);
  
  // Try API key-based generation first
  if (isApiConfigured()) {
    try {
      return await generateWithGeminiApi(userImageData, template);
    } catch (error) {
      console.warn('Gemini API generation failed:', error);
      throw error; // Don't fallback, show the error
    }
  }
  
  // No API key - show error
  throw new Error('Please configure your Gemini API key first');
}

/**
 * Generate using Google Gemini API (REST API)
 * Sends both template image and user's face to Gemini
 */
async function generateWithGeminiApi(userImageData, template) {
  console.log('Generating with Google Gemini API...');
  
  // Extract base64 data from user image data URL
  const userBase64 = userImageData.split(',')[1];
  const userMimeType = userImageData.split(';')[0].split(':')[1] || 'image/jpeg';
  
  // Load and convert template image to base64
  let templateBase64 = null;
  let templateMimeType = 'image/png';
  if (template.templateImage) {
    try {
      const templateData = await loadImageAsBase64(template.templateImage);
      templateBase64 = templateData.base64;
      templateMimeType = templateData.mimeType;
      console.log('Template image loaded successfully');
    } catch (err) {
      console.warn('Could not load template image:', err);
    }
  }
  
  // Build the generation prompt
  const prompt = `${template.prompt}. 
Look at the reference template image showing the celebrity scene.
Look at the user's face photo.
Create a new ultra-realistic selfie image where the user appears to be taking a selfie with the celebrity in the exact same scene and setting.
The user's face should replace any placeholder in the template.
Keep the celebrity and background exactly as shown in the template.
Make it look natural and photorealistic, like a real selfie photo.`;

  // Build request body with parts array
  const parts = [
    { text: prompt }
  ];
  
  // Add template image if available
  if (templateBase64) {
    parts.push({
      inline_data: {
        mime_type: templateMimeType,
        data: templateBase64
      }
    });
    parts.push({ text: "This is the template image showing the celebrity scene." });
  }
  
  // Add user image
  parts.push({
    inline_data: {
      mime_type: userMimeType,
      data: userBase64
    }
  });
  parts.push({ text: "This is the user's face photo to include in the selfie." });
  
  const requestBody = {
    contents: [{
      parts: parts
    }],
    generationConfig: {
      responseModalities: ["image", "text"],
      responseMimeType: "image/png"
    }
  };
  
  const apiUrl = `${API_CONFIG.baseUrl}/${API_CONFIG.model}:generateContent?key=${API_CONFIG.apiKey}`;
  
  console.log('Calling Gemini API:', apiUrl.replace(API_CONFIG.apiKey, '***'));
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || response.statusText;
    throw new Error(`Gemini API error (${response.status}): ${errorMessage}`);
  }
  
  const result = await response.json();
  console.log('Gemini API response:', result);
  
  // Extract image from response
  if (result.candidates && result.candidates[0]?.content?.parts) {
    for (const part of result.candidates[0].content.parts) {
      if (part.inlineData) {
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${part.inlineData.data}`;
      }
    }
  }
  
  // Check for text response (might be an error or explanation)
  if (result.candidates && result.candidates[0]?.content?.parts) {
    for (const part of result.candidates[0].content.parts) {
      if (part.text) {
        console.log('Gemini response text:', part.text);
      }
    }
  }
  
  throw new Error('No image generated. The model may not support image generation with this prompt.');
}

/**
 * Load an image from URL and convert to base64
 */
async function loadImageAsBase64(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      // Get base64 (remove the data URL prefix)
      const dataUrl = canvas.toDataURL('image/png');
      const base64 = dataUrl.split(',')[1];
      resolve({ base64, mimeType: 'image/png' });
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${imageUrl}`));
    };
    
    img.src = imageUrl;
  });
}

/**
 * Check if AI processing is available
 */
function isAIAvailable() {
  return isApiConfigured();
}

/**
 * Get processing capabilities
 */
function getCapabilities() {
  return {
    aiProcessing: isApiConfigured(),
    selfieGeneration: true,
    sceneComposition: isApiConfigured(),
    apiKeyConfigured: isApiConfigured()
  };
}

// Export Processor API
export const Processor = {
  generateSelfiePull,
  setApiKey,
  isApiConfigured,
  isAIAvailable,
  getCapabilities
};
