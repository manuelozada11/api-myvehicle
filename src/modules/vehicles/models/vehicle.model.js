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
        fullname: { type: String, required: true },
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
    isTransferActivated: { type: Boolean },
    extId: { type: String }, // External ID for integrations
    from: { type: String }, // Source of the vehicle data (e.g., 'strava', 'manual')
    settings: {
        maintenanceInterval: { 
            type: Number, 
            default: 5000
        },
        resetMaintenanceType: {
            type: String,
            enum: [
                // Autos y motos
                'changeOil', 'changeFuelFilter', 'changeAirFilter', 'changeFrontLights', 'changeBackLights', 'changeInjectorCleaning', 'changeBrake', 'changeCarWashing', 'changeOther',
                // Bicicletas
                'bikeGearAdjustment', 'bikeWash', 'bikeTirePressure', 'bikeFullInspection', 'bikeChainLubrication', 'bikeChangeChain', 'bikeChangeBrake', 'bikeOther'
            ]
            // default: undefined (no default)
        }
    },
    maintenance: {
        accumulatedKm: {
            type: Number,
            default: 0
        },
        tires: {
            frontLeft: { 
                accumulatedKm: { type: Number, default: 0 },
                lastChange: { type: Date }
            },
            frontRight: {
                accumulatedKm: { type: Number, default: 0 },
                lastChange: { type: Date }
            },
            rearLeft: {
                accumulatedKm: { type: Number, default: 0 },
                lastChange: { type: Date }
            },
            rearRight: {
                accumulatedKm: { type: Number, default: 0 },
                lastChange: { type: Date }
            },
            spare: {
                accumulatedKm: { type: Number, default: 0 },
                lastChange: { type: Date }
            },
            front: {
                accumulatedKm: { type: Number, default: 0 },
                lastChange: { type: Date }
            },
            rear: {
                accumulatedKm: { type: Number, default: 0 },
                lastChange: { type: Date }
            }
        },
        chain: {
            accumulatedKm: { type: Number, default: 0 },
            lastChange: { type: Date }
        },
        brakes: {
            accumulatedKm: { type: Number, default: 0 },
            lastChange: { type: Date }
        }
    }
}, { timestamps: true });

export const VehicleModel = mongoose.model('Vehicle', vehicleSchema);