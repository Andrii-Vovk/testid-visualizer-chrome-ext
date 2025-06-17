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

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-testid') {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) return;

    // Get current state
    const result = await chrome.storage.local.get([`testid_${tab.id}`]);
    const isActive = result[`testid_${tab.id}`] || false;
    const newState = !isActive;

    // Update storage
    await chrome.storage.local.set({ [`testid_${tab.id}`]: newState });

    // Send message to content script
    try {
      await chrome.tabs.sendMessage(tab.id, { 
        action: newState ? 'activate' : 'deactivate' 
      });
    } catch (error) {
      console.error('Failed to toggle via hotkey:', error);
    }
  }
});

// Clean up storage when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove([`testid_${tabId}`]);
}); 