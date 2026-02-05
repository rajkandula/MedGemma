'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        dob: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Signup failed');

            toast.success('Successfully Signed Up!', {
                description: 'Please log in with your new credentials.',
                duration: 3000,
            });

            // Wait a moment for the toast to be seen, then redirect
            setTimeout(() => {
                router.push('/login');
            }, 1500);

        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 my-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
                    <p className="text-slate-500">Join MedGemma for personalized care</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                            <input name="username" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input name="fullName" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                            <input type="date" name="dob" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mobile</label>
                            <input type="tel" name="mobile" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" name="email" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input type="password" name="password" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm</label>
                            <input type="password" name="confirmPassword" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" onChange={handleChange} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-teal-600 hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
