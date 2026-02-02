/**
 * PII Redaction Utilities
 * Removes or masks sensitive personally identifiable information
 */

// SSN patterns
const SSN_PATTERNS = [
    /\b\d{3}-\d{2}-\d{4}\b/g,  // 123-45-6789
    /\b\d{9}\b/g,               // 123456789
]

// Account number patterns (keep last 4)
const ACCOUNT_PATTERN = /\b\d{4,}\b/g

// Date of birth patterns
const DOB_PATTERNS = [
    /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,  // MM/DD/YYYY
    /\b\d{4}-\d{2}-\d{2}\b/g,           // YYYY-MM-DD
]

export function redactSSN(text: string): string {
    let redacted = text
    for (const pattern of SSN_PATTERNS) {
        redacted = redacted.replace(pattern, '***-**-****')
    }
    return redacted
}

export function maskAccountNumber(accountNumber: string): string {
    if (accountNumber.length <= 4) {
        return accountNumber
    }
    return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4)
}

export function redactAccountNumbers(text: string): string {
    return text.replace(ACCOUNT_PATTERN, (match) => {
        if (match.length <= 4) return match
        return '*'.repeat(match.length - 4) + match.slice(-4)
    })
}

export function redactDOB(text: string): string {
    let redacted = text
    for (const pattern of DOB_PATTERNS) {
        redacted = redacted.replace(pattern, '[DOB REDACTED]')
    }
    return redacted
}

export function redactPII(text: string): string {
    let redacted = text
    redacted = redactSSN(redacted)
    redacted = redactDOB(redacted)
    // Note: Account numbers are handled separately to preserve last 4
    return redacted
}

export function extractLast4(accountNumber: string): string {
    const cleaned = accountNumber.replace(/\D/g, '')
    return cleaned.slice(-4)
}

export function sanitizeForLLM(text: string): string {
    // More aggressive redaction for LLM prompts
    let sanitized = redactPII(text)

    // Redact email addresses partially
    sanitized = sanitized.replace(
        /([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g,
        (match, user, domain) => {
            const maskedUser = user.length > 2
                ? user[0] + '*'.repeat(user.length - 2) + user[user.length - 1]
                : user
            return `${maskedUser}@${domain}`
        }
    )

    return sanitized
}

export function sanitizeForLogs(text: string): string {
    // Most aggressive redaction for logs
    let sanitized = redactPII(text)

    // Fully redact emails
    sanitized = sanitized.replace(
        /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/g,
        '[EMAIL REDACTED]'
    )

    // Redact phone numbers
    sanitized = sanitized.replace(
        /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
        '[PHONE REDACTED]'
    )

    return sanitized
}
