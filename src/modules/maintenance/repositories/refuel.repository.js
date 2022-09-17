export const makeRepository = (RefuelModel) => {
    return { 
        createRefuel: (data) => RefuelModel.create(data), 
        getRefuelById: ({ _id, _idRefuel }) => RefuelModel.findOne({ _id: _idRefuel, "user._id": _id }),  
        getRefuelsByUser: ({ _id }) => RefuelModel.find({ "user._id": _id  }),
        updateRefuel: (_id, data) => RefuelModel.findByIdAndUpdate(_id, data), 
        deleteRefuel: (_id) => RefuelModel.findByIdAndDelete(_id)
    }
}