export const makeRepository = (RefuelModel) => {
    return { 
        createRefuel: (data) => {
            return RefuelModel.create(data)
        }, 
        getRefuel: (_id) => {
            return RefuelModel.findById(_id)
        },  
        getRefuels: (filter) => {
            return RefuelModel.find(filter)
        }, 
        updateRefuel: (data) => {
            return RefuelModel.updateOne({_id: data._id}, data)
        }, 
        deleteRefuel: (_id) => {
            return RefuelModel.findByIdAndDelete(_id)
        }
    }
}