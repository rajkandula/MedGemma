"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse, Activity, ShieldAlert, User, Pill, Stethoscope, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error) {
            toast.error('Failed to log out');
        }
    };

    const navItems = [
        { href: "/", label: "Home Triage", icon: HeartPulse },
        { href: "/prescriptions", label: "Prescriptions", icon: Pill },
        { href: "/health", label: "Health Monitor", icon: Stethoscope },
        { href: "/profile", label: "My Profile", icon: User },
    ];

    return (
        <aside className="hidden w-80 shrink-0 border-r border-border bg-card p-6 md:flex md:flex-col h-screen sticky top-0">
            <div className="flex items-center gap-3 text-primary mb-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <HeartPulse size={24} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">HomeDoc</h1>
                    <p className="text-xs text-muted-foreground font-medium">Powered by MedGemma</p>
                </div>
            </div>

            <nav className="flex flex-col gap-2">
                <div className="mb-6 px-2">
                    <button
                        onClick={() => {
                            if (window.confirm("Start a new consultation? This will clear your current session.")) {
                                localStorage.removeItem('home-doc-session');
                                window.location.href = '/';
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground p-3 rounded-xl font-bold shadow-md hover:opacity-90 transition"
                    >
                        <HeartPulse size={18} />
                        New Consultation
                    </button>
                </div>

                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl font-medium transition-all",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon size={20} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

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
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 font-medium transition w-full text-left"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
                <div className="text-xs text-muted-foreground text-center mt-2">
                    MedGemma HAI-DEF Challenge 2026
                </div>
            </div>
        </aside>
    );
}
