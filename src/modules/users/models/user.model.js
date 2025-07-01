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
        _id: { type: mongoose.Types.ObjectId, required: true },
        message: { type: String, required: true },
        priority: { type: Boolean }
    } ],
    integrations: [ {
        name: { type: String, required: true },
        refreshToken: { type: String, required: true },
        tokenType: { type: String }, // Optional field for token type
        accessToken: { type: String },
        expiresAt: { type: Number },
        scope: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        state: { type: String },
        metadata: { type: String } // Optional field for additional metadata
    } ]
}, { timestamps: true })

export const UserModel = mongoose.model('User', userSchema)