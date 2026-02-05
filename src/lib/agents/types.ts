export type AgentRole = 'onboarding' | 'scribe' | 'triage' | 'historian' | 'analyst' | 'doctor' | 'scheduling';

export interface AgentResponse {
    agent: AgentRole;
    text: string;
    // Specific data for internal handoffs
    handoverData?: any;
    // Status text for the UI (e.g. "Reviewing history...")
    statusMessage?: string;
    // Helper to terminate session or loop
    isComplete?: boolean;
}

export interface AgentContext {
    userId: string;
    sessionId: string;
    history: any[]; // Full chat history
    medicalSnapshot?: string; // Summary from Historian
    clinicalReport?: any; // Structured report from Analyst
    // New context fields
    userProfile?: any;
    vitals?: {
        heartRate?: number;
        oxygenLevel?: number;
        bloodPressure?: string;
    };
    intakeStatus?: {
        isRegistered: boolean;
        isTriageComplete: boolean;
        isHistoryReviewed: boolean;
    };
}
