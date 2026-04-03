# Troubleshooting Guide

## Common Issues & Solutions

---

## 🔴 Extension Won't Load

### Issue: "Extension failed to load" error

**Causes & Solutions:**

1. **Manifest.json not found**
   - ✅ Check file exists in root folder
   - ✅ Verify filename is exactly `manifest.json`
   - ✅ Check for typos in file name

2. **Invalid JSON in manifest.json**
   - ✅ Open manifest.json in VS Code
   - ✅ Check for missing commas or quotes
   - ✅ Use JSON validator: `jsonlint.com`
   - ✅ Common error: trailing comma in objects

3. **Wrong folder selected**
   - ✅ Select folder containing all files
   - ✅ NOT the parent/grandparent folder
   - ✅ Should see files immediately when opened

4. **Permission issues**
   - ✅ Check folder permissions (should be readable)
   - ✅ Try moving to different location (Desktop, Documents)
   - ✅ On Mac: Check System Preferences → Security & Privacy

**Fix:**
```bash
# Verify manifest.json is valid JSON
cat manifest.json | python -m json.tool > /dev/null && echo "Valid" || echo "Invalid"
```

---

## 🔴 Extension Appears, But No Button Shows

### Issue: No floating "T" button on websites

**Causes & Solutions:**

1. **Content script not injected**
   - ✅ Refresh page: `Ctrl+R` or `Cmd+R`
   - ✅ Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`
   - ✅ Check browser console: Press `F12` → Console tab

2. **Extension disabled**
   - ✅ Go to `chrome://extensions/`
   - ✅ Verify extension toggle is ON (should be blue)
   - ✅ Reload extension: Click reload icon

3. **Website blocks extension**
   - ✅ Try different website (e.g., Wikipedia)
   - ✅ Some sites have strict Content Security Policy (CSP)
   - ✅ Can't fix, but extension works on most sites

4. **CSS not loaded**
   - ✅ Check browser console for errors
   - ✅ Look for any red error messages
   - ✅ If CSS error, verify style.css exists

**Fix Steps:**
```
1. Open chrome://extensions/
2. Find "AI Manga Image Translator"
3. Click "Remove"
4. Clear browser cache: Ctrl+Shift+Delete
5. Reload unpacked extension again
6. Refresh webpage
```

---

## 🔴 Popup Doesn't Open

### Issue: Extension icon exists but popup won't open

**Causes & Solutions:**

1. **popup.html file missing or wrong**
   - ✅ Check file exists: `popup.html`
   - ✅ Verify path in manifest.json: `"default_popup": "popup.html"`
   - ✅ Check file is readable

2. **popup.js has errors**
   - ✅ Open popup while inspecting: right-click → Inspect
   - ✅ Look at Console tab for errors
   - ✅ If red errors, fix the corresponding code

3. **style.css not loaded in popup**
   - ✅ Verify `<link rel="stylesheet" href="style.css">` in popup.html
   - ✅ Check style.css exists and is readable

**Fix:**
```javascript
// In browser console on popup:
// Should see no errors and popup should appear
```

**Debug popup:**
1. Right-click extension icon
2. Select "Inspect popup"
3. Check Console tab for errors
4. Check Network tab to see if files load

---

## 🔴 Translation Not Working

### Issue: Nothing happens when clicking "Start Translation"

**Causes & Solutions:**

1. **Extension disabled in popup**
   - ✅ Check "Enable Translator" toggle is checked
   - ✅ Turn it on and try again

2. **No internet connection**
   - ✅ Check internet: Open `google.com`
   - ✅ Translation requires internet for LibreTranslate API
   - ✅ OCR (Tesseract) works offline

3. **Content script error**
   - ✅ Open `F12` → Console tab
   - ✅ Look for red errors
   - ✅ Should see "ImageTranslator initialized" message

4. **background.js issues**
   - ✅ Go to `chrome://extensions/`
   - ✅ Click extension details
   - ✅ Check "Errors" section
   - ✅ Look for service worker status

5. **LibreTranslate API down**
   - ✅ Test API manually: Go to `https://libretranslate.de/translate`
   - ✅ If not accessible, API is down (temporary)
   - ✅ Wait and retry

**Debug:**
```javascript
// In browser console on page with extension:
window.imageTranslator.isEnabled              // Should be true
chrome.runtime.sendMessage(
  { type: 'TRANSLATE_TEXT', text: 'hello', targetLanguage: 'bn' },
  response => console.log('Translation:', response)
);
```

---

## 🔴 OCR Not Working (No Text Extracted)

### Issue: Tesseract recognizes no text

**Causes & Solutions:**

