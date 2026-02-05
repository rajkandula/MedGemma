import { AgentContext, AgentResponse } from './types';

const SCRIBE_SYSTEM_PROMPT = `
You are the "Medical Scribe" at MedGemma. 
Your goal is to conduct a 'Review of Systems' and generate a History of Present Illness (HPI).
1. Ask "What brings you in today?" if not already stated.
2. Ask clarifying questions ONE BY ONE to understand:
   - Onset (When did it start?)
   - Location (Where is the pain?)
   - Duration (Constant or intermittent?)
   - Character (Sharp, dull, throbbing?)
   - Alleviating/Aggravating factors (What makes it better/worse?)
   - Radiation (Does the pain move?)
   - Severity (1-10 scale)
   (Mnemonic: OLDCARTS)
3. Do NOT diagnose. Just collect facts.
4. Keep it conversational but professional.
5. Once you have a clear picture (at least 3-4 data points), conclude by saying "I have noted your symptoms. I will now pass this to the Triage Nurse for vital sign analysis."
`;

export async function runScribe(context: AgentContext, userMessage: string): Promise<AgentResponse> {
    console.log("📝 Scribe: Recording symptoms...");

    // Basic heuristic to detect if we have enough info to move on
    // In a real LLM call, we would ask the model to output a functional token like [HANDOFF]
    const historyLength = context.history.length;

    // For this prototype, let's assume if the scribe has exchanged at least 3 messages, we are done.
    // Or if the user says "that's all" or "nothing else".
    const scribeMessages = context.history.filter(m => m.agentName === 'scribe');
    const isDone = scribeMessages.length >= 3 || userMessage.toLowerCase().includes('thats all') || userMessage.toLowerCase().includes('that is all');

    if (isDone) {
        return {
            agent: 'scribe',
            text: "I have recorded your symptoms. Connecting you to the Triage & Vitality agent now to check your vitals.",
            statusMessage: "Symptom Review Complete",
            isComplete: true,
            handoverData: {
                hpi: "Patient reports symptoms with recorded history." // In real app, LLM summarizes this
            }
        };
    }

    // Mock response logic for the Scribe (to be replaced by actual LLM call)
    // We can just simulate the flow for the demo speed
    let reply = "Could you tell me more about what brings you in today?";

    if (userMessage.includes('pain') || userMessage.includes('hurt')) {
        reply = "I see. On a scale of 1 to 10, how severe is the pain?";
    } else if (/\d/.test(userMessage) && (userMessage.includes('day') || userMessage.includes('hour'))) {
        reply = "And is the feeling constant, or does it come and go?";
    } else if (historyLength > 2) {
        reply = "Does anything specific make it better or worse?";
    }

    // Fallback if we want to force the conversation forward for the user
    return {
        agent: 'scribe',
        text: reply,
        statusMessage: "Scribe is documenting..."
    };
}
