
// Track overlay state
let overlaysActive = false;
let overlayElements = [];

// Clean up function
function removeOverlays() {
  overlayElements.forEach(overlay => {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  });
  overlayElements = [];
  
  // Reset any modified position styles
  document.querySelectorAll('[data-testid]').forEach(el => {
    if (el.dataset.originalPosition) {
      el.style.position = el.dataset.originalPosition;
      delete el.dataset.originalPosition;
    }
  });
  
  overlaysActive = false;
}

// Create overlays function
function createOverlays() {
  if (overlaysActive) {
    removeOverlays();
  }

  const elements = document.querySelectorAll('[data-testid]');

  elements.forEach((el) => {
    const testId = el.getAttribute('data-testid');
    const isForm = el.tagName.toLowerCase() === 'form';

    const overlay = document.createElement('div');
    overlay.textContent = `🧪 ${testId}`;
    overlay.className = 'testid-overlay';

    const baseStyle = {
      color: 'white',
      fontSize: '10px',
      padding: '2px 4px',
      zIndex: '9999',
      pointerEvents: 'none',
      fontFamily: 'monospace',
      borderRadius: '4px',
      background: isForm ? 'rgba(0, 123, 255, 0.85)' : 'rgba(255, 0, 0, 0.8)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
      maxWidth: '150px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    };

    Object.assign(overlay.style, baseStyle);

    if (isForm) {
      overlay.style.marginBottom = '4px';
      overlay.style.display = 'inline-block';
      el.parentNode.insertBefore(overlay, el);
    } else {
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';

      const currentPosition = getComputedStyle(el).position;
      if (currentPosition === 'static') {
        el.dataset.originalPosition = 'static';
        el.style.position = 'relative';
      }

      el.appendChild(overlay);
    }

    overlayElements.push(overlay);
  });

  overlaysActive = true;
  console.log(`✅ Test ID Visualizer: Overlays added to ${elements.length} elements with data-testid`);
  
  return elements.length;
}

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let count = 0;
  
  switch (request.action) {
    case 'activate':
      count = createOverlays();
      sendResponse({ success: true, count });
      break;
      
    case 'deactivate':
      removeOverlays();
      sendResponse({ success: true, count: 0 });
      break;
      
    case 'getCount':
      count = document.querySelectorAll('[data-testid]').length;
      sendResponse({ count: overlaysActive ? count : 0 });
      break;
      
    default:
      sendResponse({ success: false });
  }
  
  return true;
});

// Initialize based on stored state
chrome.storage.local.get([`testid_${window.location.href}`]).then(result => {
  // Check if overlays should be active for this tab
  // This will be handled by the popup when user interacts
});

// Clean up when page unloads
window.addEventListener('beforeunload', () => {
  removeOverlays();
});
