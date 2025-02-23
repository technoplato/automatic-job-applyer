import { Readability } from "@mozilla/readability";
import { LLMService } from "./services/llm";
import { FormField } from "./types";

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startTailoring") {
    console.log("Starting resume tailoring process...");
    handleTailoring();
  }
});

async function handleTailoring() {
  try {
    // Update popup status
    chrome.runtime.sendMessage({
      status: "Extracting job details...",
      type: "normal",
    });

    // Extract page data
    const pageSkeleton = extractPageSkeleton();
    const formFields = extractFormFields();

    // Update popup status
    chrome.runtime.sendMessage({
      status: "Processing with AI...",
      type: "normal",
    });

    // Get LLM service instance
    const llmService = LLMService.getInstance();

    // Create payload
    const payload = llmService.createPayload(pageSkeleton, formFields);

    // Get tailored resume
    const { tailoredResume, reasoning } =
      await llmService.getTailoredResume(payload);

    // Update popup with results
    chrome.runtime.sendMessage({
      status: "Resume tailored successfully!",
      type: "success",
      reasoning,
    });

    // TODO: Auto-fill form with tailored resume data
    console.log("Tailored resume:", tailoredResume);
  } catch (error) {
    console.error("Error during tailoring process:", error);
    chrome.runtime.sendMessage({
      status: "Error: " + (error as Error).message,
      type: "error",
    });
  }
}

function extractPageSkeleton(): string {
  // Clone the document to avoid modifying the live DOM
  const documentClone = document.cloneNode(true) as Document;
  const reader = new Readability(documentClone);
  const article = reader.parse();
  return article ? article.content : document.body.innerHTML;
}

function extractFormFields(): FormField[] {
  const formElements = document.querySelectorAll<HTMLElement>(
    "input, textarea, select"
  );
  return Array.from(formElements).map((element) => {
    const inputElement = element as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    return {
      id: inputElement.id,
      name: inputElement.name,
      type:
        inputElement instanceof HTMLInputElement
          ? inputElement.type
          : inputElement.tagName.toLowerCase(),
      placeholder:
        inputElement instanceof HTMLInputElement ||
        inputElement instanceof HTMLTextAreaElement
          ? inputElement.placeholder
          : "",
      value: inputElement.value,
      required: inputElement.required,
    };
  });
}
