import { Message } from "@/lib/ai/types";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { CarePlanCard } from "./CarePlanCard";

interface MessageBubbleProps {
    message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isAi = message.role === "assistant";

    return (
        <div
            className={cn(
                "flex w-full gap-3 p-4",
                isAi ? "justify-start" : "justify-end"
            )}
        >
            {isAi && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                    <Bot size={16} />
                </div>
            )}

            <div className="flex flex-col gap-2 max-w-[85%] md:max-w-[70%]">
                <div
                    className={cn(
                        "rounded-2xl px-5 py-3 text-base shadow-sm ring-1 ring-inset",
                        isAi
                            ? "rounded-tl-none bg-card text-card-foreground ring-border/50"
                            : "rounded-tr-none bg-primary text-primary-foreground ring-primary/50"
                    )}
                >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>

                {isAi && message.carePlan && (
                    <CarePlanCard plan={message.carePlan} />
                )}

                <span className={cn(
                    "block text-[10px] opacity-70 px-1",
                    isAi ? "text-left" : "text-right"
                )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {!isAi && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <User size={16} />
                </div>
            )}
        </div>
    );
}
