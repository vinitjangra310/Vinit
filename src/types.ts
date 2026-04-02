export interface UserData {
  skills: string[];
  interests: string[];
  academicPerformance: {
    math: number;
    science: number;
    language: number;
    arts: number;
    socialStudies: number;
  };
  educationLevel: string;
}

export interface CareerRecommendation {
  careerTitle: string;
  matchPercentage: number;
  reasoning: string;
  requiredSkills: string[];
  roadmap: string[];
  marketDemand: "High" | "Medium" | "Low";
  salaryRange: string;
  alternativeCareers: string[];
}

export interface AssessmentState {
  step: number;
  data: UserData;
}
