export const makeRepository = (UserModel) => {
    return {
        createUser: (data) => UserModel.create(data),
        getUserById: (_id) => UserModel.findById(_id),
        getUsers: (filter) => UserModel.find(filter),
        userSignIn: ({ username, password }) => UserModel.findOne({ username, password }),
        updateUser: (_id, data) => UserModel.findByIdAndUpdate(_id, data, { new: true }),
        deleteUser: (_id) => UserModel.findByIdAndDelete(_id)
    }
}