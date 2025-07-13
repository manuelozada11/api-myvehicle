import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ },
    picture: { type: String },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    role: { type: String, required: true },
    status: { type: Boolean, required: true },
    country: { type: String },
    rate: {
        rating: { type: Number, default: 0 },
        review: { type: String, default: "" },
        updatedAt: { type: Date, default: Date.now }
    },
    notifications: [ {
        _id: { type: mongoose.Types.ObjectId, default: mongoose.Types.ObjectId },
        message: { type: String, required: true },
        priority: { type: Boolean },
        createdAt: { type: Date, default: Date.now },
        read: { type: Boolean, default: false }
    } ],
    integrations: [ {
        user: {
            _id: { type: mongoose.Types.ObjectId, required: true }
        },
        name: { type: String, required: true },
        userId: { type: String, required: true },
        refreshToken: { type: String, required: true },
        tokenType: { type: String }, // Optional field for token type
        accessToken: { type: String },
        expiresAt: { type: Number },
        scope: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        state: { type: String },
        status: { type: Boolean, default: true }, // Optional field for integration status
        metadata: { type: String } // Optional field for additional metadata
    } ],
    language: { type: String, default: 'es' }
}, { timestamps: true })

export const UserModel = mongoose.model('User', userSchema)