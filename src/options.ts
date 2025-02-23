// DOM Elements
const apiKeyInput = document.getElementById("apiKey") as HTMLInputElement;
const saveButton = document.getElementById("save") as HTMLButtonElement;
const statusDiv = document.getElementById("status") as HTMLDivElement;

// Load saved API key
chrome.storage.sync.get(["openRouterApiKey"], (result) => {
  if (result.openRouterApiKey) {
    apiKeyInput.value = result.openRouterApiKey;
  }
});

// Save API key
saveButton.addEventListener("click", () => {
  const apiKey = apiKeyInput.value.trim();

  if (!apiKey) {
    showStatus("Please enter an API key", "error");
    return;
  }

  chrome.storage.sync.set(
    {
      openRouterApiKey: apiKey,
    },
    () => {
      if (chrome.runtime.lastError) {
        showStatus(
          "Error saving API key: " + chrome.runtime.lastError.message,
          "error"
        );
      } else {
        showStatus("API key saved successfully!", "success");
      }
    }
  );
});

// Show status message
function showStatus(message: string, type: "success" | "error"): void {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;

  // Hide status after 3 seconds
  setTimeout(() => {
    statusDiv.className = "status";
  }, 3000);
}
