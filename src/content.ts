// Track overlay state
let overlaysActive = false;
let overlayElements: HTMLElement[] = [];

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
    const element = el as HTMLElement;
    if (element.dataset.originalPosition) {
      element.style.position = element.dataset.originalPosition;
      delete element.dataset.originalPosition;
    }
  });
  
  overlaysActive = false;
}

// Create overlays function
function createOverlays(): number {
  if (overlaysActive) {
    removeOverlays();
  }

  const elements = document.querySelectorAll('[data-testid]');

  elements.forEach((el) => {
    const element = el as HTMLElement;
    const testId = element.getAttribute('data-testid');
    if (!testId) return;
    
    const isForm = element.tagName.toLowerCase() === 'form';

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
      element.parentNode?.insertBefore(overlay, element);
    } else {
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';

      const currentPosition = getComputedStyle(element).position;
      if (currentPosition === 'static') {
        element.dataset.originalPosition = 'static';
        element.style.position = 'relative';
      }

      element.appendChild(overlay);
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

// Initialize based on stored state by asking background script for tab state
chrome.runtime.sendMessage({ action: 'getTabState' }, (response) => {
  console.log('TestID Visualizer: Response from background script', response);

  if (response && response.isActive) {
    // Restore overlays if they were active before reload
    setTimeout(() => {
      createOverlays();
    }, 2000); // Small delay to ensure DOM is ready
  }
});

// Clean up when page unloads
window.addEventListener('beforeunload', () => {
  removeOverlays();
}); 