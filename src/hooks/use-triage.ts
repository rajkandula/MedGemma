"use client";

import { useState, useCallback, useEffect } from "react";
import { Message } from "@/lib/ai/types";

export function useTriage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [agentStatus, setAgentStatus] = useState<string>("");

    // Load Session
    useEffect(() => {
        const storedSession = localStorage.getItem('home-doc-session');

        const fetchSession = async () => {
            let url = '/api/chat';
            if (storedSession) {
                url += `?sessionId=${storedSession}`;
            }

            try {
                const res = await fetch(url);
                const data = await res.json();

                if (data._id) {
                    setSessionId(data._id);
                    localStorage.setItem('home-doc-session', data._id);
                    if (data.messages && data.messages.length > 0) {
                        setMessages(data.messages.map((m: any) => ({
                            ...m,
                            timestamp: new Date(m.timestamp)
                        })));
                    } else {
                        setMessages([{
                            id: "init-1",
                            role: "assistant",
                            content: "Hello. I'm HomeDoc. I'm here to help you figure out what's going on. What symptom is bothering you the most right now?",
                            timestamp: new Date(),
                        }]);
                    }
                }
            } catch (e) {
                console.error("Failed to load session", e);
            }
        }

        fetchSession();
    }, []);

    const sendMessage = useCallback(async (content: string, attachments: string[] = []) => {
        if ((!content.trim() && attachments.length === 0) || !sessionId) return;

        // 1. Add User Message (Optimistic)
        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content,
            attachments, // Attachments URL string array
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setIsTyping(true);
        setAgentStatus("Nurse Sarah is ensuring safety...");

        // Simulate status progression
        const statusInterval = setInterval(() => {
            setAgentStatus(prev => {
                if (prev.includes("Nurse")) return "Historian is checking records...";
                if (prev.includes("Historian")) return "Dr. Gemma is analyzing...";
                return prev;
            });
        }, 2000);

        try {
            // Save User Message to DB & Get AI Response
            const res = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({ sessionId, message: userMsg })
            });

            const data = await res.json();
            clearInterval(statusInterval);

            if (data.aiMessage) {
                const aiMsg: Message = {
                    ...data.aiMessage,
                    timestamp: new Date(data.aiMessage.timestamp)
                };
                setMessages((prev) => [...prev, aiMsg]);
            }

            if (data.agentStatus) {
                setAgentStatus(data.agentStatus);
            } else {
                setAgentStatus("");
            }

        } catch (error) {
            console.error("Failed to generate response:", error);
            clearInterval(statusInterval);
            setAgentStatus("Connection Error");
        } finally {
            setIsTyping(false);
        }
    }, [messages, sessionId]);

    const uploadFile = async (file: File) => {
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: JSON.stringify({ filename: file.name, contentType: file.type })
            });
            const { uploadUrl, publicUrl } = await res.json();

            await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type }
            });

            return publicUrl;
        } catch (e) {
            console.error("Upload failed", e);
            return null;
        }
    };

    const clearSession = () => {
        setSessionId(null);
        setMessages([]);
        localStorage.removeItem('home-doc-session');
        // Refresh to get a new ID from the hook's useEffect or trigger re-fetch
        window.location.reload();
    };

    return {
        messages,
        isTyping,
        agentStatus,
        sendMessage,
        uploadFile,
        clearSession
    };
}
