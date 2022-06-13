export const makeRepository = (RefuelModel) => {
    return { 
        createRefuel: (data) => {
            return RefuelModel.create(data)
        }, 
        getRefuel: (_id) => {
            return RefuelModel.findById(_id)
        },  
        updateRefuel: (data) => {
            console.log(data)
        }, 
        deleteRefuel: (data) => {
            console.log(data)
        }
    }
}