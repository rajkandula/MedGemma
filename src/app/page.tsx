"use client";

import { useRef, useEffect } from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { ReasoningIndicator } from "@/components/chat/ReasoningIndicator"; // New Import
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useTriage } from "@/hooks/use-triage";
import { ShieldAlert, HeartPulse, Activity, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const { messages, isTyping, agentStatus, sendMessage, uploadFile } = useTriage();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex h-screen w-full flex-col bg-muted/30 md:flex-row">
      {/* Sidebar (Desktop) */}
      <aside className="hidden w-80 shrink-0 border-r border-border bg-card p-6 md:flex md:flex-col">
        <div className="flex items-center gap-3 text-primary">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <HeartPulse size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">HomeDoc</h1>
            <p className="text-xs text-muted-foreground font-medium">Powered by MedGemma</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <h3 className="flex items-center gap-2 font-semibold text-primary">
              <Activity size={16} /> Status: Online
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Local AI Model Loaded. <br />
              Privacy Mode: <span className="text-green-600 font-bold">Active</span>
            </p>
          </div>

          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <h3 className="flex items-center gap-2 font-semibold text-destructive">
              <ShieldAlert size={16} /> Emergency
            </h3>
            <p className="mt-1 text-sm text-destructive/80">
              If this is a life-threatening emergency, call 911 immediately.
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <Link href="/profile" className="flex items-center gap-2 p-3 rounded-xl hover:bg-muted text-sm font-medium transition text-muted-foreground hover:text-foreground">
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <User size={16} />
            </div>
            <div>
              p. My Profile
            </div>
          </Link>
          <div className="text-xs text-muted-foreground text-center mt-2">
            MedGemma HAI-DEF Challenge 2026
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col overflow-hidden relative">
        {/* Mobile Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:hidden">
          <div className="flex items-center gap-2 font-bold text-primary">
            <HeartPulse size={20} /> HomeDoc
          </div>
          <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold">
            Secure
          </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-2xl flex flex-col gap-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MessageBubble message={msg} />
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pl-4 pb-4"
              >
                <ReasoningIndicator status={agentStatus} />
              </motion.div>
            )}
            <div ref={bottomRef} className="h-1" />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border">
          <div className="mx-auto max-w-2xl">
            <ChatInput onSend={sendMessage} onUpload={uploadFile} disabled={isTyping} />
            <p className="mt-2 text-center text-xs text-muted-foreground">
              HomeDoc is an AI assistant. Medical advice should always be verified by a professional.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
