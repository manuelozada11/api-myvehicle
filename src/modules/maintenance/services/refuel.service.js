export const makeService = (RefuelModel) => {
    const createRefuel = async ({ date = new Date, fuel, amount, quantity, gasStation, user, vehicle }) => {
        const pricePerLt = (amount / quantity).toFixed(3);

        if (gasStation) gasStation.pricePerLt = pricePerLt;
        else gasStation = { pricePerLt };

        await RefuelModel.createRefuel({date: new Date(date), fuel, amount, quantity, gasStation, user, vehicle});
    }

    const getRefuel = async ({ _id, _idRefuel }) => {
        const result = await RefuelModel.getRefuelById({ _id, _idRefuel });

        if (!result) return null;

        return result
    }

    const getRefuels = async ({ userId, vehicleId }) => {
        let refuels = [];
        
        if (vehicleId) refuels = await RefuelModel.getRefuels({ "user._id": userId, "vehicle._id": vehicleId });
        else refuels = await RefuelModel.getRefuels({ "user._id": userId });

        if (!refuels) return [];

        const rfResponse = refuels.map(refuel => {
            return {
                _id: refuel._id,
                vehicle: refuel.vehicle,
                date: refuel.date,
                station: refuel.gasStation.name,
                amount: refuel.amount,
                quantity: refuel.quantity,
                gasStationName: `${ refuel.gasStation.name } ${ refuel.gasStation.location }`
            }
        });

        return rfResponse
    }

    return { 
        createRefuel, 
        getRefuel,  
        getRefuels,
        updateRefuel: async (_id, date, fuel, amount, quantity, gasStation, location) => {
            const pricePerLt = (amount / quantity).toFixed(3);
            const result = await RefuelModel.updateRefuel({_id}, {date, fuel, amount, quantity, gasStation: {name: gasStation, location, pricePerLt}});

            if (!result) throw ({ message: `Refuel id: (${_id}) not found` })
    
            return result
        }, 
        deleteRefuel: async (_id) => {
            const result = await RefuelModel.deleteRefuel({_id});
            if (!result) throw ({ message: `Refuel id: (${_id}) not found` })
    
            return true
        }
    }
}