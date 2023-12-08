import { NextResponse, type NextRequest } from 'next/server';
import { parseCookies } from 'nookies'

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')
    const refreshToken = request.cookies.get('refreshToken')
    const baseURL = request.nextUrl.pathname;
    const url = request.nextUrl.clone()

    if (baseURL === '/pages/login/' && accessToken !== undefined && refreshToken !== undefined) {
        url.pathname = '/'
        return NextResponse.redirect(url);
    }
    if (baseURL !== '/pages/login/' && accessToken === undefined && refreshToken === undefined) {
        url.pathname = '/pages/login/'
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: [
        '/page/login',
        '/',
        '/((?!api|static|.*\\..*|_next).*)'
    ],
};
