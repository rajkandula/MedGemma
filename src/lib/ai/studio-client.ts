import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_CONFIG } from "./config";
import { Message } from "./types";


export async function generateStudioResponse(history: Message[]) {
    try {
        const genAI = new GoogleGenerativeAI(AI_CONFIG.studio.apiKey);
        const model = genAI.getGenerativeModel({ model: AI_CONFIG.studio.model });

        // Convert our Message format to Gemini format
        const chatHistory = history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user', // 'system' role maps to 'user' with context usually, or separate instruction
            parts: [{ text: msg.content }],
        }));

        // The last message is the prompt, previous are history
        // But startChat takes history and we sendMessage the last one
        const previousHistory = chatHistory.slice(0, -1);
        const lastMessage = chatHistory[chatHistory.length - 1];

        const chat = model.startChat({
            history: previousHistory,
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7, // Slightly creative for empathy, but grounded
            },
        });

        const result = await chat.sendMessage(lastMessage.parts[0].text);
        const response = result.response;
        const text = response.text();

        // Simple logic to parse potential care plan JSON if we were prompting for it
        // For now, return text directly
        return {
            text: text,
            carePlan: undefined // We'd need to structured output prompt for this
        }

    } catch (error) {
        console.error("Google AI Studio Error:", error);
        return null;
    }
}
