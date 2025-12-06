/**
 * Processor Module - Gemini Nano Banana Image API Integration
 * 
 * Generates celebrity selfie images by:
 * 1. Taking user's face photo
 * 2. Taking selected template (celebrity + scene)
 * 3. Calling Gemini Nano Banana API to generate composite selfie
 */

// API Configuration
const API_CONFIG = {
  // Gemini Nano Banana API key - set via setApiKey() or environment
  apiKey: null,
  baseUrl: 'https://api.gemini-nano-banana.dev/v1',
  model: 'imagen-3.0-generate-002'
};

/**
 * Set the Gemini Nano Banana API key
 * @param {string} key - Your API key
 */
function setApiKey(key) {
  API_CONFIG.apiKey = key;
  console.log('Gemini Nano Banana API key configured');
}

/**
 * Check if API is configured
 */
function isApiConfigured() {
  return API_CONFIG.apiKey !== null && API_CONFIG.apiKey.length > 0;
}

// Check if Gemini Nano Banana Image API is available
const isGeminiAvailable = typeof window !== 'undefined' && 
  (window.GeminiNanoBanana || window.ai?.createImageSession);

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
      return await generateWithApiKey(userImageData, template);
    } catch (error) {
      console.warn('API key generation failed, trying fallback:', error);
    }
  }
  
  // Check for browser-based Gemini Nano Banana API
  if (isGeminiAvailable) {
    try {
      return await generateWithGemini(userImageData, template);
    } catch (error) {
      console.warn('Gemini API failed, using fallback:', error);
      return fallbackGenerate(userImageData, template);
    }
  }
  
  // Fallback: show placeholder message
  return fallbackGenerate(userImageData, template);
}

/**
 * Generate using API key (REST API)
 * Sends both template image and user's face to NanoBanana API
 */
