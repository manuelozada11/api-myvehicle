export const makeService = (RefuelModel) => {
    return { 
        createRefuel: async (date = new Date, fuel, amount, quantity, StationName, location) => {
            const pricePerLt = (amount / quantity).toFixed(3);
    
            await RefuelModel.createRefuel({date: new Date(date), fuel, amount, quantity, gasStation: {name: StationName, location, pricePerLt}});
    
            return true
        }, 
        getRefuel: async (_id) => {
            const result = await RefuelModel.getRefuel({_id});

            if (!result) throw ({ code: 404, message: `Refuel id: (${_id}) not found` })

            return result
        }, 
        updateRefuel: async (_id) => {
            const result = await RefuelModel.updateRefuel({_id});

            if (!result) throw ({ code: 404, message: `Refuel id: (${_id}) not found` })
    
            return result
        }, 
        deleteRefuel: async (_id) => {
            const result = await RefuelModel.deleteRefuel({_id});
            if (!result) throw ({ code: 404, message: `Refuel id: (${_id}) not found` })
    
            return true
        }
    }
}