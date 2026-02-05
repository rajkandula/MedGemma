import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth/utils';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';

export async function GET(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = await verifySession(token);
    if (!payload) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(payload.userId).select('-passwordHash');

    if (!user) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
}
