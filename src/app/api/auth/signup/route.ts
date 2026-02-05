import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { hashPassword, createSession } from '@/lib/auth/utils';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const { username, fullName, dob, email, mobile, password, confirmPassword } = body;

        // 1. Validation
        if (!username || !fullName || !dob || !email || !mobile || !password || !confirmPassword) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
        }

        // 2. Check Exists
        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing) {
            return NextResponse.json({ error: 'Username or Email already exists' }, { status: 409 });
        }

        // 3. Create User
        const passwordHash = await hashPassword(password);
        const user = await User.create({
            username, fullName, dob, email, mobile, passwordHash
        });

        // 4. Return Success (No auto-login)
        return NextResponse.json({ success: true, user: { username } });

    } catch (error) {
        console.error('Signup Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
