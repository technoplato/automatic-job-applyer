// DOM Elements
const statusElement = document.getElementById("status") as HTMLDivElement;
const reasoningElement = document.getElementById("reasoning") as HTMLDivElement;

// Update status with optional class for styling
function updateStatus(
  message: string,
  type: "normal" | "success" | "error" = "normal"
) {
  statusElement.textContent = message;
  statusElement.className = `status ${type}`;
}

// Update reasoning display
function updateReasoning(reasoning: string) {
  reasoningElement.textContent = reasoning;
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.status) {
    updateStatus(message.status, message.type || "normal");
  }
  if (message.reasoning) {
    updateReasoning(message.reasoning);
  }
});

// Initialize popup
document.addEventListener("DOMContentLoaded", () => {
  updateStatus("Ready to start tailoring your resume...");
});
