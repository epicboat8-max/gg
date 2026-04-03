# Quick Start Guide

## 30-Second Installation

1. **Go to**: `chrome://extensions/`
2. **Enable**: "Developer mode" (top-right toggle)
3. **Click**: "Load unpacked"
4. **Select**: This folder (the one with `manifest.json`)
5. **Done!** 🎉

## First Use

1. **Open any website** with images
2. **Click the purple "T"** button (floating, bottom-right)
3. **Click "Start Scan"**
4. **See translations!** ✨

## Settings

- **Language**: Change target language in popup
- **Hover Mode**: Toggle to show translations only on hover
- **Clear**: Remove all translations with one click

## Tips

- Works best on manga/comic sites
- Supports Japanese + English OCR
- Translates to Bengali by default
- Internet needed for translation (OCR works offline)

## Issues?

- Refresh page: `Ctrl+R` (Windows) or `Cmd+R` (Mac)
- Reload extension: Go to `chrome://extensions/` and click reload icon
- Check console: Press `F12`, click Console tab

## File Structure

```
manifest.json       ← Extension config
content.js          ← Main logic
background.js       ← Background service
popup.html          ← UI window
popup.js            ← UI controls
style.css           ← All styles
```

Done! Enjoy translating! 🌍
