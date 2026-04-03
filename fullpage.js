// Fullpage Script - Full page UI control and settings

class FullpageController {
  constructor() {
    this.enableToggle = document.getElementById('fullpage-enable-toggle');
    this.languageSelect = document.getElementById('fullpage-language-select');
    this.hoverToggle = document.getElementById('fullpage-hover-toggle');
    this.startBtn = document.getElementById('fullpage-start-btn');
    this.clearBtn = document.getElementById('fullpage-clear-btn');
    this.statusText = document.getElementById('fullpage-status-text');
    this.closeBtn = document.getElementById('close-fullpage');
    
    // Check if all elements exist
    if (!this.enableToggle || !this.languageSelect || !this.startBtn) {
      console.error('FullpageController: Missing required DOM elements');
      return;
    }
  }

  /**
   * Initialize fullpage controller
   */
  async init() {
    try {
      // Load current settings
      await this.loadSettings();

      // Setup event listeners
      this.setupEventListeners();

      console.log('FullpageController initialized');
    } catch (error) {
      console.error('Failed to initialize FullpageController:', error);
      this.setStatus('Error loading settings', 'error');
    }
  }

  /**
   * Load settings from chrome storage
   */
  loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.local.get(
        ['translationEnabled', 'targetLanguage', 'hoverMode'],
        (data) => {
          if (data.translationEnabled !== undefined) {
            this.enableToggle.checked = data.translationEnabled;
          }
          if (data.targetLanguage) {
            this.languageSelect.value = data.targetLanguage;
          }
          if (data.hoverMode !== undefined) {
            this.hoverToggle.checked = data.hoverMode;
          }
          resolve();
        }
      );
    });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    if (!this.enableToggle || !this.languageSelect || !this.startBtn || !this.clearBtn) {
      console.warn('FullpageController: Some DOM elements missing, skipping event listener setup');
      return;
    }

    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        window.close();
      });
    }

    this.enableToggle.addEventListener('change', (e) => {
      this.saveSettings({
        translationEnabled: e.target.checked
      });
      this.updateContentScript();
    });

    this.languageSelect.addEventListener('change', (e) => {
      this.saveSettings({
        targetLanguage: e.target.value
      });
      this.updateContentScript();
    });

    this.hoverToggle.addEventListener('change', (e) => {
      this.saveSettings({
        hoverMode: e.target.checked
      });
      this.updateContentScript();
    });

    this.startBtn.addEventListener('click', () => {
      this.onStartTranslation();
    });

    this.clearBtn.addEventListener('click', () => {
      this.onClearTranslations();
    });
  }

  /**
   * Save settings to chrome storage
   */
  saveSettings(settings) {
    chrome.storage.local.set(settings, () => {
      console.log('Settings saved:', settings);
    });
  }

  /**
   * Update content script with new settings
   */
  updateContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id !== chrome.runtime.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'UPDATE_SETTINGS',
          isEnabled: this.enableToggle.checked,
          targetLanguage: this.languageSelect.value,
          hoverMode: this.hoverToggle.checked
        }).catch((error) => {
          console.warn('Could not update content script:', error);
        });
      }
    });
  }

  /**
   * Handle start translation button
   */
  onStartTranslation() {
    if (!this.startBtn) return;
    
    if (!this.enableToggle || !this.enableToggle.checked) {
      this.setStatus('Translator is disabled. Enable it first.', 'warning');
      return;
    }

    this.setStatus('Starting translation...', 'info');
    this.startBtn.disabled = true;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: 'START_TRANSLATION' },
          (response) => {
            if (response?.success) {
              this.setStatus('Translation started! Check the website.', 'success');
              setTimeout(() => {
                this.startBtn.disabled = false;
              }, 2000);
            } else {
              this.setStatus('Failed to start translation', 'error');
              this.startBtn.disabled = false;
            }
          }
        ).catch((error) => {
          this.setStatus(
            'Content script not loaded. Go to a website first.',
            'error'
          );
          this.startBtn.disabled = false;
        });
      }
    });
  }

  /**
   * Handle clear translations button
   */
  onClearTranslations() {
    this.setStatus('Clearing translations...', 'info');

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: 'CLEAR_TRANSLATIONS' },
          (response) => {
            if (response?.success) {
              this.setStatus('All translations cleared.', 'success');
            } else {
              this.setStatus('Failed to clear translations', 'error');
            }
          }
        ).catch(() => {
          this.setStatus('Content script not loaded.', 'error');
        });
      }
    });
  }

  /**
   * Update status message
   */
  setStatus(message, type = 'info') {
    if (this.statusText) {
      this.statusText.textContent = message;
    }
    const statusBox = document.getElementById('fullpage-status');
    if (statusBox) {
      statusBox.className = `status-box status-${type}`;

      if (type === 'success') {
        setTimeout(() => {
          statusBox.className = 'status-box';
        }, 3000);
      }
    }
  }
}

// Initialize fullpage controller when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    try {
      const controller = new FullpageController();
      controller.init();
    } catch (error) {
      console.error('Fullpage initialization error:', error);
    }
  });
} else {
  try {
    const controller = new FullpageController();
    controller.init();
  } catch (error) {
    console.error('Fullpage initialization error:', error);
  }
}
