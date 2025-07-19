export const makeRepository = (VehicleModel) => {
    return {
        createVehicle: (data) => VehicleModel.create(data),
        getVehicleById: (filter) => VehicleModel.findOne(filter),
        getVehicles: (filter) => VehicleModel.find(filter),
        updateVehicle: ({ userId, vehicleId, ...data }) => {
            return VehicleModel.findOneAndUpdate(
                { "user._id": userId, "_id": vehicleId }, 
                data, 
                { new: true }
            );
        },
        deleteVehicle: (_id) => VehicleModel.deleteOne(_id)
    }
}