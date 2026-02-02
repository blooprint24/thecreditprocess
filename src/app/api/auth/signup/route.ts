import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, generateToken } from '@/lib/password'
import { sendVerificationEmail } from '@/lib/email'
import { signUpSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate input
        const validatedData = signUpSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await hashPassword(validatedData.password)

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                password: hashedPassword,
            },
        })

        // Generate verification token
        const token = generateToken()
        await prisma.verificationToken.create({
            data: {
                userId: user.id,
                token,
                type: 'EMAIL_VERIFICATION',
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            },
        })

        // Send verification email
        await sendVerificationEmail(user.email, token)

        // Log signup
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'SIGNUP',
                resourceType: 'User',
                resourceId: user.id,
            },
        })

        return NextResponse.json({
            message: 'Account created successfully. Please check your email to verify your account.',
            userId: user.id,
        })
    } catch (error: any) {
        console.error('Signup error:', error)

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'An error occurred during signup' },
            { status: 500 }
        )
    }
}
