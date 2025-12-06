/**
 * UI Module - DOM Interactions & Event Handlers
 * 
 * Manages all UI interactions:
 * - Template carousel rendering
 * - File input and drag-drop
 * - Camera capture
 * - Control sliders
 * - Action buttons
 * - History panel
 * - Toast notifications
 */

import { Store } from './store.js';
import { Canvas } from './canvas.js';
import { DB } from './db.js';
import { Processor } from './processor.js';

// DOM Elements cache
let elements = {};

// Debounce timer for sliders
let sliderDebounceTimer = null;
const SLIDER_DEBOUNCE_MS = 16; // ~60fps

/**
 * Initialize UI
 */
function init() {
  cacheElements();
  setupEventListeners();
  renderTemplates();
  loadHistory();
  
  // Subscribe to store changes
  Store.subscribe(handleStateChange);
  
  console.log('UI initialized');
}

/**
 * Cache DOM elements for performance
 */
function cacheElements() {
  elements = {
    // Carousel
    carouselContainer: document.querySelector('.carousel-container'),
    
    // Upload
    uploadZone: document.querySelector('.upload-zone'),
    fileInput: document.getElementById('file-input'),
    cameraBtn: document.getElementById('camera-btn'),
    
    // Canvas
    canvas: document.getElementById('preview-canvas'),
    controlsContainer: document.querySelector('.controls'),
    
    // Actions
    downloadBtn: document.getElementById('download-btn'),
    shareBtn: document.getElementById('share-btn'),
    resetBtn: document.getElementById('reset-btn'),
    historyBtn: document.getElementById('history-btn'),
    
    // History
    historyPanel: document.getElementById('history-panel'),
    historyGrid: document.querySelector('.history-grid'),
    closeHistoryBtn: document.getElementById('close-history-btn')
  };
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // File input
  elements.fileInput?.addEventListener('change', handleFileSelect);
  
  // Drag and drop
  elements.uploadZone?.addEventListener('dragover', handleDragOver);
  elements.uploadZone?.addEventListener('dragleave', handleDragLeave);
  elements.uploadZone?.addEventListener('drop', handleDrop);
  elements.uploadZone?.addEventListener('click', handleUploadClick);
  elements.uploadZone?.addEventListener('keydown', handleUploadKeydown);
  
  // Camera
  elements.cameraBtn?.addEventListener('click', handleCameraClick);
  
  // Actions
  elements.downloadBtn?.addEventListener('click', handleDownload);
  elements.shareBtn?.addEventListener('click', handleShare);
  elements.resetBtn?.addEventListener('click', handleReset);
  elements.historyBtn?.addEventListener('click', toggleHistoryPanel);
  elements.closeHistoryBtn?.addEventListener('click', toggleHistoryPanel);
  
  // Initialize canvas
  if (elements.canvas) {
    Canvas.init(elements.canvas);
  }
  
  // Add control sliders
  renderControls();
}

/**
 * Handle state changes
 */
function handleStateChange(event, data, state) {
  switch (event) {
    case 'templateSelected':
      updateTemplateSelection(data.id);
      updateActionButtons();
      break;
    case 'userImageChanged':
      updateActionButtons();
      break;
    case 'stateReset':
      clearTemplateSelection();
      updateActionButtons();
      break;
  }
}

/**
 * Render template carousel
 */
function renderTemplates() {
  const templates = Store.getTemplates();
  const container = elements.carouselContainer;
  
  if (!container) return;
  
  container.innerHTML = templates.map(template => `
    <div class="template-card" 
         data-id="${template.id}" 
         tabindex="0" 
         role="button"
         aria-label="Select ${template.name}">
      <img src="${template.imageUrl}" 
           alt="${template.name}" 
           loading="lazy">
      <div class="template-info">
        <div class="template-name">${template.name}</div>
        <div class="template-category">${template.category}</div>
        ${template.trendingRank <= 3 ? '<span class="trending-badge">🔥 Trending</span>' : ''}
      </div>
    </div>
  `).join('');
  
  // Add click listeners
  container.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => handleTemplateSelect(card.dataset.id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleTemplateSelect(card.dataset.id);
      }
    });
  });
  
  // Setup lazy loading with IntersectionObserver
  setupLazyLoading();
}

/**
 * Setup lazy loading for template images
 */
function setupLazyLoading() {
  const images = elements.carouselContainer?.querySelectorAll('img[loading="lazy"]');
  
  if (!images || !('IntersectionObserver' in window)) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });
  
  images.forEach(img => observer.observe(img));
}

/**
 * Handle template selection
 */
function handleTemplateSelect(templateId) {
  Store.setSelectedTemplate(templateId);
}

/**
 * Update template selection UI
 */
function updateTemplateSelection(selectedId) {
  elements.carouselContainer?.querySelectorAll('.template-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.id === selectedId);
  });
}

/**
 * Clear template selection UI
 */
function clearTemplateSelection() {
  elements.carouselContainer?.querySelectorAll('.template-card').forEach(card => {
    card.classList.remove('selected');
  });
}

