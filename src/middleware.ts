import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth/utils';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    const { pathname } = request.nextUrl;

    // 1. Auth Pages (Login/Signup) - Redirect to Home if logged in
    if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
        if (token && await verifySession(token)) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // 2. Public Assets - Allow access
    if (
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/_next') ||
        pathname.includes('.') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    // 3. Protected Pages (Home, etc) - Redirect to Login if not logged in
    if (!token || !(await verifySession(token))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
