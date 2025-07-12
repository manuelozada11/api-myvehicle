export const makeRepository = (MaintenanceModel) => {
    const create = (fields) => MaintenanceModel.create(fields);

    const getMaintenances = (filters, sort, limit) => MaintenanceModel.find(filters).sort(sort).limit(limit);
    
    const getMaintenancesLimit = (filters, sort, limit) => MaintenanceModel.find(filters).sort(sort).limit(limit);

    const getAll = () => {}

    const updateById = () => {}
    
    const deleteById = (maintenanceId) => MaintenanceModel.findByIdAndDelete(maintenanceId);

    const deleteBy = (filters) => MaintenanceModel.deleteOne(filters);

    return {
        create,
        getAll,
        getMaintenances,
        getMaintenancesLimit,
        updateById,
        deleteById,
        deleteBy
    }
}