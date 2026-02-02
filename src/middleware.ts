import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

// Define public routes that don't require authentication
const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/verify-email',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/privacy',
    '/terms',
]

// Define API routes that don't require authentication
const publicApiRoutes = [
    '/api/auth',
]

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if the route is public
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
    const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route))

    if (isPublicRoute || isPublicApiRoute) {
        return NextResponse.next()
    }

    // Check authentication for protected routes
    const session = await auth()

    if (!session && (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding'))) {
        const url = new URL('/auth/login', request.url)
        url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
    }

    // Check if user has completed onboarding
    if (session && pathname.startsWith('/dashboard')) {
        // This would check if profile is complete
        // For now, we'll allow access
    }

    // Add security headers
    const response = NextResponse.next()

    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
