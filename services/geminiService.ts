import { GoogleGenAI } from "@google/genai";
import { KPIMetrics, CommunityReport, GovPromise } from "../types";

// In a real app, this should be handled securely. 
// For this demo, we assume process.env.API_KEY is available or we handle the error gracefully.
const API_KEY = process.env.API_KEY || '';

export const generatePredictions = async (
  metrics: KPIMetrics,
  reports: CommunityReport[],
  promises: GovPromise[]
): Promise<string> => {
  if (!API_KEY) {
    return "API Key is missing. Please configure the environment to view AI predictions.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Prepare context data
    const contextData = {
      kpi: metrics,
      recentReports: reports.slice(0, 5), // Top 5 recent reports
      govPromises: promises.filter(p => p.status !== 'Distributed') // Pending promises
    };

    const prompt = `
      You are an expert disaster relief analyst for "Hurricane Melissa" in Jamaica.
      Analyze the following JSON data representing the current relief status:
      ${JSON.stringify(contextData)}

      Provide a "Predictions Lab" report with 3 distinct sections (use Markdown):
      1. **Supply Chain Risks**: Identify bottlenecks based on the gap between funds received and disbursed.
      2. **Social Stability Forecast**: Predict potential unrest or critical needs based on community reports and government promise delays.
      3. **Strategic Recommendation**: One high-impact action for the next 24 hours.

      Keep the tone professional, urgent, and data-driven.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No prediction data available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate predictions at this time due to connection issues.";
  }
};