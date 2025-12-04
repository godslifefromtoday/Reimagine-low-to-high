import { GoogleGenAI } from "@google/genai";
import { EditedImage } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize the client with the API Key
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Converts a File object to a Base64 string (without the data URL prefix).
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/xxx;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Edits an image using Gemini 2.5 Flash Image model.
 * @param imageBase64 The base64 string of the source image.
 * @param mimeType The mime type of the source image.
 * @param promptText The user's prompt for editing.
 */
export const editImageWithGemini = async (
  imageBase64: string,
  mimeType: string,
  promptText: string
): Promise<EditedImage> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: promptText,
          },
        ],
      },
    });

    // Iterate through parts to find the image part
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content generated from the model.");
    }

    let editedImageData: string | null = null;
    let responseMimeType: string = "image/png"; // Default

    for (const part of parts) {
      if (part.inlineData) {
        editedImageData = part.inlineData.data;
        // The API might not explicitly return mimeType in inlineData sometimes, 
        // but typically it's image/png for generated images unless specified.
        if (part.inlineData.mimeType) {
            responseMimeType = part.inlineData.mimeType;
        }
        break; // Found the image
      }
    }

    if (!editedImageData) {
      // Sometimes the model might refuse and return text explaining why.
      const textPart = parts.find(p => p.text)?.text;
      if (textPart) {
        throw new Error(`Model returned text instead of image: ${textPart}`);
      }
      throw new Error("Model did not return a valid image.");
    }

    return {
      data: editedImageData,
      mimeType: responseMimeType,
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to process image with Gemini.");
  }
};
