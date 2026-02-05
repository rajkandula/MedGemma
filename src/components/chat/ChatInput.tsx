import { Send, Paperclip, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
    onSend: (text: string, attachments: string[]) => void;
    onUpload?: (file: File) => Promise<string | null>;
    disabled?: boolean;
}

export function ChatInput({ onSend, onUpload, disabled }: ChatInputProps) {
    const [input, setInput] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || disabled || isUploading) return;
        onSend(input, []);
        setInput("");
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !onUpload) return;

        setIsUploading(true);
        const url = await onUpload(file);
        setIsUploading(false);

        if (url) {
            onSend("", [url]);
        }

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="relative flex items-center gap-2 rounded-full border border-border bg-card p-2 pl-4 shadow-sm focus-within:ring-2 focus-within:ring-primary/20"
        >
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a symptom..."
                className="flex-1 bg-transparent py-2 text-base outline-none placeholder:text-muted-foreground"
                disabled={disabled || isUploading}
            />

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,application/pdf"
            />

            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="group flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                title="Attach File"
            >
                {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Paperclip size={20} />}
            </button>

            <button
                type="submit"
                disabled={!input.trim() || disabled || isUploading}
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                    (disabled || isUploading) && "bg-muted text-muted-foreground"
                )}
            >
                <Send size={18} />
            </button>
        </form>
    );
}
