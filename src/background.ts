/// <reference types="chrome"/>

// Listen for keyboard shortcut command
chrome.commands.onCommand.addListener((command: string) => {
  if (command === "trigger-tailor") {
    console.log("Keyboard shortcut triggered – starting resume tailoring process.");
    
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      const activeTab = tabs[0];
      if (!activeTab?.id) return;
      
      // Send message to content script to start the process
      chrome.tabs.sendMessage(activeTab.id, { action: "startTailoring" });
    });
  }
}); 