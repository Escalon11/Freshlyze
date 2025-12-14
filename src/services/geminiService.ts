import { GoogleGenAI, Type } from "@google/genai";
import type { FreshnessData } from "../types";

const SYSTEM_INSTRUCTION = `
Anda adalah ahli agronomi, koki, dan nutrisi AI untuk aplikasi 'Freshlyze'. 
Tugas: Analisis gambar buah/sayuran, tentukan kesegaran, kematangan, dan saran pengolahan yang paling tepat.

Aturan Respons:
- Format JSON saja.
- Bahasa Indonesia.
- Jika item sudah terlalu matang atau agak layu, berikan saran pengolahan yang menyelamatkan bahan tersebut.

Struktur JSON:
{
  "isFood": boolean, 
  "itemName": string, 
  "freshnessScore": number, (Skala INTEGER 0-100. Contoh: 95, 80, 45. JANGAN gunakan desimal seperti 0.95)
  "freshnessLabel": string,
  "confidence": number, (Skala INTEGER 0-100. Contoh: 98, 90. JANGAN gunakan desimal)
  "ripenessLevel": string,
  "shortDescription": string,
  "visualIndicators": [string],
  "shelfLife": string, 
  "storageAdvice": string, 
  "nutritionHighlights": string,
  "cookingSuggestions": [string],
  "recipeName": string,
  "recipeInstructions": string
}
`;

export const analyzeImageFreshness = async (base64Image: string, mimeType: string): Promise<FreshnessData> => {
  // Ambil API Key dari environment variable
  const apiKey = process.env.API_KEY;

  // 1. CEK KEY: Jika kosong, berikan pesan error yang jelas kepada user
  if (!apiKey) {
    throw new Error("API Key belum dipasang. Silakan buat file '.env' di folder proyek dan isi dengan 'API_KEY=AIzaSy...'. Restart terminal setelahnya.");
  }

  // 2. Inisialisasi client HANYA jika key ada
  const ai = new GoogleGenAI({ apiKey: apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isFood: { type: Type.BOOLEAN },
            itemName: { type: Type.STRING },
            freshnessScore: { type: Type.NUMBER },
            freshnessLabel: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            ripenessLevel: { type: Type.STRING },
            shortDescription: { type: Type.STRING },
            visualIndicators: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            shelfLife: { type: Type.STRING },
            storageAdvice: { type: Type.STRING },
            nutritionHighlights: { type: Type.STRING },
            cookingSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recipeName: { type: Type.STRING },
            recipeInstructions: { type: Type.STRING }
          },
          // UPDATE: Menambahkan 'visualIndicators' ke daftar wajib (required) agar tidak null
          required: [
            "isFood", "itemName", "freshnessScore", "freshnessLabel", 
            "ripenessLevel", "cookingSuggestions", "recipeName", 
            "recipeInstructions", "confidence", "visualIndicators",
            "shortDescription", "shelfLife", "storageAdvice", "nutritionHighlights"
          ]
        }
      },
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: "Analisis kesegaran.",
          },
        ],
      },
    });

    if (!response.text) {
      throw new Error("Tidak ada respons teks dari AI");
    }

    const data = JSON.parse(response.text) as FreshnessData;
    return data;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    
    // Pesan error yang lebih bersahabat
    let errorMessage = "Gagal menganalisis gambar.";
    
    if (error.message?.includes("API key")) {
      errorMessage = "Masalah pada API Key. Pastikan API Key Anda valid dan aktif di Google AI Studio.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};