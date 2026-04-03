# ✅ Installation Verification Checklist

## 📋 Pre-Installation Checklist

Before you start, make sure you have:

- [ ] Chrome browser (version 88+) or Edge/Brave
- [ ] This folder (`gg`) with all files
- [ ] Administrator access to install extensions (if required)
- [ ] An internet connection

## 📂 File Checklist

Verify all files are present in the `gg` folder:

- [ ] `manifest.json` - Extension config
- [ ] `content.js` - Main logic
- [ ] `background.js` - Service worker
- [ ] `popup.html` - Popup UI
- [ ] `popup.js` - Popup logic
- [ ] `style.css` - Styling

**Documentation files** (optional but helpful):
- [ ] `README.md` - Main documentation
- [ ] `QUICKSTART.md` - Quick setup
- [ ] `INSTALLATION.md` - Detailed guide
- [ ] `TROUBLESHOOTING.md` - Common issues
- [ ] `TESTING.md` - Testing guide
- [ ] `API.md` - Developer documentation
- [ ] `PROJECT_FILES.md` - File summary

---

## 🚀 Installation Steps

### Step 1: Open Extensions Page
```
✅ Go to chrome://extensions/ in your browser
   (Copy-paste the URL to address bar)
```

### Step 2: Enable Developer Mode
```
✅ Look for "Developer mode" toggle in top-right corner
✅ Click toggle to turn ON (should show blue/enabled)
```

### Step 3: Load Extension
```
✅ You should now see "Load unpacked" button
✅ Click "Load unpacked"
✅ Navigate to this folder (`gg`)
✅ Select the folder (not individual files)
✅ Click "Select Folder"
```

### Step 4: Verify Installation
```
✅ Extension appears in extensions list
✅ Name shows: "AI Manga Image Translator"
✅ Version shows: "1.0.0"
✅ Status shows: enabled (blue toggle)
```

---

## ✅ Post-Installation Verification

### Check 1: Toolbar Icon
- [ ] Purple "T" icon visible in toolbar (top-right)
- [ ] Click icon: popup appears with "Image Translator" title
- [ ] Close popup: works without errors

### Check 2: Popup Contents
Visual verification popup has:
- [ ] "Image Translator" header
- [ ] "Enable Translator" toggle (checked)
- [ ] "Target Language" dropdown (set to "Bengali")
- [ ] "Hover Mode" toggle (unchecked)
- [ ] "Start Translation" button
- [ ] "Clear All" button
- [ ] Status message box
- [ ] "How to use:" info box

### Check 3: Test on Website
1. **Open any website** (e.g., Wikipedia, news site)
2. **Look for floating button:**
   - [ ] Purple "T" button appears in bottom-right corner
   - [ ] Button is round with white "T"
   - [ ] Button stays in bottom-right even while scrolling

3. **Click the button:**
   - [ ] Menu appears with "Start Scan" and "Clear" options
   - [ ] No JavaScript errors in console (F12 → Console)

4. **Click "Start Scan":**
   - [ ] Loading spinners appear on images
   - [ ] After 1-3 seconds: translations appear as overlays on images
   - [ ] Overlays are semi-transparent boxes with text

### Check 4: Browser Console
Open `F12 → Console` tab and verify:
- [ ] No red error messages
- [ ] See message: "ImageTranslator initialized"
- [ ] After translation: "Found X images"

### Check 5: Settings Persist
1. Change language to "Hindi"
2. Enable "Hover Mode"
3. Close popup
4. Click toolbar icon again
5. **Verify:**
   - [ ] Language still shows "Hindi"
   - [ ] "Hover Mode" still checked
   - Settings saved! ✅

---

## 🧪 Quick Functional Test

**Test 1: Basic Translation**
```
1. Visit: https://en.wikipedia.org/wiki/Manga
2. Click floating "T" button
3. Click "Start Scan"
4. Wait 3-5 seconds
5. Look for overlays on images
6. Expected: Text extracted and translated
   Status: ✅ PASS / ❌ FAIL
```

**Test 2: Language Changing**
```
1. Popup → Change to "Spanish"
2. Click "Clear All" button
3. Click "Start Scan" again
4. Expected: New translations in Spanish
   Status: ✅ PASS / ❌ FAIL
```

