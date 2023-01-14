import _ from "lodash";

export const validateCreateFields = (fields) => {
    const { type, date, description, vehicleId, user } = fields;

    if (_.isEmpty(type)) return { code: 400, message: 'missing type field' };
    if (_.isEmpty(description)) return { code: 400, message: 'missing desciption field' };
    if (_.isEmpty(vehicleId)) return { code: 400, message: 'missing vehicleId field' };
    if (_.isEmpty(user._id)) return { code: 400, message: 'missing userId field' };

    if (type !== "tires" && type !== "battery" && type !== "normal")
        return { code: 400, message: 'invalid type field' };

    return { code: null, message: null };
}