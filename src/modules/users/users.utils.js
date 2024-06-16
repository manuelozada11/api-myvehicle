import jwt from 'jsonwebtoken';
import { customError } from '../../shared/config/customError.js';

const getCleanUser = (user) => {
    if (!user) return null;
    
    return {
        _id: user._id,
        name: user.name,
        lastname: user.lastname,
        role: user.role,
        username: user.username,
        country: user.country
    }
}

const generateToken = (usr) => {
    const user = {...usr, iss: process.env.JWT_ISS }
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '24h' });
}

const validatePassword = (password, confirmPwd) => {
    if (password !== confirmPwd) throw customError('PASSWORDS_DOESNT_MATCH', 400);
    
    // para validar números, letras y caracteres especiales
    const regexLetras = /[a-zA-Z]+/;
    const regexNum = /[0-9]+/;
    const regexChar = /["#$%&/()=¿?¡!_.,+*']+/;

    if (!regexLetras.test(password)) throw customError('AT_LEAST_ONE_LETTER_IS_REQUIRED', 400);
    if (!regexNum.test(password)) throw customError('AT_LEAST_ONE_NUMBER_IS_REQUIRED', 400);
    if (!regexChar.test(password)) throw customError('AT_LEAST_ONE_SPECIAL_CHAR_IS_REQUIRED', 400);
}

const validateEmail = (email) => {
    const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regexEmail.test(email)) throw customError('INVALID_EMAIL', 400);
}

export {
    getCleanUser,
    generateToken,
    validatePassword,
    validateEmail
}