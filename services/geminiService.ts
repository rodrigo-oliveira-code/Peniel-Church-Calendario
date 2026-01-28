
import { GoogleGenAI } from "@google/genai";

// Fix: Directly use process.env.API_KEY when initializing GoogleGenAI as per guidelines
const getClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found via process.env.API_KEY");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateEventDescription = async (title: string, sectorName: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Erro: Chave de API não configurada. Por favor, adicione sua chave Gemini.";

  try {
    const prompt = `
      Você é um assistente criativo de liderança de igreja.
      Crie uma descrição atraente, curta e inspiradora para um evento da igreja.
      
      Título do Evento: "${title}"
      Setor/Ministério: "${sectorName}"
      
      A descrição deve ter no máximo 3 frases e incluir um emoji relevante.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Fix: Access .text property directly (it is not a method)
    return response.text || "Não foi possível gerar a descrição.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao contatar a IA. Tente novamente mais tarde.";
  }
};

export const generateBirthdayMessage = async (userName: string): Promise<string> => {
    const ai = getClient();
    if (!ai) return "Parabéns! Deus te abençoe.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Escreva uma mensagem curta de aniversário cristã e encorajadora para ${userName}. Máximo 1 frase.`
        });
        // Fix: Access .text property directly (it is not a method)
        return response.text || `Parabéns ${userName}!`;
    } catch (e) {
        return `Parabéns ${userName}! Deus te abençoe.`;
    }
}
