/**
 * Processor Module - Gemini Nano Banana Image API Integration
 * 
 * Generates celebrity selfie images by:
 * 1. Taking user's face photo
 * 2. Taking selected template (celebrity + scene)
 * 3. Calling Gemini Nano Banana API to generate composite selfie
 */

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
  
  // Check for Gemini Nano Banana API
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
  return isGeminiAvailable;
}

/**
 * Get processing capabilities
 */
function getCapabilities() {
  return {
    aiProcessing: isGeminiAvailable,
    selfieGeneration: true,
    sceneComposition: isGeminiAvailable
  };
}

// Export Processor API
export const Processor = {
  generateSelfiePull,
  isAIAvailable,
  getCapabilities
};
