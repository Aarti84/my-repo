import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a unique username"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    entity: String,
    shareholders: String,
    directors: String,
    officers: String,
    subsidiaries: String,
    profile: String,
});

export default mongoose.model('User', UserSchema);
