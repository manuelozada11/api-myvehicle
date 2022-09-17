import jwt from 'jsonwebtoken';

const getCleanUser = (user) => {
    if (!user) return null;

    return {
        _id: user._id,
        name: user.name,
        last: user.lastname,
        role: user.role,
        username: user.username
    }
}

const generateToken = (usr) => {
    const user = {...usr, iss: process.env.JWT_ISS }
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '24h' });
}

export {
    getCleanUser,
    generateToken
}