import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const token = searchParams.get('token')

        if (!token) {
            return NextResponse.json(
                { error: 'Verification token is required' },
                { status: 400 }
            )
        }

        // Find verification token
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
            include: { user: true },
        })

        if (!verificationToken) {
            return NextResponse.json(
                { error: 'Invalid verification token' },
                { status: 400 }
            )
        }

        if (verificationToken.expires < new Date()) {
            return NextResponse.json(
                { error: 'Verification token has expired' },
                { status: 400 }
            )
        }

        if (verificationToken.type !== 'EMAIL_VERIFICATION') {
            return NextResponse.json(
                { error: 'Invalid token type' },
                { status: 400 }
            )
        }

        // Update user email verified status
        await prisma.user.update({
            where: { id: verificationToken.userId },
            data: { emailVerified: new Date() },
        })

        // Delete verification token
        await prisma.verificationToken.delete({
            where: { id: verificationToken.id },
        })

        // Log email verification
        await prisma.auditLog.create({
            data: {
                userId: verificationToken.userId,
                action: 'EMAIL_VERIFIED',
                resourceType: 'User',
                resourceId: verificationToken.userId,
            },
        })

        return NextResponse.json({
            message: 'Email verified successfully. You can now log in.',
        })
    } catch (error) {
        console.error('Email verification error:', error)
        return NextResponse.json(
            { error: 'An error occurred during email verification' },
            { status: 500 }
        )
    }
}
