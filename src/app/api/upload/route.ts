import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client, R2_BUCKET_NAME } from '@/lib/storage/r2';

export async function POST(request: NextRequest) {
    try {
        const { filename, contentType } = await request.json();

        if (!filename || !contentType) {
            return NextResponse.json({ error: 'Missing filename or contentType' }, { status: 400 });
        }

        const uniqueKey = `${Date.now()}-${filename.replace(/\s+/g, '-')}`;

        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: uniqueKey,
            ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 60 * 5 }); // 5 minutes

        return NextResponse.json({
            uploadUrl,
            key: uniqueKey,
            publicUrl: `${process.env.R2_PUBLIC_URL}/${uniqueKey}`
        });
    } catch (error) {
        console.error('S3 Presign Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
