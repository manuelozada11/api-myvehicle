import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
    brand: { type: String },
    model: { type: String },
    year: { type: Number },
    km: { type: Number },
    plateNumber: { type: String, unique: true, required: true },
    user: {
        _id: { type: mongoose.Types.ObjectId, required: true },
    }
}, { timestamps: true });

export const CarModel = mongoose.model('Car', carSchema);