'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ArrowLeft, User, Mail, Calendar, Phone, Hash } from 'lucide-react';

interface UserProfile {
    username: string;
    fullName: string;
    email: string;
    dob: string;
    mobile: string;
    createdAt: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setUser(data.user);
                } else {
                    router.push('/login');
                }
            })
            .catch(() => router.push('/login'))
            .finally(() => setLoading(false));
    }, [router]);



    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-pulse">Loading Profile...</div></div>;
    }

    if (!user) return null;

    return (
        <div className="flex h-screen w-full flex-col bg-muted/30 md:flex-row">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
                <div className="w-full max-w-3xl mx-auto">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/" className="flex items-center text-slate-600 hover:text-slate-900 transition font-medium">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-xl font-bold text-slate-800">My Profile</h1>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">

                        {/* Left Column: Avatar & Main Info */}
                        <div className="bg-teal-600 p-10 text-center md:w-1/3 flex flex-col items-center justify-center">
                            <div className="w-32 h-32 bg-teal-100 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-xl">
                                <User className="w-16 h-16 text-teal-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1">{user.fullName}</h2>
                            <p className="text-teal-100 font-medium">@{user.username}</p>
                            <div className="mt-6">
                                <span className="bg-teal-700 text-teal-50 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold">Patient</span>
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="p-8 md:p-10 md:w-2/3 space-y-8 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <Mail className="w-4 h-4" />
                                        <span className="text-xs uppercase tracking-wide font-bold">Email Address</span>
                                    </div>
                                    <p className="text-slate-900 font-medium text-lg">{user.email}</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <Phone className="w-4 h-4" />
                                        <span className="text-xs uppercase tracking-wide font-bold">Mobile Number</span>
                                    </div>
                                    <p className="text-slate-900 font-medium text-lg">{user.mobile}</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-xs uppercase tracking-wide font-bold">Date of Birth</span>
                                    </div>
                                    <p className="text-slate-900 font-medium text-lg">{user.dob}</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <Hash className="w-4 h-4" />
                                        <span className="text-xs uppercase tracking-wide font-bold">Username</span>
                                    </div>
                                    <p className="text-slate-900 font-medium text-lg">{user.username}</p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
