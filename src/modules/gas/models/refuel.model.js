import mongoose, {Schema} from "mongoose";

const refuelSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    amountPaid: { type: Schema.Types.Decimal128, required: true },
    lts: { type: Schema.Types.Decimal128, required: true },
    date: { type: Schema.Types.Date, required: true },
    pricePerLts: { type: Schema.Types.Decimal128, required: true },
    gasStation: { type: String }
}, { timestamps: true })

export default mongoose.model('Refuel', refuelSchema)