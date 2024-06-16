import _ from "lodash";

export const validateCreateFields = (fields) => {
    const { type, date, vehicleId, user, amount, adjustments, kms } = fields;

    if (_.isEmpty(date)) return { code: 400, message: 'missing date field' };
    if (_.isEmpty(type)) return { code: 400, message: 'missing type field' };
    if (_.isEmpty(vehicleId)) return { code: 400, message: 'missing vehicleId field' };
    if (_.isEmpty(user._id)) return { code: 400, message: 'missing userId field' };

    if (amount && !_.isNumber(amount)) return { code: 400, message: 'invalid amount field' };
    if (kms && !_.isNumber(kms)) return { code: 400, message: 'invalid kms field' };

    if (type !== "tires" && type !== "battery" && type !== "general")
        return { code: 400, message: 'invalid type field' };

    if ((type === "tires" || type === "general") && !adjustments?.length)
        return { code: 400, message: 'missing adjustments field' };

    return { code: null, message: null };
}