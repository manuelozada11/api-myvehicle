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
    country: user.country,
    email: user.email,
  }
}

const generateToken = (usr) => {
  const user = { ...usr, iss: process.env.JWT_ISS }
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '24h' });
}

const regexValidation = (string, type, regex) => {
  if (!string) return false;
  switch (type) {
    case "number":
      regex = /\d/;
      break;
    case "uppercase":
      regex = /[A-Z]/;
      break;
    case "lowercase":
      regex = /^(?=.*[a-z]).+$/;
      break;
    case "username":
      regex = /^[a-zA-Z0-9]+/;
      break;
    default:
      regex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
      break;
  }
  return regex.test(string);
}

const validatePassword = (password, confirmPwd) => {
  if (password?.length < 6) throw customError('PASSWORD_MUST_HAVE_MORE_THAN_6_CHARS', 400);
  if (password !== confirmPwd) throw customError('PASSWORDS_DOESNT_MATCH', 400);

  if (!regexValidation(password, 'lowercase')) throw customError('AT_LEAST_ONE_LOWERCASE_LETTER_IS_REQUIRED', 400);
  if (!regexValidation(password, 'uppercase')) throw customError('AT_LEAST_ONE_UPPERCASE_LETTER_IS_REQUIRED', 400);
  if (!regexValidation(password, 'number')) throw customError('AT_LEAST_ONE_NUMBER_IS_REQUIRED', 400);
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