import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Session from '@/lib/db/models/Session';
import { runOnboarding } from '@/lib/agents/onboarding';
import { runScribe } from '@/lib/agents/scribe';
import { runTriage } from '@/lib/agents/triage';
import { runHistorian } from '@/lib/agents/historian';
import { runScheduling } from '@/lib/agents/scheduling';
import { runDoctor } from '@/lib/agents/doctor';
import { AgentContext } from '@/lib/agents/types';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const sessionId = request.nextUrl.searchParams.get('sessionId');

        if (!sessionId) {
            // Create new session
            const newSession = await Session.create({ messages: [] });
            return NextResponse.json({ _id: newSession._id, messages: [] });
        }

        const session = await Session.findById(sessionId);
        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        return NextResponse.json(session);
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const { sessionId, message } = body;

        if (!sessionId || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Save User Message
        const session = await Session.findByIdAndUpdate(
            sessionId,
            { $push: { messages: message } },
            { new: true }
        );

        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // 2. Build Agent Context
        // Retrieve state annotations from session (in a real app, strict state machine in DB)
        // For now, we infer state from the agent history in the messages.
        const messages = session.messages;
        const lastAgentMsg = [...messages].reverse().find((m: any) => m.role === 'assistant');
        const lastAgent = lastAgentMsg?.agentName || 'start';

        const context: AgentContext = {
            userId: session.userId || 'guest',
            sessionId: sessionId,
            history: messages,
            intakeStatus: {
                isRegistered: messages.some((m: any) => m.agentName === 'onboarding' && (m.content.includes('complete') || m.content.includes('transferring'))),
                isTriageComplete: messages.some((m: any) => m.agentName === 'triage'),
                isHistoryReviewed: messages.some((m: any) => m.agentName === 'historian')
            }
        };

        // 3. Orchestration Logic - The "Hand-off" Chain
        let agentResponse;

        // Stage 1: Onboarding
        // If we haven't completed onboarding, stick with onboarding agent.
        if (!context.intakeStatus?.isRegistered) {
            agentResponse = await runOnboarding(context, message.content);
        }
        // Stage 2: Scribe
        // If registered but Scribe hasn't finished (Scribe finishes when it triggers handoff to Triage)
        else if (lastAgent === 'onboarding' || (lastAgent === 'scribe' && !lastAgentMsg.content.includes('Triage'))) {
            agentResponse = await runScribe(context, message.content);
        }
        // Stage 3: Triage
        // If Scribe finished (implied by falling through) but Triage hasn't run
        else if ((lastAgent === 'scribe' && lastAgentMsg.content.includes('Triage')) || (lastAgent === 'triage' && !context.intakeStatus?.isTriageComplete)) {
            // Triage is a "one-shot" or short interaction usually
            agentResponse = await runTriage(context, message.content);
        }
        // Stage 4: Historian
        // If Triage stable but Historian hasn't run
        else if (lastAgent === 'triage' && !context.intakeStatus?.isHistoryReviewed) {
            agentResponse = await runHistorian(context);
        }
        // Stage 5: Scheduling -> Doctor
        // If History done, do Scheduling then Doctor
        else if (lastAgent === 'historian') {
            agentResponse = await runScheduling(context);
        }
        else if (lastAgent === 'scheduling') {
            // Wake the Doctor
            agentResponse = await runDoctor(context);
        }
        else {
            // Default: Doctor continues conversation
            agentResponse = await runDoctor(context);
        }

        // 4. Save Agent Response
        const aiMsg = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: agentResponse.text,
            timestamp: new Date(),
            agentName: agentResponse.agent
        };

        await Session.findByIdAndUpdate(
            sessionId,
            { $push: { messages: aiMsg } }
        );

        return NextResponse.json({
            success: true,
            aiMessage: aiMsg,
            agentStatus: agentResponse.statusMessage
        });

    } catch (error) {
        console.error('Chat Processing Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
