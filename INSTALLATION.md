# AI Manga Image Translator - Chrome Extension

A production-ready Chrome Extension (Manifest V3) that detects text in images and translates it to Bengali (and other languages) using OCR and AI.

## Features

✨ **Core Features:**
- Detects all images on any webpage
- Extracts text using OCR (Tesseract.js with Japanese & English support)
- Translates extracted text to Bengali, Hindi, Tamil, and more
- Uses LibreTranslate API (free, no API key required)
- Overlays translated text on top of images
- Maintains approximate position of text using bounding boxes

🎨 **UI Features:**
- Floating control button with menu
- One-click translation scanning
- Loading indicators for processing images
- Clean, styled overlay boxes (rounded, semi-transparent)
- Toggle ON/OFF translation
- Hover mode (show translation only on hover)
- Language selector for multiple target languages

⚡ **Performance:**
- Lazy image processing (one by one)
- Skips small images/icons (configurable minimum size)
- Avoids re-processing same image twice
- Proper async/await implementation

## Installation

### Step-by-Step Guide:

1. **Extract Files**
   - Unzip the extension folder to any location on your computer

2. **Open Chrome Extensions Page**
   - Go to `chrome://extensions/` in your Chrome browser
   - Or use the menu: ⋮ → More tools → Extensions

3. **Enable Developer Mode**
   - Click the **"Developer mode"** toggle in the top-right corner

4. **Load Unpacked Extension**
   - Click **"Load unpacked"** button
   - Navigate to the extension folder you extracted
   - Select the folder containing `manifest.json`
   - Click **"Select Folder"**

5. **Extension Installed!**
   - You should see "AI Manga Image Translator" in your extensions list
   - A purple "T" button should appear in your Chrome toolbar
   - The floating "T" button will appear on webpages

### Verify Installation:

- You should see the extension icon (purple "T") in the top-right corner
- A floating "T" button appears on any webpage
- Popup opens when you click the toolbar icon

## How to Use

### Basic Usage:

1. **Open any webpage** with images (manga sites, comics, etc.)

2. **Click the floating "T" button** in the bottom-right corner

3. **Select "Start Scan"** from the menu
   - The extension scans for images on the page
   - Loading spinners appear on processing images
   - Translations overlay on images automatically

4. **View translations** by hovering or directly (depending on hover mode setting)

5. **Click "Clear"** to remove all translations

### Using the Popup Menu:

- **Enable Translator**: Toggle extension on/off
- **Target Language**: Select which language to translate to (Bengali, Hindi, Tamil, etc.)
- **Hover Mode**: Show translations only on hover (useful for clean viewing)
- **Start Translation**: Begin scanning and translating images
- **Clear All**: Remove all translation overlays

## Files Structure

```
AI-Manga-Image-Translator/
├── manifest.json          # Extension configuration (Manifest V3)
├── content.js             # Main script injected into webpages
├── background.js          # Service worker for background tasks
├── popup.html             # Popup UI
├── popup.js               # Popup logic and settings
├── style.css              # All styling (popup, overlays, buttons)
└── README.md              # This file
```

## Configuration

### Minimum Image Size
By default, images smaller than 50x50px are skipped. Modify in `content.js`:
```javascript
this.minImageSize = 50; // change this value
```

### Target Language Options:
- `bn` - Bengali (বাংলা)
- `hi` - Hindi (हिंदी)
- `ta` - Tamil (தமிழ்)
- `te` - Telugu (తెలుగు)
- `es` - Spanish (Español)
- `fr` - French (Français)
- `de` - German (Deutsch)
- `pt` - Portuguese (Português)
- `zh` - Chinese (中文)
- `ko` - Korean (한국어)

## Technical Details

### Technologies Used:
- **Manifest V3** - Latest Chrome Extension format
- **Tesseract.js** - OCR with Japanese & English support
- **LibreTranslate API** - Free translation service
- **Canvas API** - For text rendering and overlay
- **Chrome Storage API** - For settings persistence
- **Chrome Messaging API** - For script communication

### How It Works:

1. **Content Script** injects floating button and detects images
2. **Tesseract.js** performs OCR on each image
3. **Background Service Worker** calls LibreTranslate API
4. **Canvas-based Overlay** displays translated text on original images
5. **Hover Mode** optionally shows/hides translations

## Supported Image Types

- Regular `<img>` elements
- Images with CSS backgrounds (limited support)
- Most image formats (JPEG, PNG, WebP, GIF)
- Data URLs and Blob URLs
- Images on secure HTTPS pages

## Limitations

- Very small text in images may not OCR correctly
- Heavily stylized fonts may reduce accuracy
- Requires internet connection for translation
- LibreTranslate API has rate limits (fair usage)
- Some websites may block extension access

## Troubleshooting

### Extension doesn't appear in toolbar:
- Check if installed correctly
- Refresh the page (Ctrl+R or Cmd+R)
- Reload extension from `chrome://extensions/`

### Translation isn't working:
- Ensure extension is enabled in popup
- Check internet connection
- Try refreshing the webpage
- Check browser console for errors (F12)

### OCR returns no text:
- Image may be too small or blurry
- Text might be embedded in image graphics
- Language detection may not match
- Try increasing contrast in image

### Overlay positioning is off:
- Can be caused by CSS transforms on page
- Try adjusting CSS in content.js

## Performance Tips

- Process images one at a time (lazy loading built-in)
- Disable for pages with thousands of images
- Use Hover Mode for cleaner interface
- Clear translations when switching pages

## Privacy & Security

- All OCR processing uses Tesseract.js (local, no data sent)
- Translations use LibreTranslate API (open source, privacy-focused)
- No data stored on external servers
- No tracking or analytics
- Extension works offline except for translation

## Browser Compatibility

- **Chrome**: 88+ (Manifest V3 support)
- **Edge**: 88+ (Based on Chromium)
- **Brave**: 1.3.1+ (Manifest V3 support)

## Known Issues

- Transparent PNG overlays may have rendering artifacts on certain pages
- Some JavaScript-heavy sites may conflict with injection
- Text overflow handling may hide long translations
- Language auto-detection not 100% accurate

## Future Improvements

- Add context menu options
- Support for video text (burned-in subtitles)
- Better bounding box accuracy
- Offline translation (using local models)
- Batch processing optimization
- Custom CSS theming

## Support

For issues or feature requests:
1. Check browser console (F12) for errors
2. Verify all files are present
3. Try reloading the extension
4. Check manifest.json format

## License

This project is provided as-is for educational and personal use.

## Version History

- **v1.0.0** (2024) - Initial release
  - Full Manifest V3 implementation
  - Tesseract.js OCR support
  - LibreTranslate integration
  - Multi-language support
  - Hover mode
  - Settings persistence

---

**Made with ❤️ for manga and image text lovers everywhere.**
