import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Session from '@/lib/db/models/Session';
import { runHistorian } from '@/lib/agents/historian';
import { runNurse } from '@/lib/agents/nurse';
import { runDoctor } from '@/lib/agents/doctor';
import { runAnalyst } from '@/lib/agents/analyst';
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
        const context: AgentContext = {
            userId: session.userId || 'guest',
            sessionId: sessionId,
            history: session.messages
        };

        // 3. Orchestration Logic

        // Step A: Historian retrieves context (Always runs)
        const historyRes = await runHistorian(context);
        context.medicalSnapshot = historyRes.handoverData.historySummary;

        let agentResponse;

        // Simple logic: If short history, Nurse talks. If long, Doctor talks.
        if (session.messages.length < 5) {
            agentResponse = await runNurse(context, message.content);
        } else if (session.messages.length === 5) {
            // Trigger Analyst Handover
            const analystRes = await runAnalyst(context);
            context.clinicalReport = analystRes.handoverData;
            // Then wake Doctor
            agentResponse = await runDoctor(context);
        } else {
            // Doctor continues
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
