import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema({
    type: { type: String, enum: [ "tires", "battery", "general" ], required: true },
    description: { type: String },
    private: { type: Boolean, default: true },
    adjustments: { type: Array, default: []},
    amount: { type: Number },
    kms: { type: Number },
    date: { type: Date, required: true },
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