import { Message, CarePlan } from './types';
import { EMERGENCY_KEYWORDS } from './prompts';

// Simulated latency for realism
const SIMULATED_LATENCY_MS = 1500;

interface SimulationResult {
    text: string;
    carePlan?: CarePlan;
}

export async function generateSimulatedResponse(history: Message[]): Promise<SimulationResult> {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_LATENCY_MS));

    const lastMessage = history[history.length - 1];
    const userText = lastMessage?.content.toLowerCase() || "";

    // 1. Safety Check (Rule-based)
    const isEmergency = EMERGENCY_KEYWORDS.some(keyword => userText.includes(keyword));
    if (isEmergency) {
        return {
            text: "🚨 Based on what you're describing, this could be a medical emergency. Please call 911 or go to the nearest Emergency Room immediately. Do not wait. I am switching this device to Emergency Mode."
        };
    }

    // 2. Simple Keyword Matching for Demo Flows
    if (userText.includes("headache")) {
        if (userText.includes("days") || userText.includes("long")) {
            return { text: "I see. Has the pain been constant, or does it come and go? And on a scale of 1-10, how bad is it right now?" };
        }

        // If user answers the "scale" or says "bad", provide plan
        if (userText.includes("bad") || userText.includes("10") || userText.includes("severe") || userText.includes("hurts") || userText.includes("5") || userText.includes("6") || userText.includes("7") || userText.includes("8") || userText.includes("9")) {
            return {
                text: "Given the severity, here is a recommended home care plan while you wait to see a doctor. If it gets worse, please seek help immediately.",
                carePlan: {
                    title: "Acute Headache Relief Protocol",
                    steps: [
                        { id: '1', label: 'Rest', description: 'Lie down in a dark, quiet room.', icon: 'rest' },
                        { id: '2', label: 'Hydrate', description: 'Drink a full glass of water.', icon: 'water' },
                        { id: '3', label: 'Medication', description: 'Take OTC Ibuprofen if not allergic.', icon: 'pill' }
                    ]
                }
            };
        }

        return { text: "I'm sorry to hear your head is hurting. To help me understand better, is the pain on one side, or all over? And do you have any sensitivity to light?" };
    }

    if (userText.includes("fever") || userText.includes("hot")) {
        return { text: "A fever can be draining. have you taken your temperature with a thermometer? If so, what was the reading?" };
    }

    if (userText.includes("stomach") || userText.includes("belly")) {
        return { text: "Stomach pain can be tricky. Is the pain sharp or dull? and does it get worse after eating?" };
    }

    // 3. Greeting / Onboarding
    if (history.length <= 1) {
        return { text: "Hello. I'm HomeDoc. I'm here to help you figure out what's going on. What symptom is bothering you the most right now?" };
    }

    // 4. Default Fallback
    return { text: "I understand. Can you tell me a bit more about that? Specifically, how long has this been happening?" };
}
