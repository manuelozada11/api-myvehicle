import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    name: { type: String },
    manufacture: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number },
    displacement: { type: Number },
    plateNumber: { type: String },
    type: { type: String, enum: ['hybrid', 'gasoline', 'electric'] },
    energyType: { type: String, enum: ['95', '91', 'diesel'] },
    user: {
        _id: { type: mongoose.Types.ObjectId, required: true },
    },
    lastOwners: [{
        _id: { type: mongoose.Types.ObjectId, required: true },
        fullname: { type: String, required: true }
    }],
    boughtDate: { type: Date },
    color: { type: String },
    passengers: { type: Number },
    vehicleType: { type: String, enum: ['motorcycle', 'car', 'truck', 'bus', 'bicycle'] },
    bodySerial: { type: String },
    insuranceDate: { type: Date },
    taxesDate: { type: Date },
    isTransferActivated: { type: Boolean }
}, { timestamps: true });

export const VehicleModel = mongoose.model('Vehicle', vehicleSchema);