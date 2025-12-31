import { GoogleGenAI } from "@google/genai";

/**
 * Generates a response from the Gemini AI model.
 * Following @google/genai guidelines to initialize the instance right before the call.
 */
export const getGeminiResponse = async (userMessage: string): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Gemini API key is missing. Set VITE_GEMINI_API_KEY in your env.");
      return "I couldn't reach the assistant right now. Please use WhatsApp for a fast reply.";
    }

    // Always use a new GoogleGenAI instance right before the call with the environment variable directly.
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';
    
    // Context aware system instruction
    const systemInstruction = `
      You are AJ, the intelligent assistant for "Aj Private Chauffeur Enterprise" (AJ Taxi KL).
      
      We specialize in **Airport Transfers**, **Genting Highlands**, **Outstation Trips**, and **Car Rental (Kereta Sewa)**.
      
      **Contact Details:**
      - Phone: 018-233 5796
      - Address: A-12-20, DBKL Pekan Kepong Off, Jalan Kepong 52100 Kuala Lumpur.
      - Email: ajtaxikl@gmail.com
      
      **Our Services:**
      1. **KLIA / KLIA2 Airport Transfer:** Meet & Greet service. Flight monitoring included.
      2. **Genting Highlands:** Drop off at First World Hotel, Genting Grand, or Premium Outlets.
      3. **Intercity / Outstation:** Trips to Penang, Ipoh, Cameron Highlands, Melaka, JB, Singapore.
      4. **City Tours:** Hourly booking for KL City Centre (KLCC, Batu Caves).
      5. **Car Rental (Self Drive):** Daily/Weekly rentals available.
      
      **Our Updated Fleet:**
      - **Luxury MPV:** Toyota Alphard (6 pax, VIP comfort).
      - **Futuristic MPV:** Hyundai Staria (7 pax, luxury lounge).
      - **Standard MPV:** Toyota Innova (7 pax, best for families).
      - **Compact MPV:** Perodua Alza (7 pax, economical group travel).
      - **Economy Sedan:** Perodua Bezza (4 pax, great luggage space).
      - **Compact Economy:** Perodua Axia (4 pax, budget friendly).
      
      **Pricing Policy:**
      - We offer competitive, fixed rates.
      - We do not display exact prices in chat; always ask the user to click "WhatsApp" to get a custom quote from our admin.
      
      **Rules:**
      - If the user asks for a price, politely suggest they use the "Get Quote" button or WhatsApp us directly at 018-233 5796 for the best latest rate.
      - If asking for "Taxi", politely say we offer "Chauffeur Driven" or "Private Transfer" services which are more comfortable.
      - Always be polite, professional, and helpful. 
      - Direct urgent bookings to WhatsApp.
    `;

    // Query GenAI with both the model name and prompt in one call.
    const response = await ai.models.generateContent({
      model: model,
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    // The text property is a getter, access it directly without calling as a function.
    return response.text || "I apologize, I couldn't generate a response at the moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the server. Please try again later or contact us on WhatsApp.";
  }
};
