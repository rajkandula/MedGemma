import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    fullName: string;
    dob: string;
    email: string;
    mobile: string;
    passwordHash: string;
    createdAt: Date;
}

// Check if model already exists to prevent overwrite during hot reload
const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    dob: { type: String, required: true }, // Format: YYYY-MM-DD
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
