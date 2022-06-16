export const makeRepository = (UserModel) => {
    return {
        createUser: (data) => UserModel.create(data),
        getUser: (_id) => UserModel.findById(_id),
        getUsers: (filter) => UserModel.find(filter),
        updateUser: (_id, data) => UserModel.findByIdAndUpdate(_id, data, { new: true }),
        deleteUser: (_id) => UserModel.findByIdAndDelete(_id)
    }
}