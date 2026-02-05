import mongoose, { Schema, Document } from 'mongoose';
import { MessageRole } from '@/lib/ai/types';

interface ICarePlanStep {
    id: string;
    label: string;
    description: string;
    icon?: string;
}

interface ICarePlan {
    title: string;
    steps: ICarePlanStep[];
}

interface IMessage {
    id: string;
    role: MessageRole;
    content: string;
    timestamp: Date;
    carePlan?: ICarePlan;
    attachments?: string[]; // URLs to R2
}

export interface ISession extends Document {
    userId?: string;
    messages: IMessage[];
    createdAt: Date;
    updatedAt: Date;
}

const CarePlanSchema = new Schema<ICarePlan>({
    title: { type: String, required: true },
    steps: [{
        id: String,
        label: String,
        description: String,
        icon: String
    }]
});

const MessageSchema = new Schema<IMessage>({
    id: { type: String, required: true },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    carePlan: { type: CarePlanSchema, required: false },
    attachments: [{ type: String }]
});

const SessionSchema = new Schema<ISession>({
    userId: { type: String, index: true }, // Optional: If we add auth later
    messages: [MessageSchema],
}, { timestamps: true });

// Prevent overwrite on hot reload
export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