/**
 * Render control sliders
 */
function renderControls() {
  const container = elements.controlsContainer;
  if (!container) return;
  
  const params = Store.getEditParams();
  
  container.innerHTML = `
    <div class="control-group">
      <label for="scale-slider">
        <span>Scale</span>
        <span id="scale-value">${params.scale}%</span>
      </label>
      <input type="range" id="scale-slider" 
             min="50" max="200" value="${params.scale}" 
             aria-label="Adjust image scale">
    </div>
    <div class="control-group">
      <label for="rotation-slider">
        <span>Rotation</span>
        <span id="rotation-value">${params.rotation}°</span>
      </label>
      <input type="range" id="rotation-slider" 
             min="0" max="360" value="${params.rotation}" 
             aria-label="Adjust image rotation">
    </div>
    <div class="control-group">
      <label for="opacity-slider">
        <span>Opacity</span>
        <span id="opacity-value">${params.opacity}%</span>
      </label>
      <input type="range" id="opacity-slider" 
             min="0" max="100" value="${params.opacity}" 
             aria-label="Adjust image opacity">
    </div>
  `;
  
  // Add slider listeners
  container.querySelector('#scale-slider')?.addEventListener('input', handleSliderChange);
  container.querySelector('#rotation-slider')?.addEventListener('input', handleSliderChange);
  container.querySelector('#opacity-slider')?.addEventListener('input', handleSliderChange);
}

/**
 * Handle slider changes with debounce
 */
function handleSliderChange(e) {
  const slider = e.target;
  const value = parseInt(slider.value, 10);
  const param = slider.id.replace('-slider', '');
  
  // Update label immediately
  const valueLabel = document.getElementById(`${param}-value`);
  if (valueLabel) {
    valueLabel.textContent = param === 'rotation' ? `${value}°` : `${value}%`;
  }
  
  // Debounce store update
  clearTimeout(sliderDebounceTimer);
  sliderDebounceTimer = setTimeout(() => {
    Store.updateEditParams({ [param]: value });
  }, SLIDER_DEBOUNCE_MS);
}

/**
 * Handle file selection
 */
function handleFileSelect(e) {
  const file = e.target.files?.[0];
  if (file) processFile(file);
}

/**
 * Handle drag over
 */
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  elements.uploadZone?.classList.add('dragover');
}

/**
 * Handle drag leave
 */
function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  elements.uploadZone?.classList.remove('dragover');
}

/**
 * Handle drop
 */
function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  elements.uploadZone?.classList.remove('dragover');
  
  const file = e.dataTransfer?.files?.[0];
  if (file) processFile(file);
}

/**
 * Handle upload zone click
 */
function handleUploadClick(e) {
  if (e.target === elements.cameraBtn || e.target.closest('.camera-btn')) return;
  if (e.target === elements.fileInput || e.target.closest('label[for="file-input"]')) return;
  elements.fileInput?.click();
}

/**
 * Handle upload zone keyboard
 */
function handleUploadKeydown(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    elements.fileInput?.click();
  }
}

/**
 * Process uploaded file
 */
async function processFile(file) {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    showToast('Please upload a JPG, PNG, or WebP image', 'error');
    return;
  }
  
  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    showToast('Image must be less than 5MB', 'error');
    return;
  }
  
  Store.setProcessing(true);
  
  try {
    // Read file as data URL
    const dataUrl = await readFileAsDataURL(file);
    
    // Process through AI (or fallback)
    const processedImage = await Processor.processImage(dataUrl);
    
    // Update store
    Store.setUserImage(processedImage);
    showToast('Image uploaded successfully', 'success');
  } catch (error) {
    console.error('Error processing file:', error);
    showToast('Failed to process image', 'error');
  } finally {
    Store.setProcessing(false);
  }
}

/**
 * Read file as data URL
 */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Handle camera button click
 */
async function handleCameraClick(e) {
  e.stopPropagation();
  
  // Check for camera support
  if (!navigator.mediaDevices?.getUserMedia) {
    showToast('Camera not supported on this device', 'error');
    return;
  }
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'user' } 
    });
    
    showCameraModal(stream);
  } catch (error) {
    console.error('Camera error:', error);
    if (error.name === 'NotAllowedError') {
      showToast('Camera permission denied', 'error');
    } else {
      showToast('Could not access camera', 'error');
    }
  }
}

/**
 * Show camera modal
 */
function showCameraModal(stream) {
  const modal = document.createElement('div');
  modal.className = 'camera-modal';
  modal.innerHTML = `
    <video autoplay playsinline></video>
    <div class="camera-controls">
      <button class="action-btn capture-btn">📸 Capture</button>
      <button class="action-btn cancel-btn">✕ Cancel</button>
    </div>
  `;
  
  const video = modal.querySelector('video');
  video.srcObject = stream;
  
  // Capture button
  modal.querySelector('.capture-btn').addEventListener('click', () => {
    captureFrame(video);
    closeCamera(modal, stream);
  });
  
  // Cancel button
  modal.querySelector('.cancel-btn').addEventListener('click', () => {
    closeCamera(modal, stream);
  });
  
  // Close on escape
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeCamera(modal, stream);
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
  
  document.body.appendChild(modal);
}

