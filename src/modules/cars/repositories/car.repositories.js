export const makeRepository = (CarModel) => {
    return {
        createCar: (data) => CarModel.create(data),
        getCarById: (_id) => CarModel.findById(_id),
        getCars: (filter) => CarModel.find(filter),
        updateCar: (_id, data) => CarModel.findByIdAndUpdate(_id, data),
        deleteCar: (_id) => CarModel.deleteOne(_id)
    }
}