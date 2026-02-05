"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Stethoscope, Activity, Heart, Thermometer } from "lucide-react";

export default function HealthPage() {
    return (
        <div className="flex h-screen w-full flex-col bg-muted/30 md:flex-row">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
                <div className="w-full max-w-4xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Stethoscope className="text-teal-600" /> Health Monitoring
                        </h1>
                        <p className="text-slate-500">Track your vitals and health metrics.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                    <Heart size={20} />
                                </div>
                                <span className="font-semibold text-slate-700">Heart Rate</span>
                            </div>
                            <div className="text-3xl font-bold text-slate-900">-- <span className="text-sm font-normal text-slate-400">bpm</span></div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <Activity size={20} />
                                </div>
                                <span className="font-semibold text-slate-700">Blood Pressure</span>
                            </div>
                            <div className="text-3xl font-bold text-slate-900">--/-- <span className="text-sm font-normal text-slate-400">mmHg</span></div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                    <Thermometer size={20} />
                                </div>
                                <span className="font-semibold text-slate-700">Temperature</span>
                            </div>
                            <div className="text-3xl font-bold text-slate-900">-- <span className="text-sm font-normal text-slate-400">°F</span></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Connect Devices</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            Connect your wearables (Apple Watch, Fitbit) to automatically sync your health data.
                        </p>
                        <button className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition">
                            Connect Device
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
