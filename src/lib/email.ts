import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false,
    auth: process.env.EMAIL_SERVER_USER ? {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    } : undefined,
})

export interface EmailOptions {
    to: string
    subject: string
    html: string
    text?: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
    // In development, log to console instead of sending
    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_SERVER_HOST) {
        console.log('📧 Email (Development Mode):')
        console.log(`To: ${options.to}`)
        console.log(`Subject: ${options.subject}`)
        console.log(`Body: ${options.text || options.html}`)
        return
    }

    await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@creditrepair.app',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
    })
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
    const verifyUrl = `${process.env.APP_URL}/auth/verify-email?token=${token}`

    await sendEmail({
        to: email,
        subject: 'Verify your email address',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to ${process.env.APP_NAME || 'Credit Repair Workflow'}!</h2>
        <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
        <p style="margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email Address
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${verifyUrl}</p>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          This link will expire in 24 hours. If you didn't create an account, please ignore this email.
        </p>
      </div>
    `,
        text: `Welcome to ${process.env.APP_NAME || 'Credit Repair Workflow'}! Please verify your email by visiting: ${verifyUrl}`,
    })
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.APP_URL}/auth/reset-password?token=${token}`

    await sendEmail({
        to: email,
        subject: 'Reset your password',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Click the link below to create a new password:</p>
        <p style="margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
        </p>
      </div>
    `,
        text: `Reset your password by visiting: ${resetUrl}`,
    })
}

export async function send2FACode(email: string, code: string): Promise<void> {
    await sendEmail({
        to: email,
        subject: 'Your 2FA code',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Two-Factor Authentication</h2>
        <p>Your verification code is:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 30px 0; text-align: center; color: #4F46E5;">
          ${code}
        </p>
        <p style="color: #666; font-size: 14px;">
          This code will expire in 10 minutes. If you didn't request this code, please secure your account immediately.
        </p>
      </div>
    `,
        text: `Your 2FA code is: ${code}`,
    })
}
