import { S3Client } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    // In demo mode or if env vars missing, we should probably warn but let build pass
    console.warn("R2 Credentials missing. File upload will fail.");
}

export const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID || "",
        secretAccessKey: R2_SECRET_ACCESS_KEY || "",
    },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "medi-gamma";
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://pub-e8ae394edb9cffb6d1cb759d3e190f2b.r2.dev"; // Fallback demo url
