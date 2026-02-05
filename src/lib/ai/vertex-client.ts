import { GoogleAuth } from 'google-auth-library';
import { AI_CONFIG } from './config';
import { Message } from './types';

// See: https://cloud.google.com/vertex-ai/docs/predictions/get-online-predictions#predict-request
export async function generateVertexResponse(history: Message[]) {
    try {
        const { projectId, location, endpointId } = AI_CONFIG.vertex;

        if (!projectId || !location || !endpointId) {
            throw new Error("Missing Vertex AI Configuration");
        }

        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/cloud-platform'
        });

        const client = await auth.getClient();
        const accessToken = await client.getAccessToken(); // This might return null/res if using defaults

        const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/endpoints/${endpointId}:predict`;

        // MedGemma / Gemma format often uses "inputs" or "instances".
        // This payload structure depends HEAVILY on how the model was deployed (TGI, vLLM, default container).
        // Assuming standard Vertex AI payload for a fine-tuned LLM:

        const prompt = history.map(m => `${m.role}: ${m.content}`).join('\n') + "\nassistant:";

        const payload = {
            instances: [
                {
                    prompt: prompt,
                    max_tokens: 500,
                    temperature: 0.5
                }
            ]
        };

        // Use fetch or the client library. Fetch is easier for Edge/Next.js
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        // Parse response. Usually data.predictions[0]
        let text = "";
        if (data.predictions && data.predictions[0]) {
            // Sometimes it's a string, sometimes an object depending on the serving container
            text = typeof data.predictions[0] === 'string'
                ? data.predictions[0]
                : data.predictions[0].content || JSON.stringify(data.predictions[0]);

            // Clean up "user:" or "assistant:" leak if model repeats it
            text = text.replace(/^assistant:\s*/i, '');
        } else {
            text = "I received a blank response from the specialist module.";
        }

        return {
            text,
            carePlan: undefined
        };

    } catch (error) {
        console.error("Vertex AI Error:", error);
        return {
            text: "I cannot reach the specialist (MedGemma) right now. Please check configuration.",
            carePlan: undefined
        };
    }
}
