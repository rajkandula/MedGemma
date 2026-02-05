export type AgentRole = 'historian' | 'nurse' | 'analyst' | 'doctor';

export interface AgentResponse {
    agent: AgentRole;
    text: string;
    // Specific data for internal handoffs
    handoverData?: any;
    // Status text for the UI (e.g. "Reviewing history...")
    statusMessage?: string;
}

export interface AgentContext {
    userId: string;
    sessionId: string;
    history: any[]; // Full chat history
    medicalSnapshot?: string; // Summary from Historian
    clinicalReport?: any; // Structured report from Analyst
}
