// Content Script - Main Logic for Image Translation

class ImageTranslator {
  constructor() {
    this.isEnabled = true;
    this.targetLanguage = 'bn';
    this.hoverMode = false;
    this.translationInProgress = new Set();
    this.processedImages = new Map();
    this.overlayContainer = null;
    this.floatingButton = null;
    this.minImageSize = 50;
    this.tessInitialized = false;
  }

  /**
   * Initialize the translator
   */
  async init() {
    try {
      await this.loadSettings();
      this.injectStyles();
      this.createFloatingButton();
      this.setupMessageListener();
      console.log('ImageTranslator initialized');
    } catch (error) {
      console.error('Failed to initialize ImageTranslator:', error);
    }
  }

  /**
   * Load settings from background script
   */
  loadSettings() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (response) => {
        if (response) {
          this.isEnabled = response.translationEnabled ?? true;
          this.targetLanguage = response.targetLanguage ?? 'bn';
          this.hoverMode = response.hoverMode ?? false;
          this.minImageSize = response.minImageSize ?? 50;
        }
        resolve();
      });
    });
  }

  /**
   * Setup message listener for popup communication
   */
  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === 'START_TRANSLATION') {
        this.startTranslation();
        sendResponse({ success: true });
      } else if (request.type === 'STOP_TRANSLATION') {
        this.stopTranslation();
        sendResponse({ success: true });
      } else if (request.type === 'CLEAR_TRANSLATIONS') {
        this.clearTranslations();
        sendResponse({ success: true });
      } else if (request.type === 'UPDATE_SETTINGS') {
        this.targetLanguage = request.targetLanguage;
        this.hoverMode = request.hoverMode;
        this.isEnabled = request.isEnabled;
        sendResponse({ success: true });
      }
    });
  }

  /**
   * Create floating button to control translation
   */
  createFloatingButton() {
    if (this.floatingButton) return;

    this.floatingButton = document.createElement('div');
    this.floatingButton.id = 'img-translator-btn';
    this.floatingButton.className = 'img-translator-btn';
    this.floatingButton.innerHTML = `
      <button id="img-translator-toggle" title="Translate Images">
        T
      </button>
      <div id="img-translator-menu" class="img-translator-menu">
        <button id="img-translator-start">Start Scan</button>
        <button id="img-translator-clear">Clear</button>
      </div>
    `;

    document.body.appendChild(this.floatingButton);

    const toggleBtn = document.getElementById('img-translator-toggle');
    const startBtn = document.getElementById('img-translator-start');
    const clearBtn = document.getElementById('img-translator-clear');

    toggleBtn.addEventListener('click', () => {
      const menu = document.getElementById('img-translator-menu');
      menu.classList.toggle('show');
    });

    startBtn.addEventListener('click', () => {
      this.startTranslation();
      document.getElementById('img-translator-menu').classList.remove('show');
    });

    clearBtn.addEventListener('click', () => {
      this.clearTranslations();
      document.getElementById('img-translator-menu').classList.remove('show');
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#img-translator-btn')) {
        document.getElementById('img-translator-menu')?.classList.remove('show');
      }
    });
  }

  /**
   * Start translation process
   */
  async startTranslation() {
    if (!this.isEnabled) return;

    const images = this.detectImages();
    console.log(`Found ${images.length} images`);

    for (const img of images) {
      if (
        this.translationInProgress.has(img) ||
        this.processedImages.has(img)
      ) {
        continue;
      }

      this.translationInProgress.add(img);
      await this.processImage(img);
      this.translationInProgress.delete(img);
    }

    console.log('Translation complete');
  }

  /**
   * Detect all images on the page
   */
  detectImages() {
    const images = [];
    const imageElements = document.querySelectorAll('img');

    imageElements.forEach((img) => {
      if (
        img.offsetWidth >= this.minImageSize &&
        img.offsetHeight >= this.minImageSize &&
        this.isImageVisible(img)
      ) {
        images.push(img);
      }
    });

    return images;
  }

  /**
   * Check if image is visible in viewport
   */
  isImageVisible(img) {
    const rect = img.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );
  }

  /**
   * Process a single image
   */
  async processImage(img) {
    try {
      // Get image source
      const src = img.src || img.currentSrc;
      if (!src) return;

      // Check if image is accessible
      if (src.startsWith('data:') || src.startsWith('blob:')) {
        // For data URLs and blobs, use the img directly
        await this.performOCR(img);
      } else {
        // For regular URLs, fetch the image
        const canvas = await this.imageToCanvas(img);
        if (canvas) {
          await this.performOCR(canvas);
        }
      }

      this.processedImages.set(img, true);
      this.showLoadingIndicator(img, false);
    } catch (error) {
      console.error('Error processing image:', error);
      this.showLoadingIndicator(img, false);
    }
  }

  /**
   * Convert image element to canvas
   */
  imageToCanvas(img) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    });
  }

  /**
   * Perform OCR on image using Tesseract
   */
  async performOCR(imgElement) {
    try {
      this.showLoadingIndicator(imgElement, true);

      // Initialize Tesseract if needed
      if (!this.tessInitialized) {
        if (typeof Tesseract === 'undefined') {
          console.warn('Tesseract.js not loaded yet');
          return;
        }
        this.tessInitialized = true;
      }

      // Perform OCR with Japanese support
      const { data } = await Tesseract.recognize(imgElement, ['jpn', 'eng']);

      if (data.text && data.text.trim().length > 0) {
        await this.translateAndOverlay(imgElement, data);
      }

      this.showLoadingIndicator(imgElement, false);
    } catch (error) {
      console.error('OCR error:', error);
      this.showLoadingIndicator(imgElement, false);
    }
  }

  /**
   * Translate text and create overlay
   */
  async translateAndOverlay(imgElement, ocrData) {
    try {
      const extractedText = ocrData.text.trim();
      if (!extractedText) return;

      // Send translation request to background script
      const translatedText = await new Promise((resolve) => {
        chrome.runtime.sendMessage(
          {
            type: 'TRANSLATE_TEXT',
            text: extractedText,
            targetLanguage: this.targetLanguage
          },
          (response) => {
            resolve(response?.translatedText || extractedText);
          }
        );
      });

      // Create overlay with translated text
      this.createOverlay(
        imgElement,
        {
          original: extractedText,
          translated: translatedText,
          confidence: ocrData.confidence
        },
        ocrData.lines || []
      );
    } catch (error) {
      console.error('Translation overlay error:', error);
    }
  }

  /**
   * Create overlay container for translated text
   */
  createOverlay(imgElement, texts, lines) {
    try {
      const rect = imgElement.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      // Create overlay div
      const overlay = document.createElement('div');
      overlay.className = 'img-translator-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = rect.top + scrollY + 'px';
      overlay.style.left = rect.left + scrollX + 'px';
      overlay.style.width = rect.width + 'px';
      overlay.style.height = rect.height + 'px';
      overlay.style.zIndex = '9999';
      overlay.style.pointerEvents = 'none';

      // Create text box
      const textBox = document.createElement('div');
      textBox.className = 'img-translator-textbox';
      textBox.innerHTML = `
        <div class="img-translator-text-original">${this.escapeHtml(texts.original)}</div>
        <div class="img-translator-text-translated">${this.escapeHtml(texts.translated)}</div>
      `;

      overlay.appendChild(textBox);
      document.body.appendChild(overlay);

      // Handle hover mode
      if (this.hoverMode) {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';

        imgElement.addEventListener('mouseenter', () => {
          overlay.style.opacity = '1';
        });

        imgElement.addEventListener('mouseleave', () => {
          overlay.style.opacity = '0';
        });
      }
    } catch (error) {
      console.error('Overlay creation error:', error);
    }
  }

  /**
   * Show loading indicator on image
   */
  showLoadingIndicator(imgElement, show) {
    if (show) {
      const spinner = document.createElement('div');
      spinner.className = 'img-translator-spinner';
      spinner.id = `spinner-${Math.random()}`;

      const rect = imgElement.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      spinner.style.position = 'fixed';
      spinner.style.top = `${rect.top + scrollY + rect.height / 2 - 15}px`;
      spinner.style.left = `${rect.left + scrollX + rect.width / 2 - 15}px`;
      spinner.style.zIndex = '10000';

      document.body.appendChild(spinner);
      imgElement._spinnerElement = spinner;
    } else {
      if (imgElement._spinnerElement) {
        imgElement._spinnerElement.remove();
        delete imgElement._spinnerElement;
      }
    }
  }

  /**
   * Clear all translations
   */
  clearTranslations() {
    const overlays = document.querySelectorAll('.img-translator-overlay');
    overlays.forEach((overlay) => overlay.remove());

    this.translationInProgress.clear();
    this.processedImages.clear();
  }

  /**
   * Stop translation
   */
  stopTranslation() {
    // Stop any pending OCR operations by clearing the set
    this.translationInProgress.clear();
  }

  /**
   * Inject CSS styles
   */
  injectStyles() {
    if (document.getElementById('img-translator-styles')) return;

    const style = document.createElement('style');
    style.id = 'img-translator-styles';
    style.textContent = `
      .img-translator-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      #img-translator-toggle {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4285F4, #34A853);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
      }

      #img-translator-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      #img-translator-toggle:active {
        transform: scale(0.95);
      }

      .img-translator-menu {
        position: absolute;
        bottom: 70px;
        right: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        opacity: 0;
        transform: translateY(10px);
        pointer-events: none;
        transition: all 0.3s ease;
      }

      .img-translator-menu.show {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      .img-translator-menu button {
        display: block;
        width: 100%;
        padding: 12px 16px;
        border: none;
        background: white;
        color: #333;
        text-align: left;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s ease;
      }

      .img-translator-menu button:hover {
        background: #f5f5f5;
      }

      .img-translator-menu button:first-child {
        border-bottom: 1px solid #eee;
      }

      .img-translator-overlay {
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.1);
      }

      .img-translator-textbox {
        background: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        max-width: 90%;
        backdrop-filter: blur(5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .img-translator-text-original {
        font-size: 12px;
        opacity: 0.7;
        margin-bottom: 8px;
        line-height: 1.4;
        max-height: 60px;
        overflow-y: auto;
      }

      .img-translator-text-translated {
        font-size: 14px;
        font-weight: bold;
        line-height: 1.5;
        max-height: 100px;
        overflow-y: auto;
      }

      .img-translator-spinner {
        width: 30px;
        height: 30px;
        border: 3px solid rgba(66, 133, 244, 0.3);
        border-top: 3px solid #4285F4;
        border-radius: 50%;
        animation: img-translator-spin 0.8s linear infinite;
      }

      @keyframes img-translator-spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Escape HTML special characters
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Load Tesseract.js library
function loadTesseractLibrary() {
  return new Promise((resolve) => {
    // Check if Tesseract is already loaded
    if (typeof Tesseract !== 'undefined') {
      resolve();
      return;
    }

    // Create and append script tag
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5';
    script.onload = () => {
      console.log('Tesseract.js loaded');
      resolve();
    };
    script.onerror = () => {
      console.error('Failed to load Tesseract.js');
      resolve(); // Continue even if library fails to load
    };
    document.head.appendChild(script);
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    await loadTesseractLibrary();
    const translator = new ImageTranslator();
    await translator.init();
    window.imageTranslator = translator;
  });
} else {
  (async () => {
    await loadTesseractLibrary();
    const translator = new ImageTranslator();
    await translator.init();
    window.imageTranslator = translator;
  })();
}
