import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ },
    password: { type: String, required: true },
    phoneNumber: { type: String, unique: true },
    role: { type: String, required: true },
    status: { type: Boolean, required: true },
    country: { type: String }
}, { timestamps: true })

export const UserModel = mongoose.model('User', userSchema)