/**
 * Capture frame from video
 */
function captureFrame(video) {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  
  const dataUrl = canvas.toDataURL('image/png');
  Store.setUserImage(dataUrl);
  showToast('Photo captured!', 'success');
}

/**
 * Close camera modal and stop stream
 */
function closeCamera(modal, stream) {
  stream.getTracks().forEach(track => track.stop());
  modal.remove();
}

/**
 * Handle download
 */
async function handleDownload() {
  if (!Canvas.isReadyForExport()) {
    showToast('Please select a template and upload an image first', 'error');
    return;
  }
  
  try {
    const dataUrl = Canvas.exportAsDataURL('image/png');
    const template = Store.getSelectedTemplate();
    const filename = `selfie-${template?.name?.toLowerCase().replace(/\s+/g, '-') || 'celebrity'}-${Date.now()}.png`;
    
    // Create download link
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
    
    // Save to history
    await saveToHistory(dataUrl);
    
    showToast('Image downloaded!', 'success');
  } catch (error) {
    console.error('Download error:', error);
    showToast('Failed to download image', 'error');
  }
}

/**
 * Handle share
 */
async function handleShare() {
  if (!Canvas.isReadyForExport()) {
    showToast('Please select a template and upload an image first', 'error');
    return;
  }
  
  try {
    const blob = await Canvas.exportAsBlob('image/png');
    
    // Try Web Share API
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], 'selfie.png', { type: 'image/png' });
      const shareData = { files: [file] };
      
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        await saveToHistory(Canvas.exportAsDataURL());
        showToast('Shared successfully!', 'success');
        return;
      }
    }
    
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      await saveToHistory(Canvas.exportAsDataURL());
      showToast('Image copied to clipboard!', 'success');
    } catch {
      // Final fallback: download
      handleDownload();
    }
  } catch (error) {
    console.error('Share error:', error);
    showToast('Failed to share image', 'error');
  }
}

/**
 * Handle reset
 */
function handleReset() {
  Store.resetState();
  renderControls();
  showToast('Reset complete', 'success');
}

/**
 * Save to history
 */
async function saveToHistory(finalImage) {
  const template = Store.getSelectedTemplate();
  const userImage = Store.getUserImage();
  const editParams = Store.getEditParams();
  
  try {
    await DB.saveImage({
      templateId: template?.id,
      originalImage: userImage,
      editParams,
      finalImage
    });
    
    // Refresh history UI
    loadHistory();
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
}

/**
 * Load history from IndexedDB
 */
async function loadHistory() {
  try {
    const images = await DB.getImages();
    renderHistory(images);
  } catch (error) {
    console.error('Failed to load history:', error);
  }
}

/**
 * Render history grid
 */
function renderHistory(images) {
  const grid = elements.historyGrid;
  if (!grid) return;
  
  if (images.length === 0) {
    grid.innerHTML = '<p style="color: var(--color-text-muted)">No recent creations</p>';
    return;
  }
  
  grid.innerHTML = images.map(img => `
    <div class="history-item" data-id="${img.id}" tabindex="0" role="button">
      <img src="${img.finalImage}" alt="Created ${new Date(img.timestamp).toLocaleDateString()}">
    </div>
  `).join('');
  
  // Add click listeners
  grid.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', () => handleHistoryItemClick(item.dataset.id));
  });
}

/**
 * Handle history item click
 */
async function handleHistoryItemClick(id) {
  try {
    const image = await DB.getImage(id);
    if (image?.finalImage) {
      // Download the image
      const link = document.createElement('a');
      link.href = image.finalImage;
      link.download = `selfie-${id}.png`;
      link.click();
    }
  } catch (error) {
    console.error('Failed to load history item:', error);
  }
}

/**
 * Toggle history panel
 */
function toggleHistoryPanel() {
  const panel = elements.historyPanel;
  if (panel) {
    panel.hidden = !panel.hidden;
  }
}

/**
 * Update action buttons state
 */
function updateActionButtons() {
  const isReady = Canvas.isReadyForExport();
  
  if (elements.downloadBtn) elements.downloadBtn.disabled = !isReady;
  if (elements.shareBtn) elements.shareBtn.disabled = !isReady;
  if (elements.resetBtn) elements.resetBtn.disabled = !Store.getSelectedTemplate() && !Store.getUserImage();
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  // Remove existing toasts
  document.querySelectorAll('.toast').forEach(t => t.remove());
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.setAttribute('role', 'alert');
  
  document.body.appendChild(toast);
  
  // Auto-remove after 3 seconds
  setTimeout(() => toast.remove(), 3000);
}

// Export UI API
export const UI = {
  init,
  showToast,
  loadHistory
};
