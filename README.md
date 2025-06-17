# Test ID Visualizer Chrome Extension

A Chrome extension that helps developers visualize `data-testid` attributes on web pages by displaying overlays.

## Features

- 🧪 Toggle overlays to show/hide data-testid attributes
- 📋 Different colors for form elements (blue) vs other elements (red)
- 🎯 Count display of total elements with data-testid attributes
- 💾 Remembers state per tab

## Development

### Building the Extension

```bash
# Install dependencies
npm install

# Build the extension for production
npm run build:extension

# Build in development mode
npm run build:dev
```

### Loading in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `dist/` folder from this project
5. The extension will appear in your extensions bar

### Development Workflow

1. Make changes to `popup.html`, `popup.js`, or `content.js`
2. Run `npm run build:extension`
3. Go to `chrome://extensions/` and click the refresh button on your extension
4. Test the extension on any webpage

## Releases

### Creating a Release

Releases are automated via GitHub Actions. To create a new release:

1. **Tag a new version:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Or create a release on GitHub:**
   - Go to the "Releases" page in your GitHub repository
   - Click "Create a new release"
   - Choose or create a tag (e.g., `v1.0.0`)
   - Fill in the release title and description
   - Click "Publish release"

3. **Automatic build:**
   - GitHub Actions will automatically build the extension
   - A `testid-visualizer-extension.zip` file will be attached to the release
   - This zip file can be uploaded directly to the Chrome Web Store

### CI/CD

The project includes two GitHub Actions workflows:

- **CI** (`.github/workflows/ci.yml`): Runs on every push/PR to build and verify the extension
- **Release** (`.github/workflows/release.yml`): Runs on release creation to build and attach the extension zip

## Extension Structure

- `manifest.json` - Extension configuration
- `popup.html` - Extension popup UI
- `popup.js` - Popup logic and Chrome API interactions
- `content.js` - Content script that creates overlays on web pages
- `icons/` - Extension icons
- `dist/` - Built extension files (generated)

## Usage

1. Click the extension icon in your Chrome toolbar
2. Toggle the switch to ON to show data-testid overlays
3. Toggle OFF to hide overlays
4. The extension shows a count of found elements

## Colors

- 🔵 **Blue overlays**: Form elements (`<form>` tags)
- 🔴 **Red overlays**: All other elements with data-testid

## How It Works

The extension injects a content script into all web pages that:
1. Searches for elements with `data-testid` attributes
2. Creates overlay elements showing the testid values
3. Positions overlays appropriately (inline for forms, absolute for others)
4. Manages overlay state per tab using Chrome storage API
