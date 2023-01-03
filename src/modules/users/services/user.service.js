import { getCleanUser, generateToken } from '../users.utils.js';

export const makeService = (UserModel) => {
    const createUser = async (user) => {
        await UserModel.createUser({
            ...user,
            role: "user", 
            status: false
        });

        return true;
    }

    const userSignIn = async ({ usr, pwd }) => {
        const user = await UserModel.userSignIn({ username: usr, password: pwd });

        if (!user) return { code: 404, message: "USER_NOT_FOUND" };
        
        if (!user.status) return { code: 403, message: "USER_INACTIVED" };

        const usrReduced = getCleanUser(user);
        const token = generateToken(usrReduced);

        return { code: 200, message: "success", info: usrReduced, token }
    }

    const getUserById = async ({ _id }) => {
        const usr = await UserModel.getUserById({ _id });

        if (!usr) return null

        return usr
    }

    const getUsers = async (filter) => {
        const users = await UserModel.getUsers(filter);

        if (!users.length) return [];

        const uResponse = users.map(user => {
            return {
                _id: user._id,
                fullname: `${ user.name } ${ user.lastname }`,
                username: user.username
            }
        });

        return uResponse
    }

    return {
        createUser,
        userSignIn,
        getUserById,
        getUsers,
        updateUser: async (_id, name, lastname, email, password, phoneNumber) => {
            const result = await UserModel.updateUser({ _id }, { name, lastname, phoneNumber });

            if (!result) throw ({ message: `User id: (${_id}) not found` });

            return result
        },
        updateUserPassword: async (_id, password) => {
            const result = await UserModel.updateUser({_id}, { password });

            if (!result) throw ({ message: `User id: (${_id}) not found` });

            return result
        },
        updateUserStatus: async (_id, status) => {
            const result = await UserModel.updateUser({_id}, { status });

            if (!result) throw ({ message: `User id: (${_id}) not found` });

            return result
        },
        deleteUser: async (_id) => {
            const result = await UserModel.deleteUser({_id});

            if (!result) throw ({ message: `User id: (${_id}) not found` });

            return result
        }
    }
}