import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema({
    type: { type: String, enum: [ "tires", "battery", "normal" ], required: true },
    description: { type: String, required: true },
    amount: { type: Number },
    private: { type: Boolean, default: false },
    tires: {
        brand: { type: String }
    },
    battery: {
        brand: { type: String }
    },
    user: {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        fullname: { type: String, required: true }
    },
    vehicle: {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        fullname: { type: String, required: true }
    }
}
, { timestamps: true });

export const MaintenanceModel = mongoose.model("Maintenance", maintenanceSchema);