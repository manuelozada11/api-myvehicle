export const makeRepository = (VehicleModel) => {
    return {
        createVehicle: (data) => VehicleModel.create(data),
        getVehicleById: (filter) => VehicleModel.findOne(filter),
        getVehicles: (filter) => VehicleModel.find(filter),
        updateVehicle: ({ _userId, _vehicleId, ...data }) => {
            return VehicleModel.findByIdAndUpdate({ "user._id": _userId, "_id": _vehicleId }, data);
        },
        deleteVehicle: (_id) => VehicleModel.deleteOne(_id)
    }
}