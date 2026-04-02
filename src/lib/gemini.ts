import { GoogleGenAI, Type } from "@google/genai";
import { UserData, CareerRecommendation } from "../types";

const apiKey = process.env.GEMINI_API_KEY;

export async function getCareerRecommendation(userData: UserData): Promise<CareerRecommendation> {
  if (!apiKey) {
    throw new Error("Gemini API key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Act as a professional career counselor and AI career prediction engine.
    Analyze the following student profile and recommend the best-fit career path.
    
    Profile:
    - Education Level: ${userData.educationLevel}
    - Skills: ${userData.skills.join(", ")}
    - Interests: ${userData.interests.join(", ")}
    - Academic Performance (0-100):
      - Math: ${userData.academicPerformance.math}
      - Science: ${userData.academicPerformance.science}
      - Language: ${userData.academicPerformance.language}
      - Arts: ${userData.academicPerformance.arts}
      - Social Studies: ${userData.academicPerformance.socialStudies}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          careerTitle: { type: Type.STRING },
          matchPercentage: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
          requiredSkills: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          roadmap: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          marketDemand: { 
            type: Type.STRING,
            enum: ["High", "Medium", "Low"]
          },
          salaryRange: { type: Type.STRING },
          alternativeCareers: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: [
          "careerTitle", 
          "matchPercentage", 
          "reasoning", 
          "requiredSkills", 
          "roadmap", 
          "marketDemand", 
          "salaryRange", 
          "alternativeCareers"
        ]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  
  return JSON.parse(text);
}
