import { Queue, Worker, Job } from 'bullmq'
import Redis from 'ioredis'

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
})

// ============================================
// Queue Definitions
// ============================================

export const parseReportQueue = new Queue('parse-report', { connection })
export const analyzeReportQueue = new Queue('analyze-report', { connection })
export const generateDocumentsQueue = new Queue('generate-documents', { connection })
export const autoDeleteQueue = new Queue('auto-delete', { connection })

// ============================================
// Job Data Types
// ============================================

export interface ParseReportJobData {
    uploadId: string
    userId: string
    storageKey: string
    mimeType: string
}

export interface AnalyzeReportJobData {
    reportId: string
    userId: string
}

export interface GenerateDocumentsJobData {
    userId: string
    letterIds: string[]
    exportType: 'PDF' | 'DOCX' | 'ZIP'
    includeAnalysisSummary: boolean
}

export interface AutoDeleteJobData {
    uploadId: string
    storageKey: string
}

// ============================================
// Queue Helper Functions
// ============================================

export async function addParseReportJob(data: ParseReportJobData) {
    return parseReportQueue.add('parse-report', data, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
    })
}

export async function addAnalyzeReportJob(data: AnalyzeReportJobData) {
    return analyzeReportQueue.add('analyze-report', data, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
    })
}

export async function addGenerateDocumentsJob(data: GenerateDocumentsJobData) {
    return generateDocumentsQueue.add('generate-documents', data, {
        attempts: 2,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
    })
}

export async function scheduleAutoDelete(data: AutoDeleteJobData, delayDays: number) {
    const delayMs = delayDays * 24 * 60 * 60 * 1000
    return autoDeleteQueue.add('auto-delete', data, {
        delay: delayMs,
    })
}

// ============================================
// Worker Registration (to be called in separate process)
// ============================================

export function registerWorkers() {
    // Workers will be implemented in separate files
    // and registered in a worker process
    console.log('Queue workers should be registered in a separate process')
}
