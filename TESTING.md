# Testing & Verification Guide

## Pre-Installation Checklist

- [ ] Chrome/Edge/Brave browser version 88+
- [ ] All 6 required files present (manifest.json, content.js, background.js, popup.html, popup.js, style.css)
- [ ] File permissions set correctly
- [ ] Developer mode can be enabled

## Installation Verification

### Step 1: Load Extension
1. Go to `chrome://extensions/`
2. Enable **Developer mode** toggle
3. Click **Load unpacked**
4. Select the extension folder
5. **Expected Result**: Extension appears in list with ID and status

### Step 2: Check Toolbar Icon
- ✅ Purple "T" icon visible in top-right toolbar
- ✅ Clicking icon opens popup without errors
- ✅ Popup shows "Image Translator" title

### Step 3: Verify Files Loaded
Open browser console (F12) → Console tab:
```javascript
// Should not show any 404 errors for manifest, scripts, or styles
// Look for: "ImageTranslator initialized" message
```

## Popup Functionality Testing

### Test 1: Popup Opens
1. Click toolbar icon
2. **Expected**: Popup window appears with:
   - [ ] "Image Translator" title
   - [ ] Enable toggle (checked by default)
   - [ ] Language selector (set to Bengali)
   - [ ] Hover mode toggle
   - [ ] Start Translation button
   - [ ] Clear All button
   - [ ] Status box
   - [ ] Info box with instructions

### Test 2: Settings Persist
1. Change language to "Hindi"
2. Enable Hover Mode
3. Close and reopen popup
4. **Expected**: Settings still show Hindi and Hover Mode enabled

### Test 3: Toggle Enable/Disable
1. Uncheck "Enable Translator"
2. Click "Start Translation"
3. **Expected**: Alert or message saying translator is disabled
4. Check Enable again
5. **Expected**: "Start Translation" now works

## Floating Button Testing

### Test 1: Button Appears
1. Visit any webpage with images (e.g., `example.com`)
2. **Expected**: Purple button "T" appears in bottom-right corner

### Test 2: Menu Opens
1. Click the purple "T" button
2. **Expected**: Menu appears with "Start Scan" and "Clear" options

### Test 3: Menu Closes
1. Click outside the menu
2. **Expected**: Menu closes smoothly

## Translation Testing

### Test 1: Start Translation
**On a page with Japanese text images:**
1. Click floating "T" button
2. Select "Start Scan"
3. **Expected**:
   - [ ] Loading spinners appear over images
   - [ ] Text overlays appear after 1-3 seconds
   - [ ] Status updates in popup

### Test 2: Text Extraction
1. Use a page with clear, readable text
2. Check overlay for extracted text
3. **Expected**: Text correctly extracted and visible in overlay

### Test 3: Translation Quality
1. Note original Japanese text
2. Check Bengali translation
3. **Expected**: Reasonable translation (may not be perfect)

### Test 4: Language Switching
1. Change target language to Spanish
2. Click "Clear All"
3. Click "Start Translation" again
4. **Expected**: Translations now in Spanish, not Bengali

### Test 5: Hover Mode
1. Enable Hover Mode in popup
2. Start translation
3. Overlays should be invisible
4. Hover over image
5. **Expected**: Translation appears on hover, disappears on mouse leave

## Performance Testing

### Test 1: Multiple Images
1. Visit a page with 10+ images
2. Click "Start Scan"
3. Monitor processing in F12 Console
4. **Expected**: 
   - [ ] No browser lag
   - [ ] Images process one-by-one
   - [ ] All images eventually process

### Test 2: Small Images Skipped
1. Visit page with many small icons
2. Click "Start Scan"
3. **Expected**: Small images (<50x50) are skipped (no spinner)

### Test 3: No Reprocessing
1. Run translation on page
2. Click "Start Scan" again
3. **Expected**: Same images not reprocessed (no new spinners)

### Test 4: Clear & Restart
1. After translation, click "Clear All"
2. **Expected**: All overlays removed instantly
3. Click "Start Scan" again
4. **Expected**: Translation restarts from scratch

## Overlay Testing

### Test 1: Positioning
1. Check overlay position on image
2. **Expected**: Overlay centered or positioned near text

### Test 2: Readability
1. Check overlay styling
2. **Expected**:
   - [ ] Semi-transparent background
   - [ ] Rounded corners
   - [ ] Text is readable
   - [ ] Original text visible
   - [ ] Translated text visible

### Test 3: Z-index
1. Interact with page elements behind overlay
2. **Expected**: Overlay stays on top, doesn't interfere with clicking

### Test 4: Responsive Layout
1. Resize browser window
2. Overlays should reposition
3. **Expected**: Overlays stay with images

## Error Handling Tests

### Test 1: No Internet
1. Disconnect internet
2. Click "Start Scan"
3. **Expected**: OCR may work (local), translation fails gracefully
4. Original text still shows

### Test 2: Invalid Image URL
1. On page with broken image links
2. Click "Start Scan"
3. **Expected**: Skips broken images without crashing

### Test 3: No Text in Image
1. On page with solid-color images
2. Click "Start Scan"
3. **Expected**: No overlay created, processes continue

### Test 4: Very Large Image
1. On page with 4000x4000px image
2. Click "Start Scan"
3. **Expected**: Still processes (may take longer)

## Browser Console Check

Open F12 → Console tab and verify:

