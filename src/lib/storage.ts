import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.AWS_S3_ENDPOINT || undefined,
    forcePathStyle: !!process.env.AWS_S3_ENDPOINT, // Required for MinIO
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'credit-repair-uploads'

export interface UploadResult {
    storageKey: string
    url: string
}

export async function uploadFile(
    file: Buffer,
    filename: string,
    mimeType: string,
    userId: string
): Promise<UploadResult> {
    const fileExtension = filename.split('.').pop()
    const storageKey = `uploads/${userId}/${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${fileExtension}`

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: storageKey,
        Body: file,
        ContentType: mimeType,
        ServerSideEncryption: 'AES256',
        Metadata: {
            originalFilename: filename,
            userId,
        },
    })

    await s3Client.send(command)

    return {
        storageKey,
        url: await getPresignedDownloadUrl(storageKey),
    }
}

export async function getPresignedDownloadUrl(storageKey: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: storageKey,
    })

    return getSignedUrl(s3Client, command, { expiresIn })
}

export async function getPresignedUploadUrl(
    filename: string,
    mimeType: string,
    userId: string,
    expiresIn: number = 3600
): Promise<{ url: string; storageKey: string }> {
    const fileExtension = filename.split('.').pop()
    const storageKey = `uploads/${userId}/${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${fileExtension}`

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: storageKey,
        ContentType: mimeType,
        ServerSideEncryption: 'AES256',
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn })

    return { url, storageKey }
}

export async function downloadFile(storageKey: string): Promise<Buffer> {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: storageKey,
    })

    const response = await s3Client.send(command)
    const stream = response.Body as any

    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = []
        stream.on('data', (chunk: Buffer) => chunks.push(chunk))
        stream.on('error', reject)
        stream.on('end', () => resolve(Buffer.concat(chunks)))
    })
}

export async function deleteFile(storageKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: storageKey,
    })

    await s3Client.send(command)
}

export async function uploadExport(
    content: Buffer,
    filename: string,
    mimeType: string,
    userId: string
): Promise<UploadResult> {
    const fileExtension = filename.split('.').pop()
    const storageKey = `exports/${userId}/${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${fileExtension}`

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: storageKey,
        Body: content,
        ContentType: mimeType,
        ServerSideEncryption: 'AES256',
        Metadata: {
            filename,
            userId,
        },
    })

    await s3Client.send(command)

    return {
        storageKey,
        url: await getPresignedDownloadUrl(storageKey, 86400), // 24 hours for exports
    }
}
