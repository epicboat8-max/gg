# API Documentation & Developer Guide

## Architecture Overview

The extension uses a **content script** architecture with **service worker** for background tasks:

```
User Interaction (Popup)
    ↓
Chrome Storage (Settings)
    ↓ (Message passing)
Content Script (Web pages)
    ↓ (Message passing)
Service Worker (background.js)
    ↓
External APIs (Tesseract.js CDN, LibreTranslate API)
```

## Message Types

### From Popup to Content Script

#### GET_SETTINGS
**Retrieves current settings from storage**
```javascript
chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (response) => {
  console.log(response);
  // { translationEnabled: true, targetLanguage: 'bn', hoverMode: false, minImageSize: 50 }
});
```

#### START_TRANSLATION
**Start scanning and translating images on current page**
```javascript
chrome.runtime.sendMessage({ type: 'START_TRANSLATION' }, (response) => {
  console.log(response); // { success: true }
});
```

#### STOP_TRANSLATION
**Stop current translation process**
```javascript
chrome.runtime.sendMessage({ type: 'STOP_TRANSLATION' }, (response) => {
  console.log(response); // { success: true }
});
```

#### CLEAR_TRANSLATIONS
**Remove all translation overlays from page**
```javascript
chrome.runtime.sendMessage({ type: 'CLEAR_TRANSLATIONS' }, (response) => {
  console.log(response); // { success: true }
});
```

#### UPDATE_SETTINGS
**Update translator settings**
```javascript
chrome.runtime.sendMessage({
  type: 'UPDATE_SETTINGS',
  isEnabled: true,
  targetLanguage: 'bn',
  hoverMode: false
}, (response) => {
  console.log(response); // { success: true }
});
```

### From Content Script to Service Worker

#### TRANSLATE_TEXT
**Request translation of text**
```javascript
chrome.runtime.sendMessage({
  type: 'TRANSLATE_TEXT',
  text: 'こんにちは',
  targetLanguage: 'bn'
}, (response) => {
  console.log(response);
  // { success: true, translatedText: 'হ্যালো' }
});
```

#### GET_SETTINGS
**Retrieve settings from service worker**
```javascript
chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (response) => {
  // response contains all current settings
});
```

#### SAVE_SETTINGS
**Save settings to storage**
```javascript
chrome.runtime.sendMessage({
  type: 'SAVE_SETTINGS',
  data: { targetLanguage: 'hi' }
}, (response) => {
  console.log(response); // { success: true }
});
```

## ImageTranslator Class API

### Methods

#### init()
Initialize the translator on page load
```javascript
await imageTranslator.init();
```

#### startTranslation()
Begin scanning and translating images
```javascript
imageTranslator.startTranslation();
```

#### stopTranslation()
Stop current translation process
```javascript
imageTranslator.stopTranslation();
```

#### clearTranslations()
Remove all overlays from page
```javascript
imageTranslator.clearTranslations();
```

#### detectImages()
Get array of eligible images on page
```javascript
const images = imageTranslator.detectImages();
// Returns: [HTMLImageElement, HTMLImageElement, ...]
```

#### processImage(img)
Process a single image (OCR + translate + overlay)
```javascript
await imageTranslator.processImage(imageElement);
```

#### performOCR(imgElement)
Extract text from image using Tesseract
```javascript
await imageTranslator.performOCR(imageElement);
```

#### translateAndOverlay(imgElement, ocrData)
Translate extracted text and create overlay
```javascript
await imageTranslator.translateAndOverlay(imageElement, {
  text: 'おはよう',
  confidence: 0.95,
  lines: []
});
```

### Properties

```javascript
imageTranslator.isEnabled         // Boolean - translation on/off
imageTranslator.targetLanguage    // String - language code (e.g., 'bn')
imageTranslator.hoverMode         // Boolean - hover to show translations
imageTranslator.minImageSize      // Number - minimum image size in pixels
imageTranslator.processedImages   // Map - cache of processed images
imageTranslator.translationInProgress // Set - images being processed
```

## Chrome Storage Structure

### Storage Format
```javascript
{
  translationEnabled: true,        // Boolean
  targetLanguage: 'bn',            // String (language code)
  hoverMode: false,                // Boolean
  minImageSize: 50,                // Number (pixels)
  processedImages: {}              // Object (cache)
}
```

### Reading Storage
```javascript
chrome.storage.local.get(['translationEnabled', 'targetLanguage'], (data) => {
  console.log(data.translationEnabled);  // true
  console.log(data.targetLanguage);      // 'bn'
});
```

### Writing Storage
```javascript
chrome.storage.local.set({
  targetLanguage: 'hi',
  hoverMode: true
}, () => {
  console.log('Settings saved');
});
```

## OCR Processing

### Tesseract.js Configuration
```javascript
// Current implementation uses:
Tesseract.recognize(imgElement, ['jpn', 'eng'])

// Response structure:
{
  data: {
    text: 'Extracted text content',
    confidence: 0.95,
    lines: [/* line-level data */],
    blocks: [/* block-level data */],
    words: [/* word-level data */]
  }
}
```

### Language Codes for OCR
```javascript
'jpn'     // Japanese
'eng'     // English
'chi_sim' // Chinese (Simplified)
'chi_tra' // Chinese (Traditional)
'kor'     // Korean
```