1. **Image is too small**
   - ✅ Minimum size is 50x50 pixels
   - ✅ Check image dimensions in inspector
   - ✅ Edit `content.js` line ~58 to lower `minImageSize`

2. **Image text is blurry or low resolution**
   - ✅ OCR works best with clear, high-contrast text
   - ✅ Very small fonts (<8px) may not work
   - ✅ Heavily compressed JPEGs may fail

3. **Text is in stylized/decorative font**
   - ✅ Tesseract struggles with calligraphy/art fonts
   - ✅ Try with normal, clear fonts first to test

4. **Tesseract not loaded**
   - ✅ Check console: Should see "Tesseract.js loaded"
   - ✅ First load takes ~2-3 seconds
   - ✅ Check internet connection (loads from CDN)

5. **Language mismatch**
   - ✅ If English page has Japanese image, set to Japanese
   - ✅ Current OCR uses: Japanese (jpn) + English (eng)
   - ✅ Other languages need code update

**Test OCR directly:**
```javascript
// In console on webpage with extension:
await window.imageTranslator.performOCR(document.querySelector('img'));
```

**Fix Low-Quality OCR:**
```javascript
// In content.js, lower minimum image size:
this.minImageSize = 30;  // was 50, try lower value

// Add manual Tesseract config (in performOCR):
const { data } = await Tesseract.recognize(
  imgElement,
  ['jpn', 'eng'],
  {
    'tessedit_char_whitelist': '0123456789あいうえおかきくこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'
  }
);
```

---

## 🔴 Translation Quality Poor

### Issue: Translations are incorrect or nonsensical

**Causes & Solutions:**

1. **Poor OCR extraction**
   - ✅ Verify original text is correct (check popup status)
   - ✅ If original text wrong, fix OCR first
   - ✅ Better image quality = better OCR

2. **Language auto-detection wrong**
   - ✅ LibreTranslate auto-detects source language
   - ✅ If wrong language detected, translation fails
   - ✅ Can't change source in current version

3. **Bengali translation not available**
   - ✅ Bengali (bn) is supported by LibreTranslate
   - ✅ Try simpler sentences to test
   - ✅ Some technical terms may not translate well

4. **LibreTranslate API version**
   - ✅ Using `libretranslate.de` public API
   - ✅ May have rate limits or accuracy variations
   - ✅ Consider self-hosted LibreTranslate for better control

**Improve Translation:**
```javascript
// Edit content.js - translateAndOverlay function:
// Add text preprocessing:
let cleanedText = extractedText
  .replace(/\n\n+/g, '\n')  // Remove extra newlines
  .trim();

// Send for translation
```

**Alternative: Self-Hosted LibreTranslate**
```javascript
// In background.js, change API endpoint:
const response = await fetch('http://localhost:5000/translate', {
  method: 'POST',
  // ... rest of code
});
```

---

## 🔴 Performance Issues

### Issue: Browser slow/freezing during translation

**Causes & Solutions:**

1. **Too many images on page**
   - ✅ Page with 100+ images = longer processing
   - ✅ Images process one-by-one by design
   - ✅ Close unused tabs to free memory

2. **Tesseract using too much memory**
   - ✅ Tesseract.js can use 30-50MB RAM
   - ✅ This is normal for OCR engine
   - ✅ Wait for processing to complete

3. **Network requests backing up**
   - ✅ Too many images = many translation requests
   - ✅ Requests are sequential, not parallel (by design)
   - ✅ Normal: 1-3 requests/second

4. **Browser cache full**
   - ✅ Clear browser cache: `Ctrl+Shift+Delete`
   - ✅ Check disk space (at least 1GB free)
   - ✅ Close other applications

**Optimize Performance:**

1. **Skip small images:**
   ```javascript
   // In content.js, increase minimum size:
   this.minImageSize = 100;  // was 50
   ```

2. **Enable hover mode:**
   - ✅ Hover mode skips rendering for most images
   - ✅ Only renders when you hover

3. **Process fewer images:**
   ```javascript
   // In content.js - detectImages():
   const maxImages = 10;  // Limit to 10 images
   return images.slice(0, maxImages);
   ```

4. **Disable on heavy websites:**
   - ✅ Use popup to disable, re-enable on light pages

---

## 🔴 Overlay Not Appearing

### Issue: Translation processes but no overlay shows

**Causes & Solutions:**

1. **Hover mode enabled**
   - ✅ Check popup: Is "Hover Mode" ON?
   - ✅ If yes, overlay only shows on hover
   - ✅ Hover over image to see overlay

