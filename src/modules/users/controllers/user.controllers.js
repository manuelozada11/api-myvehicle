import _ from 'lodash';
import { userService } from '../services/index.js';
import { defaultCatcher } from '../../shared/config/defaultCatcher.js';
import { validatePassword, validateEmail } from '../../shared/utils.js';

export const createUser = async (req, res) => {
    try {
        const { name, lastname, email, password, confirmPassword, phoneNumber } = req.body;

        if (!name || !lastname || !email || !password || !confirmPassword) return res.status(400).json({ error: 'missing required fields' });
        
        const result = validatePassword(password, confirmPassword)
        const resultEmail = validateEmail(email)
        if (result.error || resultEmail.error) return res.status(400).json({ error: result.error ?? resultEmail.error });

        await userService.createUser(name, lastname, email, password, phoneNumber);

        res.status(200).json({ message: 'user created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({message: err.message});
    }
}

export const makeSignIn = async (req, res) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) return res.status(400).json({ code: 400, message: 'MISSING_AUTHORIZATION_HEADER' });
        
        if (!auth?.includes('Basic ')) return res.status(400).json({ code: 400, message: 'INVALID_AUTHORIZATION_HEADER' });
        
        const base64Credentials = auth.replace('Basic ','');
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    
        if (!credentials?.includes(':')) return res.status(400).json({ code: 400, message: 'INVALID_AUTHORIZATION_HEADER' });
    
        const [ usr, pwd ] = credentials.split(':');
        const user = await userService.userSignIn({ usr, pwd });

        return res.status(200).json({ code: 200, user: user.info, token: user.token });
    } catch (e) {
        defaultCatcher(e, res);
    }
}

export const getUser = async (req, res) => {
    try {
        const { _idUser } = _.pick(req.params, "_idUser");
        const { role, _id } = _.pick(req.user, "role", "_id");
        
        if (_.isEmpty(_idUser) && role !== 'admin') return res.status(400).json({ code: 400, message: 'MISSING_USERID_FIELD' });

        const userId = role !== 'admin' 
            ? _idUser
            : (_idUser ? _idUser : _id);

        const user = await userService.getUserById({ _id: userId });
        if (!user) return res.status(404).json({ code: 404, message: 'USER_NOT_FOUND' });

        return res.status(200).json({ code: 200, message: 'USER_FOUND', payload: user });
    } catch (e) {
        defaultCatcher(e, res);
    }
}

export const getUsers = async (req, res) => {
    try {
        const { role } = _.pick(req.user, "role");

        if (role !== 'admin') return res.status(403).json({ code: 403, message: 'UNAUTHORIZED_USER' });

        const users = await userService.getUsers();

        if (!users.length) return res.status(404).json({ code: 404, message: 'USERS_NOT_FOUND' });

        return res.status(200).json({ code: 200, message: 'USERS_FOUND', users: users });
    } catch (e) {
        defaultCatcher(e, res);
    }
}

export const updateUserInfo = async (req, res) => {
    try {
        // terminar
        const { _id } = req.params;
        const { name, lastname, phoneNumber } = req.body;

        if (!_id || !name || !lastname || !phoneNumber) return res.status(400).json({ error: 'missing required fields' });

        const user = await userService.updateUserInfo(_id, name, lastname, phoneNumber);

        return res.status(200).json({ message: 'user updated successfully', user: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({message: err.message});
    }
}

export const updateUserStatus = async (req, res) => {
    try {
        const { _id } = req.params;
        const { status } = req.body;

        if (!_id) return res.status(400).json({ error: 'missing required fields' });

        const user = await userService.updateUserStatus(_id, status);

        return res.status(200).json({ message: 'user updated successfully', user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});       
    }
}

export const updateUserPassword = async (req, res) => {
    try {
        // terminar, recibir las pwds por headers
        const { _id } = req.params;
        const { password, confirmPwd } = req.body;

        if (!_id || !password || !confirmPwd) return res.status(400).json({ error: 'missing required fields' });
        
        const result = validatePassword(password, confirmPwd);
        if (result.error) return res.status(400).json({ error: result.message });

        const user = await userService.updateUserPassword(_id, password);

        return res.status(200).json({ message: 'password updated successfully', user: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({message: err.message});
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { _id } = req.params;

        if (!_id) return res.status(400).json({ error: 'missing id field' });

        const result = await userService.deleteUser(_id);

        return res.status(200).json({ message: 'user deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
}