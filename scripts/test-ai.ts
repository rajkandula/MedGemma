import { generateStudioResponse } from '../src/lib/ai/studio-client';
import { config } from 'dotenv';

// Load env vars
config({ path: '.env.local' });

async function test() {
    console.log("Testing AI Client...");
    console.log("API Key present:", !!process.env.GOOGLE_API_KEY);

    if (!process.env.GOOGLE_API_KEY) {
        console.error("❌ No GOOGLE_API_KEY found in .env.local");
        return;
    }

    const history = [{ role: 'user', content: 'Hello, are you working?' }];
    console.log("Sending message...");

    const response = await generateStudioResponse(history);

    console.log("Response:", response);
}

test();
