import { z } from 'zod'

// ============================================
// Authentication Schemas
// ============================================

export const signUpSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

export const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    twoFactorCode: z.string().optional(),
})

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

// ============================================
// User Profile Schemas
// ============================================

export const userProfileSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code').optional(),
    phone: z.string().regex(/^\+?1?\d{10,14}$/, 'Invalid phone number').optional(),
    emailForLetters: z.string().email().optional(),
    dateOfBirth: z.string().optional(),
    identityConfirmed: z.boolean(),
    disclaimerAccepted: z.boolean(),
})

// ============================================
// File Upload Schemas
// ============================================

export const uploadConfigSchema = z.object({
    maxFileSizeMB: z.number().default(10),
    maxTotalSizeMB: z.number().default(30),
    maxFilesPerUpload: z.number().default(3),
    allowedMimeTypes: z.array(z.string()).default([
        'application/pdf',
        'image/jpeg',
        'image/png',
        'text/html',
    ]),
})

// ============================================
// Letter Generation Schemas
// ============================================

export const generateLetterSchema = z.object({
    bureau: z.enum(['EQUIFAX', 'EXPERIAN', 'TRANSUNION']).optional(),
    letterType: z.enum(['BUREAU_DISPUTE', 'CREDITOR_DISPUTE', 'DEBT_VALIDATION']),
    disputeCandidateIds: z.array(z.string()),
    includeEnclosures: z.boolean().default(true),
})

export const updateLetterSchema = z.object({
    letterId: z.string(),
    contentHtml: z.string(),
})

// ============================================
// Export Schemas
// ============================================

export const exportRequestSchema = z.object({
    letterIds: z.array(z.string()),
    exportType: z.enum(['PDF', 'DOCX', 'ZIP']),
    includeAnalysisSummary: z.boolean().default(true),
})

// ============================================
// Type Exports
// ============================================

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type UserProfileInput = z.infer<typeof userProfileSchema>
export type UploadConfig = z.infer<typeof uploadConfigSchema>
export type GenerateLetterInput = z.infer<typeof generateLetterSchema>
export type UpdateLetterInput = z.infer<typeof updateLetterSchema>
export type ExportRequestInput = z.infer<typeof exportRequestSchema>
