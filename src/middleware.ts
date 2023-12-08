import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken');
    const refreshToken = request.cookies.get('refreshToken');
    const baseURL = request.nextUrl.pathname;
    const url = request.nextUrl.clone();

    if (baseURL === '/pages/login/' && accessToken !== undefined && refreshToken !== undefined) {
        url.pathname = '/'
        return NextResponse.redirect(url);
    }
    if (baseURL !== '/pages/login/' && accessToken === undefined && refreshToken === undefined) {
        url.pathname = '/pages/login/'
        return NextResponse.redirect(url);
    }

    if (accessToken === undefined && refreshToken !== undefined) {
        const response = await fetch('http://localhost:3000/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                "Authorization": `Bearer ${refreshToken}`,
                "cookie": `refreshToken=${refreshToken}`
            },
        });
        if (response.ok) {
            const data = await response.json();
            const setCookieHeaders = [
                `accessToken=${data.accessToken}; Max-Age=${1 * 24 * 60 * 60}; Path=/;`,
                `refreshToken=${data.refreshToken}; Max-Age=${3 * 24 * 60 * 60}; Path=/;`,
            ];
            return NextResponse.next({
                headers: {
                    'Set-Cookie': setCookieHeaders as any,
                },
            });
        } else {
            url.pathname = '/pages/login/'
            const setCookieHeaders = [
                `refreshToken=; Max-Age=${0}; Path=/;`,
            ];
            return NextResponse.redirect(url, {
                headers: {
                    'Set-Cookie': setCookieHeaders as any,
                },
            });
        }
    }
}

export const config = {
    matcher: [
        '/page/login',
        '/',
        '/((?!api|static|.*\\..*|_next).*)'
    ],
};
