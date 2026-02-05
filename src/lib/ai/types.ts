export type MessageRole = 'user' | 'assistant' | 'system';

export interface CarePlanStep {
    id: string;
    label: string;
    description: string;
    icon?: 'pill' | 'rest' | 'water' | 'monitor';
}

export interface CarePlan {
    title: string;
    steps: CarePlanStep[];
}

export interface Message {
    id: string;
    role: MessageRole;
    content: string;
    timestamp: Date;
    carePlan?: CarePlan;
    attachments?: string[];
}

export interface TriageState {
    chiefComplaint?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    duration?: string;
    associatedSymptoms: string[];
    vitals?: {
        temperature?: number;
        heartRate?: number;
        oxygenSat?: number;
    };
}

export type AgentAction =
    | { type: 'ASK_QUESTION'; text: string }
    | { type: 'PROVIDE_ADVICE'; text: string; carePlanId?: string }
    | { type: 'ESCALATE_EMERGENCY'; text: string };
