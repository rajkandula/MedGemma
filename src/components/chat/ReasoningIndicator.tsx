import { Loader2, Brain, Stethoscope, User, FileText } from 'lucide-react';

interface ReasoningIndicatorProps {
    status: string;
}

export function ReasoningIndicator({ status }: ReasoningIndicatorProps) {
    // Determine icon based on status text
    const getIcon = () => {
        if (status.includes("Nurse")) return <User className="w-4 h-4 text-blue-500 animate-pulse" />;
        if (status.includes("Historian")) return <Brain className="w-4 h-4 text-purple-500 animate-pulse" />;
        if (status.includes("Analyst")) return <FileText className="w-4 h-4 text-orange-500 animate-pulse" />;
        if (status.includes("Dr.")) return <Stethoscope className="w-4 h-4 text-teal-600 animate-pulse" />;
        return <Loader2 className="w-4 h-4 animate-spin text-slate-400" />;
    };

    const getBadges = () => {
        // Simulate the "Tick marks" the user wanted. 
        // In a real socket stream we'd append these live.
        // For now, static based on current agent only shows "Active" + "Done" steps implied.

        // If Doctor is active, implies others are done.
        const isDoctor = status.includes("Dr.");

        return (
            <div className="flex flex-col gap-1 text-[10px] text-slate-400 mt-1 pl-6">
                {isDoctor && (
                    <>
                        <div className="flex items-center gap-1 text-green-600"><span className="text-xs">✓</span> Nurse Triage Complete</div>
                        <div className="flex items-center gap-1 text-green-600"><span className="text-xs">✓</span> History Checked</div>
                        <div className="flex items-center gap-1 text-green-600"><span className="text-xs">✓</span> Analysis Generated</div>
                    </>
                )}
            </div>
        )
    };

    return (
        <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg border border-slate-100 max-w-xs animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                {getIcon()}
                <span>{status}</span>
            </div>
            {getBadges()}
        </div>
    );
}
