
# Test ID Visualizer Chrome Extension

A Chrome extension that helps developers visualize `data-testid` attributes on web pages by overlaying them with color-coded badges.

## Features

- **Toggle Visualization**: Easy on/off toggle via popup interface
- **Color-Coded Overlays**: Blue badges for form elements, red badges for other elements  
- **Element Count**: Shows total number of elements with data-testid attributes
- **Clean Design**: Modern gradient UI with smooth animations
- **Per-Tab State**: Remembers toggle state for each browser tab

## Installation

### From Source
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension icon will appear in your browser toolbar

### Usage
1. Navigate to any webpage with `data-testid` attributes
2. Click the Test ID Visualizer icon in your browser toolbar
3. Toggle the switch to show/hide the overlays
4. View color-coded badges overlaying elements:
   - 🔵 Blue badges for form elements (`<form>` tags)
   - 🔴 Red badges for all other elements

## Technical Details

The extension consists of:
- **Manifest V3** configuration for modern Chrome extensions
- **Content Script** that injects the visualization script
- **Popup Interface** for user interaction and state management
- **Chrome Storage API** for persisting toggle state per tab

## Development

To modify the extension:
1. Edit the relevant files (`popup.html`, `popup.js`, `content.js`)
2. Reload the extension in `chrome://extensions/`
3. Test on web pages with `data-testid` attributes

## Script Functionality

The core visualization script:
- Finds all elements with `data-testid` attributes
- Creates overlay badges showing the test ID value
- Positions overlays appropriately (absolute for most elements, inline for forms)
- Uses color coding to distinguish element types
- Handles cleanup when toggled off

Perfect for developers working with test automation frameworks like Cypress, Playwright, or Testing Library!
