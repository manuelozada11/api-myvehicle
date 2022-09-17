export const makeRepository = (RefuelModel) => {
    return { 
        createRefuel: (data) => RefuelModel.create(data), 
        getRefuel: (filter) => RefuelModel.findOne(filter),  
        getRefuelsByUserId: ({ _id }) => RefuelModel.find({ "user._id": _id  }),
        updateRefuel: (_id, data) => RefuelModel.findByIdAndUpdate(_id, data), 
        deleteRefuel: (_id) => RefuelModel.findByIdAndDelete(_id)
    }
}