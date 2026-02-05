"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Pill } from "lucide-react";

export default function PrescriptionsPage() {
    return (
        <div className="flex h-screen w-full flex-col bg-muted/30 md:flex-row">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
                <div className="w-full max-w-4xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Pill className="text-teal-600" /> My Prescriptions
                        </h1>
                        <p className="text-slate-500">Manage your active medications and history.</p>
                    </header>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Pill className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">No active prescriptions</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            Your prescription history will appear here once your doctor issues them or you add them manually.
                        </p>
                        <button className="mt-6 px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition">
                            Add Medication
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
