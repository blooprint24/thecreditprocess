import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db'
import { verifyPassword } from '@/lib/password'
import { authConfig } from '@/lib/auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
                twoFactorCode: { label: '2FA Code', type: 'text', optional: true },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required')
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                    include: { profile: true },
                })

                if (!user || user.deletedAt) {
                    throw new Error('Invalid email or password')
                }

                if (!user.emailVerified) {
                    throw new Error('Please verify your email before logging in')
                }

                const isValidPassword = await verifyPassword(
                    credentials.password as string,
                    user.password
                )

                if (!isValidPassword) {
                    throw new Error('Invalid email or password')
                }

                // Check 2FA if enabled
                if (user.twoFactorEnabled) {
                    if (!credentials.twoFactorCode) {
                        throw new Error('2FA code is required')
                    }

                    // Verify 2FA code
                    const twoFactorToken = await prisma.verificationToken.findFirst({
                        where: {
                            userId: user.id,
                            type: 'TWO_FACTOR',
                            token: credentials.twoFactorCode as string,
                            expires: { gt: new Date() },
                        },
                    })

                    if (!twoFactorToken) {
                        throw new Error('Invalid or expired 2FA code')
                    }

                    // Delete used token using a separate transaction or just async
                    // Note: In strict Edge, this might fail, but authorize is Node compatible in v5
                    await prisma.verificationToken.delete({
                        where: { id: twoFactorToken.id },
                    })
                }

                // Log successful login
                await prisma.auditLog.create({
                    data: {
                        userId: user.id,
                        action: 'LOGIN',
                        resourceType: 'User',
                        resourceId: user.id,
                    },
                })

                return {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.profile?.fullName || null,
                }
            },
        }),
    ],
    events: {
        async signOut({ token }) {
            if (token?.id) {
                // This runs in Node runtime for API routes
                try {
                    // We need to re-import prisma here locally if passing it from context issues arise
                    // but usually it's fine in events if they run in node
                    const { prisma } = await import('@/lib/db')
                    await prisma.auditLog.create({
                        data: {
                            userId: token.id as string,
                            action: 'LOGOUT',
                            resourceType: 'User',
                            resourceId: token.id as string,
                        },
                    })
                } catch (error) {
                    console.error('Logout audit log error:', error)
                }
            }
        },
    },
})
