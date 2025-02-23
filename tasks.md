Below is an expanded, granular breakdown of the technical tasks—each roughly one story point—for creating an automatic job apply Chrome extension. The tasks are organized by feature area, with technical direction to help ensure consistency and clarity throughout the implementation.

---

1. Trigger via Keyboard Shortcut

User Story:
As a user, I want to trigger the resume tailoring and auto-apply process using a keyboard shortcut (e.g., Ctrl+Shift+T) so that I can quickly initiate the process without navigating through menus.

Technical Subtasks

- [x] Define Command in Manifest (≈1 Story Point): ([commit 974fa80](https://github.com/username/automatic-job-applyer/commit/974fa80))

Update manifest.json under the "commands" section to define "trigger-tailor".

Specify the keybinding (e.g., "Ctrl+Shift+T") and add a description.

Technical Tip: Validate JSON syntax and ensure the key combination does not conflict with other system shortcuts.

- [x] Implement Command Listener (≈1 Story Point): ([commit 974fa80](https://github.com/username/automatic-job-applyer/commit/974fa80))

In background.ts, use the Chrome commands API:

chrome.commands.onCommand.addListener((command) => {
if (command === "trigger-tailor") {
console.log("Keyboard shortcut triggered – starting resume tailoring process.");
// TODO: Dispatch message to active tab to start scraping
}
});

Technical Tip: Ensure that this file is correctly referenced in your manifest as a service worker.

- [x] Add Debug Logging (≈0.5 Story Points): ([commit 974fa80](https://github.com/username/automatic-job-applyer/commit/974fa80))

Add console logging to trace when the command is triggered.

Technical Tip: Use consistent logging formats to ease debugging later.

---

2. Job Page Scraping and Skeleton Extraction

User Story:
As a user, I want the extension to extract a simplified skeleton of the job page so that key information is available for tailoring my resume.

Technical Subtasks

- [x] Integrate a Scraping Library (≈1 Story Point): ([commit 974fa80](https://github.com/username/automatic-job-applyer/commit/974fa80))

Choose a library (e.g., Readability.js).

Install via npm or include as a bundled script.

Technical Tip: Ensure that the library is compatible with content scripts and does not conflict with the page's own scripts.

- [x] Extract Page Skeleton (≈1 Story Point): ([commit 974fa80](https://github.com/username/automatic-job-applyer/commit/974fa80))

In content.ts, clone the document to avoid modifying the live DOM.

Use the library to parse and extract the article/skeleton.

import { Readability } from "@mozilla/readability";
const documentClone = document.cloneNode(true) as Document;
const reader = new Readability(documentClone);
const article = reader.parse();
const pageSkeleton = article ? article.content : document.body.innerHTML;

Technical Tip: Add error handling if the library fails and fall back gracefully.

- [x] Validate the Extracted Skeleton (≈0.5 Story Points): ([commit 974fa80](https://github.com/username/automatic-job-applyer/commit/974fa80))

Ensure key elements (headers, paragraphs, form containers) are present.

Technical Tip: Use unit tests or manual checks to verify that important HTML elements aren't lost.

- [x] Package the Skeleton (≈0.5 Story Points): ([commit 974fa80](https://github.com/username/automatic-job-applyer/commit/974fa80))

Wrap the extracted content into a JSON object (e.g., { pageSkeleton: "..." }).

Technical Tip: Consider adding metadata (e.g., timestamp) for debugging purposes.

---

3. Form Field Extraction

User Story:
As a user, I want the extension to identify and extract metadata from form fields on the job application page so that my resume data can be mapped accurately.

Technical Subtasks

- [x] Select Form Elements (≈0.5 Story Points): ([commit 974fa80](https://github.com/username/automatic-job-applyer/commit/974fa80))

Use a query selector to grab all input, textarea, and select elements.

const formElements = document.querySelectorAll("input, textarea, select");

Technical Tip: Verify selector coverage by testing on various job pages.

- [x] Determine Field Types (≈1 Story Point): ([commit 974fa80](https://github.com/username/automatic-job-applyer/commit/974fa80))

Loop through elements and inspect type and tagName properties.

Technical Tip: Create a helper function that normalizes field types (e.g., "text", "checkbox", "radio").

- [x] Extract Field Metadata (≈1 Story Point): ([commit 974fa80](https://github.com/username/automatic-job-applyer/commit/974fa80))

For each form element, extract attributes like id, name, type, placeholder, and current value.

Technical Tip: Consider edge cases where attributes may be missing; use defaults as needed.

- [x] Create a Schema Object (≈1 Story Point): ([commit 974fa80](https://github.com/username/automatic-job-applyer/commit/974fa80))

Organize the metadata into a well-defined JSON schema that later maps to the resume JSON.

Technical Tip: Document the schema structure for future developers and potential unit tests.

---

4. Resume JSON Integration

User Story:
As a user, I want my base resume stored in JSON format to be easily integrated so that the tailored resume can be generated dynamically.

Technical Subtasks

- [x] Store Resume Data (≈0.5 Story Points): ([commit 974fa80](https://github.com/username/automatic-job-applyer/commit/974fa80))

Create a file src/resume.json containing your resume data.

Technical Tip: Validate JSON formatting using a linter or JSON validator.

- [x] Define a TypeScript Interface (≈0.5 Story Points): ([commit 974fa80](https://github.com/username/automatic-job-applyer/commit/974fa80))

Create an interface (e.g., interface Resume { ... }) in a shared file.

Technical Tip: Use strict typing to catch mismatches during compilation.

- [x] Load JSON Data (≈0.5 Story Points): ([commit 974fa80](https://github.com/username/automatic-job-applyer/commit/974fa80))

Import the JSON data into your TypeScript code:

import resumeData from "./resume.json";

Technical Tip: Ensure your bundler/TypeScript config supports JSON imports.

- [x] Validate Data (≈0.5 Story Points): ([commit 974fa80](https://github.com/username/automatic-job-applyer/commit/974fa80))

Optionally add runtime checks to ensure the JSON matches the expected interface.

Technical Tip: Use libraries like io-ts for runtime validation if needed.

---

5. Data Aggregation for LLM

User Story:
As a user, I want all the extracted data (page skeleton, form schema, resume) to be aggregated and formatted correctly for sending to an LLM endpoint.

Technical Subtasks

Create Aggregation Function (≈1 Story Point):

Write a function to combine the page skeleton, form schema, and resume JSON.

function createPayload(pageSkeleton: string, formSchema: any, resume: Resume) {
return { pageSkeleton, formSchema, resume };
}

Technical Tip: Test the function with mock data to ensure proper aggregation.

Sanitize and Format Data (≈1 Story Point):

Ensure that any strings are escaped correctly to prevent JSON issues.

Technical Tip: Use JSON.stringify and verify output with sample payloads.

Log Aggregated Data (≈0.5 Story Points):

Log the final payload to the console for debugging before sending.

Technical Tip: Remove or reduce logging in production builds.

---

6. LLM Request and Response

User Story:
As a user, I want the aggregated data to be sent to an LLM API, and for the tailored resume and reasoning to be received and processed automatically.

Technical Subtasks

Setup API Call (≈1 Story Point):

Use fetch (or another HTTP client) to post the aggregated JSON payload to the LLM endpoint.

fetch("https://api.your-llm.com/tailor", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload),
});

Technical Tip: Use async/await for cleaner asynchronous code and handle network errors.

Process the API Response (≈1 Story Point):

Parse the JSON response to extract tailoredResume and reasoning.

.then(response => response.json())
.then(data => {
// Process data.tailoredResume and data.reasoning
});

Technical Tip: Validate the response schema to ensure expected data structure.

Implement Error Handling (≈1 Story Point):

Wrap API calls in try/catch blocks and check HTTP statuses.

Technical Tip: Provide user-friendly error messages in case of failure.

---

7. UI for Reasoning Display

User Story:
As a user, I want to see the LLM's reasoning for the tailored resume on a popup so that I can understand how the data was processed.

Technical Subtasks

Design the Popup UI (≈1 Story Point):

Create popup.html with a container element (e.g., <div id="reasoning-container">).

Technical Tip: Use simple, responsive CSS for readability.

Implement Popup Logic (≈1 Story Point):

In popup.ts, write code to dynamically update the reasoning container:

const container = document.getElementById("reasoning-container");
container.textContent = data.reasoning;

Technical Tip: Listen for messages from the background or content scripts to update the UI in real time.

Add User Interaction Controls (≈0.5 Story Points):

Optionally include a "refresh" or "close" button with corresponding event listeners.

Technical Tip: Ensure accessibility and proper event delegation.

---

8. Auto-Fill Application Form

User Story:
As a user, I want the tailored resume data to automatically populate the job application form so that I don't have to fill out repetitive fields manually.

Technical Subtasks

Map LLM Output to Form Fields (≈1 Story Point):

Create a mapping function that links keys from the LLM output to the appropriate form field selectors.

Technical Tip: Use a configuration file or mapping object to ease future updates.

Populate Standard Form Fields (≈1 Story Point):

Write DOM manipulation code to set the value for text inputs:

(document.getElementById("name") as HTMLInputElement).value = data.tailoredResume.name;

Technical Tip: Test on multiple form layouts to ensure robust behavior.

Handle Special Field Types (≈1 Story Point):

Implement logic to check/uncheck checkboxes and select the correct options for dropdowns.

Technical Tip: Use conditional logic based on the field type determined during extraction.

Fallback and Error Indication (≈0.5 Story Points):

If a field mapping fails, highlight the form field or add a tooltip for manual correction.

Technical Tip: Use CSS classes to indicate errors and guide the user.

---

9. Visual Feedback and Notifications

User Story:
As a user, I want clear visual feedback and notifications during the process so that I know what stage the application is in.

Technical Subtasks

Implement Status Indicators (≈1 Story Point):

Display messages like "Scraping in progress...", "LLM processing...", and "Form auto-filled!" within the popup UI.

Technical Tip: Use a progress bar or spinner for long-running operations.

Use Chrome Notifications (≈0.5 Story Points):

Integrate chrome.notifications.create to show system-level notifications when significant events occur.

Technical Tip: Ensure notifications follow Chrome's guidelines for user permissions and clarity.

Dynamic UI Updates (≈0.5 Story Points):

Update UI elements via callbacks or promise resolutions as each process step completes.

Technical Tip: Maintain a consistent UI state to avoid confusing the user.

---

10. Error Handling

User Story:
As a developer, I want robust error handling in all modules so that issues are logged and can be retried or corrected easily.

Technical Subtasks

Global Error Handlers (≈1 Story Point):

Wrap API calls, DOM manipulations, and critical functions in try/catch blocks.

Technical Tip: Consider a global error handler that logs errors to a centralized service if needed.

UI Error Messaging (≈0.5 Story Points):

Display clear error messages in the popup or as an overlay on the job page.

Technical Tip: Use user-friendly language and suggest possible actions.

Detailed Logging (≈0.5 Story Points):

Log error details to the console (or external service) with enough context for debugging.

Technical Tip: Use a consistent logging format to filter logs during development.

Implement Retry Logic (≈1 Story Point):

For network requests, implement retries with exponential backoff.

Technical Tip: Limit the number of retries to avoid infinite loops.

---

11. Modularity and Updateability

User Story:
As a developer, I want the codebase to be modular and well-documented so that updates and maintenance are straightforward.

Technical Subtasks

Divide Code into Modules (≈1 Story Point):

Organize code into logical modules (scraping, API communication, UI, etc.) using ES modules or TypeScript namespaces.

Technical Tip: Follow a clear directory structure that mirrors module responsibilities.

Define and Export Interfaces (≈0.5 Story Points):

Create and export TypeScript interfaces (e.g., Resume, FormField) for shared data.

Technical Tip: Keep interfaces in a separate types/ or interfaces/ folder for reusability.

Thorough Documentation (≈1 Story Point):

Add inline comments and update the README with instructions on updating resume JSON and other templates.

Technical Tip: Use JSDoc or TypeScript documentation generators for consistency.

---

12. TypeScript for Maintainability

User Story:
As a developer, I want to enforce strict typing and use linting and testing tools so that the code is maintainable and reliable.

Technical Subtasks

Enforce Strict Typing (≈0.5 Story Points):

Configure tsconfig.json with "strict": true and validate all TypeScript files.

Technical Tip: Regularly run tsc --noEmit during development to catch errors.

Setup Linting and Formatting (≈0.5 Story Points):

Integrate ESLint and Prettier and configure them according to project guidelines.

Technical Tip: Use pre-commit hooks (e.g., Husky) to enforce code quality.

Unit Testing Setup (≈1 Story Point):

Set up Jest (or similar) to write unit tests for core functions (aggregation, mapping).

Technical Tip: Aim for tests that cover edge cases and simulate DOM interactions using tools like jsdom.

---

13. Manifest and Permissions Setup

User Story:
As a developer, I want a correctly configured manifest with the required permissions so that the extension operates within Chrome's security model.

Technical Subtasks

Create and Validate Manifest (≈0.5 Story Points):

Write a manifest.json using Manifest V3, including permissions (activeTab, scripting, storage).

Technical Tip: Use the Chrome Extension Validator to catch mistakes.

Define Script Paths (≈0.5 Story Points):

Ensure background and content scripts are pointed to the compiled JS in dist/.

Technical Tip: Keep file names consistent between your source and manifest.

Configure Commands and Icons (≈0.5 Story Points):

Define keyboard commands and ensure icons are referenced correctly.

Technical Tip: Test icons on multiple resolutions.

---

14. Build Process

User Story:
As a developer, I want a reliable build process that compiles TypeScript to JavaScript and outputs source maps for debugging.

Technical Subtasks

Setup Build Script (≈0.5 Story Points):

Add a build script in package.json (e.g., "build": "tsc").

Technical Tip: Verify that the script compiles all necessary files.

Configure Source Maps (≈0.5 Story Points):

Ensure tsconfig.json is set to generate source maps for debugging.

Technical Tip: Check that source maps are correctly referenced in Chrome's DevTools.

(Optional) Configure Bundler (≈1 Story Point):

If using Webpack or another bundler, set up the configuration to compile TypeScript and output to dist/.

Technical Tip: Keep bundler settings minimal if not needed for advanced features.

Setup Continuous Build/Watch Mode (≈0.5 Story Points):

Optionally add a watch script (e.g., tsc --watch) for faster development feedback.

Technical Tip: Use a terminal multiplexer or integrated IDE build tasks.

---

15. Debug and Reload

User Story:
As a developer, I want to easily test, debug, and reload the extension so that I can iterate quickly on improvements and bug fixes.

Technical Subtasks

Load Extension in Chrome (≈0.5 Story Points):

Open chrome://extensions/, enable Developer Mode, and "Load unpacked" your project directory.

Technical Tip: Document the steps in the README for team onboarding.

Use DevTools for Debugging (≈0.5 Story Points):

Use Chrome Developer Tools to inspect console logs, network requests, and DOM changes.

Technical Tip: Set breakpoints in both content and background scripts as needed.

Iterative Development and Reloading (≈0.5 Story Points):

Recompile the TypeScript after changes and reload the extension.

Technical Tip: Use automated reload extensions (e.g., "Extension Reloader") for faster iterations.

Insert Detailed Debug Logging (≈0.5 Story Points):

Add granular logging at each process step to trace issues.

Technical Tip: Consider using a logging library or central logging function for consistency.

---

16. (Optional) Automatic Job Apply Action

User Story:
As a user, I want the extension to automatically submit the job application once the form is filled so that I can streamline my job search process.

Technical Subtasks

Detect the "Apply" Button (≈1 Story Point):

In content.ts, add logic to locate the submit or "Apply" button based on common selectors or attributes.

Technical Tip: Use query selectors that are resilient to different page structures.

Simulate Click Action (≈0.5 Story Points):

Programmatically trigger a click event on the detected button after verifying the form is filled.

const applyButton = document.querySelector("button.apply, input[type='submit']");
if (applyButton) {
(applyButton as HTMLElement).click();
}

Technical Tip: Consider a confirmation prompt before auto-submission to avoid accidental applications.

Error Handling for Auto-Submission (≈0.5 Story Points):

Add fallback logic if the auto-submit fails (e.g., highlight the button for manual click).

Technical Tip: Log the result of the click event and handle exceptions gracefully.