### No Errors
```
✅ No red error messages
✅ No "failed to load" messages
✅ No permission warnings
```

### Expected Messages
```
✅ "ImageTranslator initialized"
✅ "Tesseract.js loaded" (first use)
✅ "Found X images"
✅ "Translation complete"
```

### Debug logging
```javascript
// In console, these should work:
window.imageTranslator.isEnabled        // true
window.imageTranslator.targetLanguage   // 'bn'
window.imageTranslator.processedImages  // Map of processed images
```

## Message Passing Tests

In browser console (F12 → Console):

### Test 1: Get Settings
```javascript
chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, 
  response => console.log('Settings:', response)
);
// Expected: { translationEnabled: true, targetLanguage: 'bn', ... }
```

### Test 2: Start Translation
```javascript
chrome.runtime.sendMessage({ type: 'START_TRANSLATION' }, 
  response => console.log('Translation:', response)
);
// Expected: { success: true }
```

### Test 3: Clear Translations
```javascript
chrome.runtime.sendMessage({ type: 'CLEAR_TRANSLATIONS' }, 
  response => console.log('Cleared:', response)
);
// Expected: { success: true }
```

## Multi-Page Testing

### Test 1: Different Websites
Test on multiple sites:
- [ ] News websites
- [ ] Social media (Instagram, Twitter, etc.)
- [ ] Manga/Comic sites
- [ ] Forums
- [ ] Document sharing sites

### Test 2: Page Navigation
1. Translate on Page A
2. Navigate to Page B
3. Click "Start Scan"
4. **Expected**: Works independently on each page

### Test 3: Multiple Tabs
1. Open extension on Tab 1
2. Open extension on Tab 2
3. Start translation on Tab 1
4. Start translation on Tab 2
5. **Expected**: Each tab works independently

## Performance Benchmarks

Document your test results:

```
Test Environment:
- Browser: Chrome XX
- OS: Windows/Mac/Linux
- RAM: X GB
- CPU: Model

Results:
- Popup load time: ___ ms
- Image detection: ___ ms
- First OCR: ___ seconds
- Translation request: ___ ms
- Total page scan (10 images): ___ seconds
- Memory after: ___ MB
```

## Stress Testing

### Test 1: Rapid Clicking
1. Click "Start Scan" multiple times rapidly
2. **Expected**: Extension handles gracefully (may queue or ignore duplicate)

### Test 2: Large Page
1. Visit page with 100+ images
2. Click "Start Scan"
3. **Expected**: Processes without hanging, background priority

### Test 3: Extreme Sizes
1. Test with very large image (10000x10000px)
2. Test with very small image (1px)
3. **Expected**: Both handled correctly

## Language Testing

Test translation quality for each language:

```
Language: Bengali (বাংলা)
Test Text: "Hello, how are you?"
Expected Translation: [Bengali text]
Actual Translation: [What you got]
Quality: Excellent / Good / Fair / Poor
Notes: ...
```

Repeat for: Hindi, Tamil, Telugu, Spanish, French, German, Portuguese, Chinese, Korean

## Cleanup & Uninstall Check

### Test 1: Reload Extension
1. Go to `chrome://extensions/`
2. Click reload icon
3. **Expected**: Extension reloads without errors

### Test 2: Disable/Enable
1. Toggle extension off
2. Visit webpage
3. **Expected**: No button appears, no errors
4. Toggle extension on
5. **Expected**: Button reappears

### Test 3: Uninstall
1. Click trash icon on extension
2. Confirm removal
3. Visit webpage
4. **Expected**: No button, no errors, clean

## Accessibility Testing

### Test 1: Keyboard Navigation
1. Tab through popup controls
2. **Expected**: Can reach all buttons with Tab key

### Test 2: Screen Reader
1. Use screen reader on popup
2. **Expected**: Labels properly associated

### Test 3: Font Size
1. Test popup at different zoom levels
2. **Expected**: Text readable at 75% and 200%

## Test Report Template

```markdown
## Extension Test Report

**Date**: [Date]
**Tester**: [Name]
**Browser**: [Browser & Version]
**OS**: [Operating System]

### Installation
- [ ] Loaded successfully
- [ ] Icon appears in toolbar
- [ ] No console errors

### Functionality
- [ ] Popup opens correctly
- [ ] Settings persist
- [ ] Translation starts
- [ ] Overlays appear
- [ ] Clear works

### Tested Languages
- [ ] Bengali
- [ ] Hindi
- [ ] Spanish
- [ ] [Other]

### Issues Found
1. [Issue description]
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Severity: Critical / Major / Minor

### Performance
- Popup load: ___ ms
- Image detection: ___ ms
- OCR time: ___ seconds
- Overall satisfaction: ___ / 10

### Notes
[Any additional observations]
```

## Checklist Summary

Before considering testing complete:

- [ ] Installation verified
- [ ] Popup fully functional
- [ ] Floating button works
- [ ] Translation processes complete
- [ ] Overlays display correctly
- [ ] Settings persist
- [ ] Hover mode works
- [ ] Language switching works
- [ ] Clear function works
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Error handling graceful
- [ ] Multi-page/multi-tab working
- [ ] All languages tested

**Status**: ✅ READY FOR USE / ⚠️ ISSUES FOUND / ❌ NOT READY

---

Report any issues with:
- Browser version
- Steps to reproduce
- Console output (F12)
- Expected vs actual behavior
