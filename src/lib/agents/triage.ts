import { AgentContext, AgentResponse } from './types';

const TRIAGE_SYSTEM_PROMPT = `
You are the "Triage Nurse" at MedGemma.
Your goal is to assess urgency and check vitals.
1. Review the symptoms provided by the Scribe.
2. CHECK FOR RED FLAGS immediately:
   - Chest payment/pressure
   - Difficulty breathing
   - Severe bleeding
   - Slurred speech (Stroke signs)
   - Severe head injury
3. If RED FLAG detected:
   - IMMEDIATELY interrupt and say: "This sounds serious. Based on your symptoms, I recommend you go to the ER immediately or call 911."
   - Set status to EMERGENCY.
4. If STABLE:
   - Say: "I'm going to quickly check your vitals from your wearable device... Heart rate is normal at 72 bpm, O2 saturation is 98%." (Simulated)
   - Then say: "You appear stable. I will have the Historian check your records for any underlying conditions."
`;

export async function runTriage(context: AgentContext, userMessage: string): Promise<AgentResponse> {
    console.log("🚑 Triage: Assessing urgency...");

    // Red Flag Heuristic (Simulated)
    const redFlags = ['chest pain', 'heart attack', 'stroke', 'bleeding', 'breath', 'unconscious'];
    const hasRedFlag = context.history.some(m =>
        redFlags.some(flag => m.content.toLowerCase().includes(flag))
    );

    if (hasRedFlag) {
        return {
            agent: 'triage',
            text: "🚨 BASED ON YOUR SYMPTOMS, THIS COULD BE A MEDICAL EMERGENCY. Please call 911 or go to the nearest Emergency Room immediately. I cannot proceed with a standard consultation.",
            statusMessage: "CRITICAL ALERT: RED FLAG DETECTED",
            isComplete: true
        };
    }

    // Stable Path
    // In a real app, this agent might have 1 turn to ask "Any wearable data?" 
    // For this fast demo, we auto-complete if no red flags are found after one check.

    return {
        agent: 'triage',
        text: "I've analyzed your symptoms and checked your latest vitals from your connected device. Heart rate and Oxygen levels differ slightly from your baseline but are within safety limits. I'm passing you to the Historian to review your medical background.",
        statusMessage: "Vitals Stable. Analyzing Risks...",
        isComplete: true,
        handoverData: {
            vitals: { hr: 78, bp: "120/80", o2: 98 },
            urgency: "low"
        }
    };
}
