export const AI_CONFIG = {
    // Toggle between 'simulated', 'studio' (Google AI Studio), and 'vertex' (MedGemma)
    provider: (process.env.AI_PROVIDER || 'simulated') as 'simulated' | 'studio' | 'vertex',

    studio: {
        apiKey: process.env.GOOGLE_API_KEY || "",
        // Core Reasoning & Vision Model
        model: "gemini-3-pro-preview",
        // Voice Input (STT) Codec
        audioModel: "gemini-2.5-flash-native-audio-preview-12-2025",
        // Voice Output (TTS) Model
        ttsModel: "gemini-2.5-pro-preview-tts",
    },

    vertex: {
        projectId: process.env.VERTEX_PROJECT_ID || "med-gemma-486103",
        location: process.env.VERTEX_LOCATION || "us-central1",
        endpointId: process.env.VERTEX_ENDPOINT_ID || "",
    }
};