**Test 3: Hover Mode**
```
1. Enable "Hover Mode" in popup
2. Click "Clear All", then "Start Scan"
3. Overlays should be invisible initially
4. Hover over an image
5. Expected: Translation appears on hover
   Status: ✅ PASS / ❌ FAIL
```

**Test 4: Clear Function**
```
1. After translation, click "Clear All"
2. Expected: All overlays disappear instantly
   Status: ✅ PASS / ❌ FAIL
```

---

## 🔧 Troubleshooting Quick Fixes

### Problem: No floating button appears
**Solution:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Go to `chrome://extensions/`
3. Find extension, click reload icon
4. Refresh webpage again

### Problem: Translation not working
**Solution:**
1. Check "Enable Translator" toggle is ON
2. Check internet connection
3. Try different website
4. Open F12 → Console, look for error messages

### Problem: Overlay not visible
**Solution:**
1. Check if "Hover Mode" is enabled (only shows on hover)
2. Make sure translation completed (check status in popup)
3. Try disabling and re-enabling extension

### Problem: Settings reset after refresh
**Solution:**
1. Don't clear browser cache (clears extension storage)
2. Go to Chrome Settings → Privacy → Clear browsing data
3. Uncheck "Cookies and other site data"

For more help: See `TROUBLESHOOTING.md`

---

## 📊 Installation Status Report

Date: _______________
Browser: _______________  (e.g., Chrome, Edge, Brave)
Version: _______________
OS: _______________

### Installation Result
- [ ] ✅ Successful - Extension working perfectly
- [ ] ⚠️ Partial - Some features work
- [ ] ❌ Failed - Not working

### What Works
- [ ] Extension icon appears
- [ ] Popup opens
- [ ] Popup buttons clickable
- [ ] Floating button appears
- [ ] Translation starts
- [ ] Overlays appear
- [ ] Language switching works
- [ ] Hover mode works
- [ ] Clear function works

### Issues Found
_________________________________
_________________________________
_________________________________

### Tested On
- [ ] English website
- [ ] Non-English website  
- [ ] Different website types

### Overall Rating
Rating: _____ / 10

---

## 📞 Support

### If Installation Fails:

1. **Check all 6 files present**: manifest.json, content.js, background.js, popup.html, popup.js, style.css

2. **Verify manifest.json format**:
   - Copy contents to: https://jsonlint.com/
   - Should show "Valid JSON"

3. **Check browser console** (F12):
   - Look for specific error messages
   - Screenshot errors if available

4. **Try clean reinstall**:
   - Go to `chrome://extensions/`
   - Remove extension (trash icon)
   - Clear browser cache: `Ctrl+Shift+Delete`
   - Reload unpacked extension

5. **Check browser version**:
   - Must be Chrome 88+ or Edge 88+
   - Check version: Menu → About [Browser]

### If Extension Loads But Doesn't Work:

1. See `TROUBLESHOOTING.md` file
2. Check `TESTING.md` for expected behavior
3. Open `F12 → Console` and look for error details

---

## ✨ You're Ready!

Once you see ✅ in all boxes above, you're ready to use the extension!

### Next Steps:
1. Visit a website with images
2. Click the purple "T" button
3. Select "Start Scan"
4. Wait for translations to appear
5. Enjoy! 🎉

### For More Information:
- **Quick help**: See `QUICKSTART.md`
- **Full guide**: Read `README.md`
- **Issues**: Check `TROUBLESHOOTING.md`
- **Testing**: See `TESTING.md`
- **Development**: See `API.md`

---

## 📋 Final Checklist

Before you consider installation complete:

- [ ] Extension appears in `chrome://extensions/`
- [ ] Toolbar icon visible in top-right
- [ ] Popup opens without errors
- [ ] All popup controls visible
- [ ] Floating button appears on websites
- [ ] Translation processes images
- [ ] Overlays appear on images
- [ ] Settings persist after reload
- [ ] No red errors in console (F12)
- [ ] At least one full test on a website successful

**Installation Status**: ✅ COMPLETE / ❌ INCOMPLETE

---

**Congratulations! 🎉 You've successfully installed AI Manga Image Translator!**

Now visit any website with images and start translating!
