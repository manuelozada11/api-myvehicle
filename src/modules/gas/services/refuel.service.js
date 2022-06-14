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
        getRefuels: async (filter) => {
            const result = await RefuelModel.getRefuels(filter);

            if (!result) throw ({ code: 404, message: `Refuels not found` })

            return result
        },
        updateRefuel: async (_id, date, fuel, amount, quantity, gasStation, location) => {
            const pricePerLt = (amount / quantity).toFixed(3);
            const result = await RefuelModel.updateRefuel({_id, date, fuel, amount, quantity, gasStation: {name: gasStation, location, pricePerLt}});

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