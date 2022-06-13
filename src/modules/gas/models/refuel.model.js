import mongoose from "mongoose";

const refuelSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    fuel: { type: Number, required: true },
    amount: { type: Number, required: true },
    quantity: { type: Number, required: true },
    kms: { type: Number },
    gasStation: {
        name: { type: String },
        location: { type: String },
        pricePerLt: { type: Number, required: true },
    },
    // user: {
    //     _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    //     fullname: { type: String, required: true }
    // }
}, { timestamps: true })

export const RefuelModel = mongoose.model('Refuel', refuelSchema)