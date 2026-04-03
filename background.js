// Background Service Worker for Chrome Extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Manga Image Translator installed');
  
  // Initialize storage with default values
  chrome.storage.local.set({
    translationEnabled: true,
    targetLanguage: 'bn',
    hoverMode: false,
    minImageSize: 50,
    processedImages: {}
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_SETTINGS') {
    chrome.storage.local.get(
      ['translationEnabled', 'targetLanguage', 'hoverMode', 'minImageSize'],
      (data) => {
        sendResponse(data);
      }
    );
    return true; // Indicate async response
  }
  
  if (request.type === 'SAVE_SETTINGS') {
    chrome.storage.local.set(request.data, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.type === 'TRANSLATE_TEXT') {
    translateText(request.text, request.targetLanguage)
      .then((translatedText) => {
        sendResponse({ success: true, translatedText });
      })
      .catch((error) => {
        console.error('Translation error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Indicate async response
  }
});

/**
 * Translate text using LibreTranslate API
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'bn' for Bengali)
 * @returns {Promise<string>} Translated text
 */
async function translateText(text, targetLanguage = 'bn') {
  if (!text || text.trim().length === 0) {
    return '';
  }

  try {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: 'auto',
        target: targetLanguage
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    console.error('Translation failed:', error);
    return text; // Return original text if translation fails
  }
}
