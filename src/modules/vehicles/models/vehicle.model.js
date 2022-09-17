import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    name: { type: String },
    manufacture: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number },
    displacement: { type: Number },
    plateNumber: { type: String, unique: true },
    type: { type: String, enum: ['hybrid', 'gasoline', 'electric'], required: true },
    energyType: { type: String, enum: ['95', '91', 'diesel'], required: true },
    user: {
        _id: { type: mongoose.Types.ObjectId, required: true },
    }
}, { timestamps: true });

export const VehicleModel = mongoose.model('Vehicle', vehicleSchema);