## Translation API

### LibreTranslate Endpoint
```
URL: https://libretranslate.de/translate
Method: POST
```

### Request Format
```javascript
{
  q: 'Text to translate',
  source: 'auto',              // auto-detect source language
  target: 'bn'                 // target language code
}
```

### Response Format
```javascript
{
  translatedText: 'অনুবাদিত পাঠ্য',
  detectedLanguage: {
    confidence: 0.95,
    language: 'en'
  }
}
```

### Supported Language Codes
```
bn   - Bengali
en   - English
hi   - Hindi
ta   - Tamil
te   - Telugu
es   - Spanish
fr   - French
de   - German
pt   - Portuguese
zh   - Chinese
ko   - Korean
ru   - Russian
ar   - Arabic
ja   - Japanese
```

## DOM Manipulation

### Floating Button Structure
```html
<div id="img-translator-btn" class="img-translator-btn">
  <button id="img-translator-toggle">T</button>
  <div id="img-translator-menu" class="img-translator-menu">
    <button id="img-translator-start">Start Scan</button>
    <button id="img-translator-clear">Clear</button>
  </div>
</div>
```

### Overlay Structure
```html
<div class="img-translator-overlay">
  <div class="img-translator-textbox">
    <div class="img-translator-text-original">Original text</div>
    <div class="img-translator-text-translated">翻訳されたテキスト</div>
  </div>
</div>
```

### Loading Spinner
```html
<div class="img-translator-spinner" id="spinner-{random}"></div>
```

## CSS Classes

| Class | Purpose |
|-------|---------|
| `.img-translator-btn` | Floating control button container |
| `.img-translator-menu` | Menu dropdown |
| `.img-translator-toggle` | Toggle button |
| `.img-translator-overlay` | Text overlay container |
| `.img-translator-textbox` | Text box styling |
| `.img-translator-text-original` | Original text styling |
| `.img-translator-text-translated` | Translated text styling |
| `.img-translator-spinner` | Loading indicator |

## Permissions & Host Access

### manifest.json Permissions
```json
{
  "permissions": [
    "activeTab",           // Access active tab
    "scripting",           // Inject scripts
    "webRequest",          // Network requests
    "storage"              // Local storage
  ],
  "host_permissions": [
    "<all_urls>"          // Access all websites
  ]
}
```

## Event Handling

### Content Script Events
```javascript
// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'START_TRANSLATION') {
    // handle message
  }
});

// Image click detection
img.addEventListener('click', (e) => {
  // custom handling
});

// Hover mode detection
img.addEventListener('mouseenter', () => {
  overlay.style.opacity = '1';
});
```

## Error Handling

### Try-Catch Pattern
```javascript
try {
  await imageTranslator.processImage(img);
} catch (error) {
  console.error('Processing error:', error);
  // Graceful fallback
}
```

### Message Response Errors
```javascript
chrome.runtime.sendMessage(request, (response) => {
  if (chrome.runtime.lastError) {
    console.error('Message error:', chrome.runtime.lastError);
  }
});
```

## Performance Optimization Tips

### Lazy Loading
```javascript
// Process images one by one
for (const img of images) {
  if (this.translationInProgress.has(img)) continue;
  await this.processImage(img);
}
```

### Image Caching
```javascript
// Prevent re-processing
if (this.processedImages.has(img)) {
  return;
}
this.processedImages.set(img, true);
```

### Visibility Detection
```javascript
isImageVisible(img) {
  const rect = img.getBoundingClientRect();
  return (
    rect.top < window.innerHeight &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.right > 0
  );
}
```

## Extending the Extension

### Add Custom Translation Service
1. Modify `background.js` `translateText()` function
2. Replace LibreTranslate API call with your service
3. Update request/response format

### Add Custom OCR Language
1. Add language code to Tesseract.recognize() in `content.js`
2. Update language selector options in `popup.html`
3. Test OCR quality

### Add Custom UI Theme
1. Edit CSS variables in `style.css`
2. Modify overlay styling
3. Add new button styles

### Add Keyboard Shortcuts
```javascript
// In manifest.json
"commands": {
  "toggle-translation": {
    "suggested_key": { "default": "Ctrl+Shift+T" },
    "description": "Toggle translation"
  }
}
```

## Debugging

### Enabling Verbose Logging
Add to `content.js`:
```javascript
const DEBUG = true;
const log = (msg, data) => {
  if (DEBUG) console.log('[IMG-TRANSLATOR]', msg, data);
};
```

### Checking Extension Status
```javascript
// In browser console:
window.imageTranslator                  // Access translator instance
window.imageTranslator.isEnabled        // Check if enabled
window.imageTranslator.processedImages  // View cached images
```

### Testing Messages
```javascript
// In browser console (on page with extension):
chrome.runtime.sendMessage(
  { type: 'GET_SETTINGS' },
  (response) => console.log('Settings:', response)
);
```

## Performance Metrics

### Typical Processing Times
- Image detection: ~50ms
- OCR processing: 1-3 seconds per image
- Translation request: 200-500ms
- Overlay rendering: ~100ms

### Memory Usage
- Base extension: ~5MB
- With Tesseract loaded: ~30-50MB
- Per overlay: ~50KB

---

**For questions or clarifications, refer to the code comments in each file.**
