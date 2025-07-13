import _ from 'lodash';
import { userService } from '../services/user.service.js';
import { defaultCatcher } from '../../../shared/config/defaultCatcher.js';
import { validatePassword, validateEmail } from '../users.utils.js';

export const createUser = async (req, res) => {
  try {
    const fields = _.pick(req.body, "name", "lastname", "email", "phoneNumber", "step", "lang");
    const { credentials } = _.pick(req.headers, "credentials");

    if (_.isEmpty(credentials))
      return res.status(400).json({ code: 400, message: 'MISSING_CREDENTIALS_HEADER' });
    const [username, password, passwordConfirmation] = Buffer.from(credentials, 'base64').toString('ascii').split(':');

    if (_.isEmpty(fields?.name) && fields?.step > 1)
      return res.status(400).json({ code: 400, message: 'MISSING_NAME_FIELD' });
    if (_.isEmpty(fields?.lastname) && fields?.step > 1)
      return res.status(400).json({ code: 400, message: 'MISSING_LASTNAME_FIELD' });
    if (_.isEmpty(fields?.lang) && fields?.step > 1)
      return res.status(400).json({ code: 400, message: 'MISSING_LANGUAGE_FIELD' });
    if (_.isEmpty(fields?.email))
      return res.status(400).json({ code: 400, message: 'MISSING_EMAIL_FIELD' });
    if (_.isEmpty(username))
      return res.status(400).json({ code: 400, message: 'MISSING_USERNAME_FIELD' });
    if (_.isEmpty(password))
      return res.status(400).json({ code: 400, message: 'MISSING_PASSWORD_FIELD' });
    if (_.isEmpty(passwordConfirmation))
      return res.status(400).json({ code: 400, message: 'MISSING_CONFIRM_PASSWORD_FIELD' });

    validatePassword(password, passwordConfirmation);
    validateEmail(fields.email);

    const { code, response, message } = await userService.createUser({ username, password, ...fields });

    return res.status(code).json({ code, message });
  } catch (e) {
    defaultCatcher(e, res);
  }
}

export const makeSignIn = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(400).json({ code: 400, message: 'MISSING_AUTHORIZATION_HEADER' });

    if (!auth?.includes('Basic ')) return res.status(400).json({ code: 400, message: 'INVALID_AUTHORIZATION_HEADER' });

    const base64Credentials = auth.replace('Basic ', '');
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');

    if (!credentials?.includes(':')) return res.status(400).json({ code: 400, message: 'INVALID_AUTHORIZATION_HEADER' });

    const [usr, pwd] = credentials.split(':');

    const { code, message, info, token } = await userService.userSignIn({ usr, pwd });
    if (code > 200) return res.status(code).json({ code, message });

    return res.status(200).json({
      code: 200,
      user: info,
      token
    });
  } catch (e) {
    defaultCatcher(e, res);
  }
}

export const googleSignin = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(400).json({ code: 400, message: 'MISSING_AUTHORIZATION_HEADER' });
    
    const { lang } = _.pick(req.body, "lang");

    if (!auth?.includes('Bearer ')) return res.status(400).json({ code: 400, message: 'INVALID_AUTHORIZATION_HEADER' });

    const base64Credentials = auth.replace('Bearer ', '');
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');

    const { code, message, info, token } = await userService.userSignIn({ googleToken: credentials, lang });
    if (code > 200) return res.status(code).json({ code, message });

    return res.status(200).json({
      code: 200,
      user: info,
      token
    });
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
    res.status(500).json({ message: err.message });
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: err.message });
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
    res.status(500).json({ message: error.message });
  }
}

export const createRateApp = async (req, res) => {
  try {
    const fields = _.pick(req.body, "rating", "review");
    const { _id } = _.pick(req.params, "_id");

    if (_.isEmpty(_id)) return res.status(400).json({ code: 400, message: 'MISSING_USER_ID' });

    if (!_.isNumber(fields?.rating)) return res.status(400).json({ code: 400, message: 'MISSING_RATING_FIELD' });
    if (fields?.rating < 1 || fields?.rating > 5) return res.status(400).json({ code: 400, message: 'INVALID_RATING_FIELD' });

    const { code, message, payload } = await userService.createRateApp({ ...fields, _id });

    return res.status(code).json({ code, message, payload });
  } catch (e) {
    defaultCatcher(e, res);
  }
}

export const addIntegration = async (req, res) => {
  try {
    const fields = _.pick(req.body, "code");
    const { _id } = _.pick(req.params, "_id");

    if (_.isEmpty(_id)) return res.status(400).json({ code: 400, message: 'MISSING_USER_ID' });
    if (_.isEmpty(fields?.code)) return res.status(400).json({ code: 400, message: 'MISSING_CODE_FIELD' });

    const { code, message, name, user } = await userService.addIntegration({ ...fields, _id });
    if (code > 202) return res.status(code).json({ code, message });

    return res.status(code).json({ code, message, name, user });
  } catch (e) {
    defaultCatcher(e, res);
  }
}

export const activateUser = async (req, res) => {
  try {
    if (!req.user?._id) return res.status(400).json({ code: 400, message: 'MISSING_USER' });
    const { code, message } = await userService.activateUser(req.user);

    return res.status(code).json({ code, message });
  } catch (e) {
    defaultCatcher(e, res);
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email, lang } = _.pick(req.body, "email", "lang");

    if (_.isEmpty(email)) return res.status(400).json({ code: 400, message: 'MISSING_EMAIL_FIELD' });

    const { code, message } = await userService.forgotPassword({ email, lang });

    return res.status(code).json({ code, message });
  } catch (e) {
    defaultCatcher(e, res);
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { credentials } = _.pick(req.headers, "credentials");

    if (_.isEmpty(credentials)) return res.status(400).json({ code: 400, message: 'MISSING_CREDENTIALS_HEADER' });

    const [password, passwordConfirmation] = Buffer.from(credentials, 'base64').toString('ascii').split(':');

    if (_.isEmpty(password)) return res.status(400).json({ code: 400, message: 'MISSING_PASSWORD_FIELD' });
    if (_.isEmpty(passwordConfirmation)) return res.status(400).json({ code: 400, message: 'MISSING_CONFIRM_PASSWORD_FIELD' });

    const { code, message } = await userService.resetPassword({ password, passwordConfirmation }, req.user);

    return res.status(code).json({ code, message });
  } catch (e) {
    defaultCatcher(e, res);
  }
}

export const getUserNotifications = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!_id) return res.status(400).json({ code: 400, message: 'MISSING_USER_ID' });

    const user = await userService.getUserById({ _id });
    if (!user) return res.status(404).json({ code: 404, message: 'USER_NOT_FOUND' });
    
    return res.status(200).json({ code: 200, notifications: user.notifications });
  } catch (e) {
    defaultCatcher(e, res);
  }
}

export const markNotificationsAsRead = async (req, res) => {
  try {
    const { _id } = req.user;
    const { notificationId } = req.body;
    
    if (!_id) return res.status(400).json({ code: 400, message: 'MISSING_USER_ID' });
    if (notificationId === undefined) return res.status(400).json({ code: 400, message: 'MISSING_NOTIFICATION_ID' });
    
    const { code, message } = await userService.markNotificationAsRead({ _id, notificationId });
    return res.status(code).json({ code, message });
  } catch (e) {
    defaultCatcher(e, res);
  }
}

