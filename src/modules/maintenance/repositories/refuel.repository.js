export const makeRepository = (RefuelModel) => {
    return { 
        createRefuel: (data) => RefuelModel.create(data), 
        getRefuelById: ({ _id, _idRefuel }) => RefuelModel.findOne({ _id: _idRefuel, "user._id": _id }),  
        getRefuels: (filter) => RefuelModel.find(filter),
        updateRefuel: (_id, data) => RefuelModel.findByIdAndUpdate(_id, data), 
        deleteRefuel: (_id) => RefuelModel.findByIdAndDelete(_id)
    }
}