import { Resume, FormField, LLMPayload } from "../types";
import resumeData from "../resume.json";

export class LLMService {
  private static instance: LLMService;
  private readonly API_ENDPOINT =
    "https://openrouter.ai/api/v1/chat/completions";
  private API_KEY = ""; // Initialize as empty string, will be set later

  private constructor() {}

  public static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  public async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(["openRouterApiKey"], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          this.API_KEY = result.openRouterApiKey;
          resolve();
        }
      });
    });
  }

  /**
   * Creates the payload for the LLM API by combining page data, form fields, and resume
   */
  public createPayload(
    pageSkeleton: string,
    formFields: FormField[]
  ): LLMPayload {
    // Sanitize the inputs
    const sanitizedSkeleton = this.sanitizeHtml(pageSkeleton);
    const sanitizedFields = formFields.map((field) => ({
      ...field,
      value: this.sanitizeString(field.value),
      placeholder: this.sanitizeString(field.placeholder),
    }));

    const payload: LLMPayload = {
      pageSkeleton: sanitizedSkeleton,
      formFields: sanitizedFields,
      resume: resumeData as Resume,
      timestamp: new Date().toISOString(),
    };

    // Log the payload for debugging
    console.log("Created LLM payload:", payload);

    return payload;
  }

  /**
   * Sends the payload to OpenRouter API and returns the tailored response
   */
  public async getTailoredResume(payload: LLMPayload): Promise<{
    tailoredResume: Resume;
    reasoning: string;
  }> {
    try {
      if (!this.API_KEY) {
        await this.initialize();
      }

      const messages = [
        {
          role: "system",
          content:
            "You are an expert resume tailor. Your task is to analyze the job description and modify the provided resume to better match the job requirements. Provide clear reasoning for your changes.",
        },
        {
          role: "user",
          content: JSON.stringify({
            jobDescription: payload.pageSkeleton,
            formFields: payload.formFields,
            originalResume: payload.resume,
          }),
        },
      ];

      const response = await fetch(this.API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.API_KEY}`,
          "HTTP-Referer":
            "https://github.com/yourusername/automatic-job-applyer", // TODO: Update with your repo
          "X-Title": "Automatic Job Applier",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-opus-20240229",
          messages,
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const llmResponse = JSON.parse(data.choices[0].message.content);

      return {
        tailoredResume: llmResponse.tailoredResume,
        reasoning: llmResponse.reasoning,
      };
    } catch (error) {
      console.error("Error getting tailored resume:", error);
      throw error;
    }
  }

  /**
   * Sanitizes HTML content to prevent XSS and other injection attacks
   */
  private sanitizeHtml(html: string): string {
    // Basic HTML sanitization - in production, use a proper sanitizer library
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+="[^"]*"/g, "")
      .replace(/javascript:/gi, "");
  }

  /**
   * Sanitizes a string by removing potential harmful characters
   */
  private sanitizeString(str: string): string {
    return str.replace(/[<>]/g, "");
  }
}
