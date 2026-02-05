import { AgentContext, AgentResponse } from './types';

export async function runHistorian(context: AgentContext): Promise<AgentResponse> {
    console.log("📚 Historian: Analyzing longitudinal records...");

    // Mock accessing a database of past history
    // In a real scenario, this would vector search the user's past medical docs.

    // Simulating finding a condition
    const foundConditions = ["seasonal allergies", "mild asthma"];
    const foundMeds = ["albuterol inhaler"];

    // Check for "contextual risks" based on current symptoms (mock logic)
    // e.g. if user said "breathing" and has "asthma"
    const relevantHistory = foundConditions.join(", ");

    return {
        agent: 'historian',
        text: "I've reviewed your medical history. I see a history of " + relevantHistory + ". I'm flagging this context for the doctor to ensure your current symptoms aren't an exacerbation of these conditions.",
        statusMessage: "History Analyzed. Risks Flagged.",
        handoverData: {
            historySummary: `Patient has ${relevantHistory}. Current meds: ${foundMeds.join(", ")}.`
        },
        isComplete: true
    };
}
