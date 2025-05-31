export const makeRepository = (MaintenanceModel) => {
    const create = (fields) => MaintenanceModel.create(fields);

    const getMaintenances = (filters) => MaintenanceModel.find(filters);
    
    const getMaintenancesLimit = (filters, sort, limit) => MaintenanceModel.find(filters).sort(sort).limit(limit);

    const getAll = () => {}

    const updateById = () => {}
    
    const deleteById = (maintenanceId) => MaintenanceModel.findByIdAndDelete(maintenanceId);

    return {
        create,
        getAll,
        getMaintenances,
        getMaintenancesLimit,
        updateById,
        deleteById
    }
}