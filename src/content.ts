import { Readability } from "@mozilla/readability";

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startTailoring") {
    console.log("Starting resume tailoring process...");
    const pageSkeleton = extractPageSkeleton();
    const formFields = extractFormFields();

    // TODO: Send data to LLM for processing
    console.log("Extracted page skeleton:", pageSkeleton);
    console.log("Extracted form fields:", formFields);
  }
});

function extractPageSkeleton(): string {
  // Clone the document to avoid modifying the live DOM
  const documentClone = document.cloneNode(true) as Document;
  const reader = new Readability(documentClone);
  const article = reader.parse();
  return article ? article.content : document.body.innerHTML;
}

function extractFormFields(): Record<string, any>[] {
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
