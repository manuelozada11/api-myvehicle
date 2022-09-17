import { customError } from '../../shared/config/customError.js';

export const makeService = (RefuelModel) => {
    return { 
        createRefuel: async (date = new Date, fuel, amount, quantity, gasStation, user, vehicle) => {
            const pricePerLt = (amount / quantity).toFixed(3);

            if (gasStation) gasStation.pricePerLt = pricePerLt;
            else gasStation = { pricePerLt };
    
            await RefuelModel.createRefuel({date: new Date(date), fuel, amount, quantity, gasStation, user, vehicle});
    
            return true
        }, 
        getRefuel: async (_id) => {
            const result = await RefuelModel.getRefuel({_id});

            if (!result) throw ({message: `Refuel id: (${_id}) not found` })

            return result
        },  
        getRefuels: async ({ userId }) => {
            const result = await RefuelModel.getRefuelsByUserId({ _id: userId });

            if (!result) throw customError('REFUELS_NOT_FOUND', 404);

            return result
        },
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