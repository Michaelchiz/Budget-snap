import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from '../types';

export const generateRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }
  
  if (ingredients.length === 0) {
     return [];
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are a practical, budget-friendly cooking assistant for students.
    The user has the following ingredients: ${ingredients.join(', ')}.
    
    Suggest 3 simple, realistic meals they can cook. 
    Do NOT suggest ingredients they don't have unless they are basic staples like oil, salt, water, or sugar.
    Keep instructions very short and simple.
    Focus on survival and filling meals.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              ingredients: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              instructions: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              prepTime: { type: Type.STRING },
            },
            required: ["name", "ingredients", "instructions"],
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const recipes = JSON.parse(text) as Recipe[];
    // Ensure IDs exist
    return recipes.map((r, i) => ({ ...r, id: r.id || `recipe-${i}-${Date.now()}` }));
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
