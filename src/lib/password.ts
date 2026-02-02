import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
}

export function generateToken(length: number = 32): string {
    // Use Web Crypto API if available (Edge compatible), otherwise fallback
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const array = new Uint8Array(length)
        crypto.getRandomValues(array)
        return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
    } else {
        // Fallback for Node (dynamic import to avoid static analyis issues in Edge?)
        // Or just use a simple math random for compilation sake if strict edge env
        // But bcryptjs usually handles its own random.
        // Let's use a simple hex generator to be safe for token generation in edge
        const chars = '0123456789abcdef'
        let token = ''
        for (let i = 0; i < length * 2; i++) {
            token += chars[Math.floor(Math.random() * chars.length)]
        }
        return token
    }
}

export function generateOTP(length: number = 6): string {
    const digits = '0123456789'
    let otp = ''
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)]
    }
    return otp
}
