document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.getElementById('toggle');
  const status = document.getElementById('status');
  const count = document.getElementById('count');

  if (!toggle || !status || !count) {
    console.error('Required popup elements not found');
    return;
  }

  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Get current state
  const result = await chrome.storage.local.get([`testid_${tab.id}`]);
  const isActive = result[`testid_${tab.id}`] || false;
  
  updateUI(isActive);

  toggle.addEventListener('click', async () => {
    const newState = !toggle.classList.contains('active');
    
    // Update storage
    await chrome.storage.local.set({ [`testid_${tab.id}`]: newState });
    
    // Send message to content script
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: newState ? 'activate' : 'deactivate' 
      });
      
      updateUI(newState);
      
      if (response && response.count !== undefined) {
        count.textContent = `Found ${response.count} elements`;
      }
    } catch (error) {
      console.error('Failed to communicate with page:', error);
      count.textContent = 'Please refresh the page';
    }
  });

  function updateUI(isActive: boolean) {
    toggle.classList.toggle('active', isActive);
    status.textContent = isActive ? 'ON' : 'OFF';
    
    if (!isActive) {
      count.textContent = '';
    }
  }

  // Get initial count if active
  if (isActive) {
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getCount' });
      if (response && response.count !== undefined) {
        count.textContent = `Found ${response.count} elements`;
      }
    } catch (error) {
      // Silently handle - page might need refresh
    }
  }
}); 