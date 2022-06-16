export const makeService = (UserModel) => {
    return {
        createUser: async (name, lastname, email, password, phoneNumber) => {
            await UserModel.createUser({ name, lastname, email, password, phoneNumber, role: "user", status: false });

            return true;
        },
        userSignIn: async (username, password) => {
            const user = await UserModel.userSignIn(username, password);

            return user;
        },
        getUser: async (_id) => {
            const result = await UserModel.getUser({_id});

            if (!result) throw ({ message: `User id: (${_id}) not found` });

            return result
        },
        getUsers: async (filter) => {
            const result = await UserModel.getUsers(filter);

            if (!result) throw ({ message: `Users not found` });

            return result
        },
        updateUser: async (_id, name, lastname, email, password, phoneNumber) => {
            const result = await UserModel.updateUser({_id}, { name, lastname, phoneNumber });

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