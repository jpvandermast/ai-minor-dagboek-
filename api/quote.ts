/**
 * API-endpoint voor het genereren van de dagelijkse spreuk via Google GenAI.
 * 
 * ENVIRONMENT VARIABLE DOCUMENTATIE:
 * - AI Studio: Gebruikt automatisch process.env.GEMINI_API_KEY uit de Secrets instellingen.
 * - Vercel Hosting: Stel 'GEMINI_API_KEY' (of 'API_KEY') in onder:
 *   Vercel Dashboard -> Jouw Project -> Settings -> Environment Variables.
 * 
 * Dit bestand fungeert zowel als Vercel Serverless Function (/api/quote)
 * als backend handler voor de Express ontwikkel- en productieserver.
 */

import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

export async function generateDailyQuote(): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // Prompt conform de specificatie van de user story
  const prompt =
    "Geef één korte, warme, reflectieve Nederlandse spreuk (max 20 woorden) die past bij het afsluiten van een dagboekpagina. Geef alleen de spreuk terug, zonder aanhalingstekens en zonder uitleg.";

  // Gebruik actuele en responsieve Gemini Flash modellen conform @google/genai standaarden
  const candidateModels = [
    "gemini-3.5-flash",
    "gemini-flash-latest",
    "gemini-3.5-flash-lite",
  ];
  let quote = "";
  let lastError: unknown = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.9,
        },
      });

      if (response.text) {
        quote = response.text.trim();
        // Verwijder eventuele overtollige aanhalingstekens aan begin/eind
        quote = quote.replace(/^["'«„“”]+|["'»“”]+$/g, "").trim();
        break;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} poging mislukt:`, err?.message || err);
      // Probeer volgend kandidaat-model indien beschikbaar
      continue;
    }
  }

  if (!quote) {
    if (lastError) {
      console.error("Gemini API fout bij ophalen spreuk:", lastError);
    }
    throw new Error("GENERATION_FAILED");
  }

  return quote;
}

// Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  // Toestaan voor zowel GET als POST
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const quote = await generateDailyQuote();
    return res.status(200).json({ quote, success: true });
  } catch (error: any) {
    if (error?.message === "GEMINI_API_KEY_MISSING") {
      return res.status(500).json({
        error: "Kon geen spreuk ophalen, probeer het opnieuw (API-sleutel ontbreekt in server environment).",
        code: "KEY_MISSING",
      });
    }

    return res.status(500).json({
      error: "Kon geen spreuk ophalen, probeer het opnieuw",
      code: "FETCH_FAILED",
    });
  }
}
