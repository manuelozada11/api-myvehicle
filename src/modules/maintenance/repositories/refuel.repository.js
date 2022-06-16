export const makeRepository = (RefuelModel) => {
    return { 
        createRefuel: (data) => RefuelModel.create(data), 
        getRefuel: (filter) => RefuelModel.findOne(filter),  
        getRefuels: (filter) => RefuelModel.find(filter),
        updateRefuel: (_id, data) => RefuelModel.findByIdAndUpdate(_id, data), 
        deleteRefuel: (_id) => RefuelModel.findByIdAndDelete(_id)
    }
}