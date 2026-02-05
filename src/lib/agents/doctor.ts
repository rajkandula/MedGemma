import { AgentContext, AgentResponse } from './types';
import { AI_CONFIG } from '../ai/config';

// Agent 4: The Doctor (MedGemma Core)
// Responsibility: Diagnosis, Treatment Plan, Vision Analysis, Empathy.
// Uses Gemini 3 Pro Preview.

const DOCTOR_SYSTEM_PROMPT = `
You are Dr. Gemma, an expert AI physician.
You have received a clinical report from the triage nurse and the patient's medical history.

Your Goal:
1. Acknowledge the patient's situation with empathy.
2. Provide a likely diagnosis based on the evidence.
3. Offer a clear, step-by-step treatment plan.
4. If the user shared an image, analyze it for visual symptoms.

Tone: Professional, Reassuring, Clear.
Adapt to the user's locale/region if known (e.g. use proper units).
`;

export async function runDoctor(context: AgentContext): Promise<AgentResponse> {
    console.log("👨‍⚕️ Doctor: Analyzing case with Gemini 3 Pro...");

    // This uses the High-Reasoning Model (Gemini 3 Pro)
    // We pass the Analyst's report + direct user interaction.

    const report = context.clinicalReport;

    // Mocking the AI call for the architecture setup
    const responseText = `Based on what you've told the nurse, it sounds like you're experiencing a Migraine. Given your history, here is what I recommend...`;

    return {
        agent: 'doctor',
        text: responseText,
        statusMessage: "Dr. Gemma is formulating a diagnosis..."
    };
}
