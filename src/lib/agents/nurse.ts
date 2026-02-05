import { AgentContext, AgentResponse } from './types';
import { generateStudioResponse } from '../ai/studio-client';

// Agent 2: The Nurse
// Responsibility: Intake, Triage, Empathy, Gathering Details.

const NURSE_SYSTEM_PROMPT = `
You are "Nurse Sarah", the first point of contact at MedGemma Home Health.
Your goal is to gather information about the patient's current issue with empathy and efficiency.
- Be warm and welcoming.
- Ask clarifying questions (ONE at a time) to understand symptoms, duration, and severity.
- If you suspect a life-threatening emergency (Heart Attack, Stroke, heavy bleeding), STOP and tell them to call 911 immediately.
- Once you have enough details (Symptoms, Duration, Pain Level, History context), say "I have enough information. Let me get the doctor for you."
`;

export async function runNurse(context: AgentContext, userMessage: string): Promise<AgentResponse> {
    console.log("🩺 Nurse: Triaging patient...");

    // This uses the "Fast" Audio/Text model (Gemini 2.5 Flash)
    // We pass the nurse persona + chat history.

    // For now, using the standard generateStudioResponse but with specific prompt injection
    // In full implementation, we'd pass audio inputs here too.

    const messages = [
        { role: 'system' as const, content: NURSE_SYSTEM_PROMPT },
        ...context.history,
        { role: 'user' as const, content: userMessage }
    ];

    // Reuse existing client for now, but conceptually this is Agent 2
    // We need to implement a "custom prompt" capable client function or modify the existing one
    // ideally we modify studio-client to accept system instructions more cleanly

    // Mocking the behavior for the architecture setup phase
    // Real implementation will call the actual model

    return {
        agent: 'nurse',
        text: "I understand. Could you tell me how long you've been feeling this way?", // Dynamic
        statusMessage: "Nurse is reviewing..."
    };
}