async function generateWithApiKey(userImageData, template) {
  console.log('Generating with Gemini Nano Banana API key...');
  
  // Extract base64 data from user image data URL
  const userBase64 = userImageData.split(',')[1];
  
  // Load and convert template image to base64
  let templateBase64 = null;
  if (template.templateImage) {
    try {
      templateBase64 = await loadImageAsBase64(template.templateImage);
      console.log('Template image loaded successfully');
    } catch (err) {
      console.warn('Could not load template image:', err);
    }
  }
  
  // Build the generation prompt
  const prompt = `${template.prompt}. 
    Replace the person in the reference image with the face from the uploaded image.
    Keep the celebrity and scene exactly as shown.
    Make it look natural and ultra-realistic.`;
  
  const requestBody = {
    model: API_CONFIG.model,
    prompt: prompt,
    user_image: userBase64,
    user_image_type: 'face',
    output_format: 'base64',
    size: '1024x1024',
    style: 'photorealistic',
    num_images: 1
  };
  
  // Add template image if available
  if (templateBase64) {
    requestBody.reference_image = templateBase64;
    requestBody.reference_type = 'template';
  }
  
  const response = await fetch(`${API_CONFIG.baseUrl}/images/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_CONFIG.apiKey}`,
      'X-API-Key': API_CONFIG.apiKey
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }
  
  const result = await response.json();
  
  // Return the generated image as data URL
  if (result.images && result.images[0]) {
    return `data:image/png;base64,${result.images[0]}`;
  }
  if (result.image) {
    return `data:image/png;base64,${result.image}`;
  }
  if (result.data) {
    return `data:image/png;base64,${result.data}`;
  }
  
  throw new Error('No image in API response');
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
      resolve(base64);
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${imageUrl}`));
    };
    
    img.src = imageUrl;
  });
}

/**
 * Generate with Gemini Nano Banana API
 * Uses the template prompt + user's face to generate composite
 */
async function generateWithGemini(userImageData, template) {
  // Gemini Nano Banana API - Image generation with face swap
  if (window.GeminiNanoBanana) {
    const session = await window.GeminiNanoBanana.createSession({
      model: 'image-generation',
      capabilities: ['face-swap', 'scene-composition']
    });
    
    // Generate the selfie using prompt + user face
    const result = await session.generate({
      prompt: template.prompt,
      referenceImage: userImageData,
      referenceType: 'face',
      outputSize: { width: 1024, height: 1024 },
      style: 'photorealistic'
    });
    
    return result.imageData;
  }
  
  // Chrome AI API structure (alternative)
  if (window.ai?.createImageSession) {
    const session = await window.ai.createImageSession();
    const result = await session.generate({
      prompt: template.prompt,
      inputImage: userImageData,
      mode: 'face-composite'
    });
    return result;
  }
  
  return userImageData;
}

/**
 * Fallback when API is not available
 * Creates a placeholder composite using Canvas
 */
async function fallbackGenerate(userImageData, template) {
  console.log('Using fallback generation - API not available');
  
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1024;
    canvas.height = 1024;
    
    // Create gradient background based on scene
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    const colors = getSceneColors(template.scene);
    gradient.addColorStop(0, colors.top);
    gradient.addColorStop(1, colors.bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Load user image
    const userImg = new Image();
    userImg.crossOrigin = 'anonymous';
    userImg.onload = () => {
      // Draw user image in circle (left side)
      const circleRadius = 200;
      const userX = canvas.width * 0.3;
      const userY = canvas.height * 0.5;
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(userX, userY, circleRadius, 0, Math.PI * 2);
      ctx.clip();
      
      // Scale and center user image in circle
      const scale = Math.max(circleRadius * 2 / userImg.width, circleRadius * 2 / userImg.height);
      const scaledW = userImg.width * scale;
      const scaledH = userImg.height * scale;
      ctx.drawImage(userImg, userX - scaledW/2, userY - scaledH/2, scaledW, scaledH);
      ctx.restore();
      
      // Draw circle border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(userX, userY, circleRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Add celebrity placeholder (right side)
      const celebX = canvas.width * 0.7;
      const celebY = canvas.height * 0.5;
      
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath();
      ctx.arc(celebX, celebY, circleRadius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(celebX, celebY, circleRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Celebrity name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(template.celebrity, celebX, celebY);
      
      // Scene description at bottom
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(template.name, canvas.width / 2, canvas.height - 55);
      
      ctx.font = '18px system-ui';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText('⚠️ Gemini Nano API not available - Preview Mode', canvas.width / 2, canvas.height - 25);
      
      resolve(canvas.toDataURL('image/png'));
    };
    
    userImg.onerror = () => {
      // Just show placeholder if image fails
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Upload your photo to generate selfie', canvas.width / 2, canvas.height / 2);
      resolve(canvas.toDataURL('image/png'));
    };
    
    userImg.src = userImageData;
  });
}

/**
 * Get colors for scene background
 */
function getSceneColors(scene) {
  const colors = {
    'beach': { top: '#87CEEB', bottom: '#F4A460' },
    'red-carpet': { top: '#4a0000', bottom: '#8B0000' },
    'stadium': { top: '#228B22', bottom: '#006400' },
    'cafe': { top: '#8B4513', bottom: '#D2691E' },
    'mountain': { top: '#87CEEB', bottom: '#808080' },
    'film-set': { top: '#2F4F4F', bottom: '#1a1a1a' },
    'concert': { top: '#4B0082', bottom: '#8B008B' },
    'yacht': { top: '#00CED1', bottom: '#4169E1' },
    'awards': { top: '#FFD700', bottom: '#B8860B' },
    'street': { top: '#FF6347', bottom: '#FF4500' },
    'gym': { top: '#2F4F4F', bottom: '#1a1a1a' },
    'temple': { top: '#FF8C00', bottom: '#DAA520' }
  };
  return colors[scene] || { top: '#333333', bottom: '#111111' };
}

/**
 * Check if AI processing is available
 */
function isAIAvailable() {
  return isGeminiAvailable || isApiConfigured();
}

/**
 * Get processing capabilities
 */
function getCapabilities() {
  return {
    aiProcessing: isGeminiAvailable || isApiConfigured(),
    selfieGeneration: true,
    sceneComposition: isGeminiAvailable || isApiConfigured(),
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