2. **z-index issues (overlay behind content)**
   - ✅ Some pages have elements with high z-index
   - ✅ Edit style.css: increase overlay z-index
   - ✅ Change `.img-translator-overlay` z-index to `99999`

3. **CSS not loading**
   - ✅ Check browser console for CSS errors
   - ✅ Try: Inspector → right-click on overlay → Inspect
   - ✅ Should see CSS classes applied

4. **Overlay positioned off-screen**
   - ✅ May happen with CSS transforms on page
   - ✅ Open Inspector (F12), find overlay div
   - ✅ Check `position`, `top`, `left` values

**Fix:**
```css
/* In style.css, increase z-index */
.img-translator-overlay {
  z-index: 99999 !important;  /* was 9999 */
}
```

---

## 🔴 Settings Not Saving

### Issue: Language/settings reset after refresh

**Causes & Solutions:**

1. **Storage permission issue**
   - ✅ Check manifest.json has `"storage"` permission
   - ✅ Some browsers may block storage
   - ✅ Try private/incognito mode (separate storage)

2. **Browser cache clearing**
   - ✅ If you clear browser data, extension storage clears too
   - ✅ In Settings → Privacy: Don't select "Cookies and other site data"

3. **Storage API not working**
   - ✅ Check console: `chrome.storage.local.set()` should work
   - ✅ Try: `chrome.storage.local.get(null, r => console.log(r))`

**Debug Storage:**
```javascript
// In browser console:
chrome.storage.local.set({ testKey: 'testValue' }, () => {
  chrome.storage.local.get('testKey', r => console.log('Stored:', r));
});
```

**Fix:**
```javascript
// Ensure getting/setting properly in popup.js
chrome.storage.local.get(
  ['translationEnabled', 'targetLanguage'],
  (data) => {
    if (chrome.runtime.lastError) {
      console.error('Storage error:', chrome.runtime.lastError);
    }
    // Handle data
  }
);
```

---

## 🔴 Console Errors

### Common Console Errors & Fixes

**Error: "Cannot read property 'x' of undefined"**
```javascript
// Add null checks:
if (data && data.translatedText) {
  use(data.translatedText);
}
```

**Error: "Failed to load Tesseract.js"**
```javascript
// Check CDN availability:
// Go to: https://cdn.jsdelivr.net/npm/tesseract.js@5
// If unavailable, use alternative CDN
```

**Error: "CORS error with LibreTranslate"**
```javascript
// This is expected - LibreTranslate handles it
// Check error details, might be network timeout
```

**Error: "Extension context invalidated"**
- Reload extension from chrome://extensions/
- Refresh webpage

**Error: "Content script not loaded"**
- Hard refresh: Ctrl+Shift+R
- Reload extension

---

## ✅ Quick Fix Checklist

Try these in order:

1. **Hard refresh page**: `Ctrl+Shift+R`
2. **Reload extension**: `chrome://extensions/` → reload icon
3. **Check console**: `F12` → Console tab → look for red errors
4. **Disable/enable**: Toggle off, toggle on
5. **Remove and re-add**: Remove extension, reload unpacked
6. **Restart browser**: Close and reopen Chrome
7. **Restart computer**: Sometimes helps with resource issues

---

## 📊 Diagnostic Report

If issues persist, collect this information:

```
System Info:
- OS: macOS / Windows / Linux
- Browser: Chrome / Edge / Brave (version)
- RAM: ___ GB
- Disk space free: ___ GB

Extension Info:
- Installation: Fresh / After update
- Extension ID: _______________
- Version shown in extensions: ___

Issue Info:
- Occurs on all sites / specific sites: _______
- Reproducible: Always / Sometimes / Never
- First time issue / worked before: ___

Console Output:
[Paste any red errors here]

Steps to reproduce:
1. ___
2. ___
3. ___

Expected behavior:
___

Actual behavior:
___

Attempted fixes:
- [ ] Hard refresh
- [ ] Reload extension
- [ ] Restarted browser
- [ ] Checked console
- [ ] Other: ___
```

---

## 📞 Getting Help

1. Check this troubleshooting guide
2. Check browser console for specific errors
3. Check TESTING.md for expected behavior
4. Review code comments in files
5. Check manifest.json is loaded correctly

---

## 📝 Reporting Issues

Include:
- ✅ Browser version
- ✅ Website URL where issue occurs
- ✅ Console errors (F12 → Console)
- ✅ Steps to reproduce
- ✅ Expected vs actual behavior
- ✅ Screenshots if helpful
- ✅ What you already tried

---

**Most issues are solved by: Hard refresh + Reload extension + Check console**

Good luck! 🍀
