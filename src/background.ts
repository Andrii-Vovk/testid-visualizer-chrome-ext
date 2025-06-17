// Background script to handle tab state management

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTabState' && sender.tab) {
    // Get the stored state for this tab
    chrome.storage.local.get([`testid_${sender.tab.id}`]).then(result => {
      const isActive = result[`testid_${sender.tab.id}`] || false;
      sendResponse({ isActive, tabId: sender.tab.id });
    });
    return true; // Will respond asynchronously
  }
});

// Clean up storage when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove([`testid_${tabId}`]);
}); 