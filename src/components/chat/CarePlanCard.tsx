import { CarePlan } from "@/lib/ai/types";
import { Pill, Moon, GlassWater, Activity, CheckCircle2 } from "lucide-react";

interface CarePlanCardProps {
    plan: CarePlan;
}

export function CarePlanCard({ plan }: CarePlanCardProps) {
    const getIcon = (iconName?: string) => {
        switch (iconName) {
            case 'pill': return <Pill size={18} />;
            case 'rest': return <Moon size={18} />;
            case 'water': return <GlassWater size={18} />;
            case 'monitor': return <Activity size={18} />;
            default: return <CheckCircle2 size={18} />;
        }
    };

    return (
        <div className="mt-4 overflow-hidden rounded-xl border border-primary/20 bg-card shadow-sm">
            <div className="bg-primary/5 px-4 py-3 border-b border-primary/10">
                <h4 className="font-semibold text-primary">{plan.title}</h4>
            </div>
            <div className="flex flex-col gap-0 divider-y divide-border/40">
                {plan.steps.map((step) => (
                    <div key={step.id} className="flex gap-4 p-4 border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                            {getIcon(step.icon)}
                        </div>
                        <div>
                            <h5 className="font-medium text-sm text-foreground">{step.label}</h5>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
