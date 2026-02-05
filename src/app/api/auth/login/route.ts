import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { verifyPassword, createSession } from '@/lib/auth/utils';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const { username, password } = body;

        // 1. Validation
        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
        }

        // 2. Find User
        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 3. Verify Password
        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 4. Create Session
        const token = await createSession(user._id.toString());

        const response = NextResponse.json({ success: true, user: { username: user.username } });
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        return response;

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
