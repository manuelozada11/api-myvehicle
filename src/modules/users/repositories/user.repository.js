export const makeRepository = (UserModel) => {
    return {
        createUser: (data) => UserModel.create(data),
        getUserById: (_id) => UserModel.findById(_id),
        getUsers: (filter) => UserModel.find(filter),
        getUserBy: (filter) => UserModel.findOne(filter),
        userSignIn: (data) => UserModel.findOne(data),
        updateUserById: (_id, data) => UserModel.findByIdAndUpdate(_id, data, { new: true }),
        updateUserBy: (filter, data) => UserModel.findOneAndUpdate(filter, data, { new: true }),
        deleteUser: (_id) => UserModel.findByIdAndDelete(_id),
        addNotification: (_id, filter) => UserModel.updateOne(_id, filter)
    }
}