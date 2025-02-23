# Automatic Job Applier Chrome Extension

A Chrome extension that automatically tailors your resume and applies to job postings based on the job description.

## Features

- Keyboard shortcut (Ctrl+Shift+T / Cmd+Shift+T) to trigger the resume tailoring process
- Automatic extraction of job descriptions and requirements
- Smart form field detection and auto-filling
- Resume tailoring using AI/LLM
- Visual feedback and reasoning display

## Setup

1. Install dependencies:

```bash
npm install
```

2. Build the extension:

```bash
npm run build
```

3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` directory

## Development

- Run the TypeScript compiler in watch mode:

```bash
npm run watch
```

- The extension uses TypeScript for type safety and better development experience
- Source files are in the `src` directory
- Built files are output to the `dist` directory

## Project Structure

- `src/manifest.json` - Extension manifest and configuration
- `src/background.ts` - Background service worker script
- `src/content.ts` - Content script for page interaction
- `src/popup.html` & `src/popup.ts` - Extension popup UI
- `src/resume.json` - Your resume data in JSON format

## Usage

1. Navigate to a job posting page
2. Press Ctrl+Shift+T (Windows/Linux) or Cmd+Shift+T (Mac) to start the process
3. The extension will:
   - Extract the job description
   - Analyze requirements
   - Tailor your resume
   - Auto-fill the application form
4. Review the changes in the popup window before submission

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
