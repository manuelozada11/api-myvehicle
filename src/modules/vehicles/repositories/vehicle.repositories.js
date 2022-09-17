export const makeRepository = (VehicleModel) => {
    return {
        createVehicle: (data) => VehicleModel.create(data),
        getVehicleById: (filter) => VehicleModel.find(filter),
        getVehicles: (filter) => VehicleModel.find(filter),
        updateVehicle: (_id, data) => VehicleModel.findByIdAndUpdate(_id, data),
        deleteVehicle: (_id) => VehicleModel.deleteOne(_id)
    }
}