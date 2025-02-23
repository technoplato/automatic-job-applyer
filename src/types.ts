// Resume interfaces
export interface Resume {
  basics: {
    name: string;
    label: string;
    email: string;
    phone: string;
    summary: string;
  };
  work: WorkExperience[];
  education: Education[];
  skills: Skill[];
}

interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

interface Education {
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
}

interface Skill {
  name: string;
  keywords: string[];
}

// Form field interfaces
export interface FormField {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  required: boolean;
}

// LLM payload interface
export interface LLMPayload {
  pageSkeleton: string;
  formFields: FormField[];
  resume: Resume;
  timestamp: string;
}
