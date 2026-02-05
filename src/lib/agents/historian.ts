import { AgentContext, AgentResponse } from './types';

// Agent 1: The Historian
// Responsibility: Long-term memory, summarization, providing context.

export async function runHistorian(context: AgentContext): Promise<AgentResponse> {
    console.log("📚 Historian: Retrieving medical history...");

    // In a real app, this would query the DB for past sessions and summaries.
    // Simulating a history retrieval.
    const historySummary = `
    - Patient Name: [User Name]
    - Age: 34
    - Established Care: 2024
    - Chronic Conditions: None known.
    - Allergies: Penicillin (Mild rash).
    - Past Visits:
        - Jan 2025: Treated for acute bronchitis. Prescribed Albuterol inhaler.
        - Dec 2025: Routine checkup. BP 120/80.
    `;

    return {
        agent: 'historian',
        text: "History retrieved.",
        handoverData: { historySummary },
        statusMessage: "Consulting medical history..."
    };
}
