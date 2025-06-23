import { emailConstants } from '../../../shared/constants/email.constants.js';
import { getCleanUser, generateToken } from '../users.utils.js';
import { Resend } from "resend";
import { OAuth2Client } from 'google-auth-library';

export const makeService = (UserModel) => {
  const createUser = async ({ lang, ...fields }) => {
    let response = 1;
    if (fields.step === 1) {
      response = await UserModel.getUsers({ username: fields.username });
      if (response?.length > 0) return { code: 400, message: 'USER_ALREADY_EXISTS' };

      response = await UserModel.getUsers({ email: fields.email });
      if (response?.length > 0) return { code: 400, message: 'EMAIL_ALREADY_IN_USE' };

      return { code: 200, message: 'VALID_USER' };
    }

    const user = {
      status: true,
      role: "customer",
      notifications: [],
      ...fields
    }
    response = await UserModel.createUser(user);

    if (process.env?.EMAIL_KEY) {
      const resend = new Resend(process.env.EMAIL_KEY);
      const email = emailConstants.find(e => e.emailId === 1);
      const body = email.html.replace('{{name}}', user?.name);

      resend.emails.send({
        from: 'Taangi <onboarding@resend.dev>',
        to: user.email,
        subject: email.subject[lang],
        html: body.replace('{{body}}', email.body[lang])
      });
    }

    return { code: 200, message: 'USER_CREATED_SUCCESSFULLY' };
  }

  const userSignIn = async ({ usr, pwd, googleToken }) => {
    if (googleToken) return await _googleSignin(googleToken);

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
        fullname: `${user.name} ${user.lastname}`,
        username: user.username
      }
    });

    return uResponse
  }

  const createRateApp = async (fields) => {
    const { _id } = fields;

    let fieldsToUpdate = {};

    if (fields.rating) {
      const { rating, review } = fields;

      fieldsToUpdate = {
        ...fieldsToUpdate,
        rate: {
          rating,
          review,
          createdAt: new Date()
        }
      };
    }

    const result = await UserModel.updateUser(_id, fieldsToUpdate);
    if (!result) throw ({ code: 404, message: `User id: (${_id}) not found` });

    return { code: 200, message: 'USER_UPDATED_SUCCESSFULLY', payload: result };
  }

  const _googleSignin = async (credentials) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credentials,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture, sub } = payload;

    let user = await UserModel.getUsers({ email });

    if (!user || !user.length) {
      const basicUser = {
        name: given_name?.toString().trim().toLowerCase(),
        lastname: family_name?.toString().trim().toLowerCase(),
        email,
        username: sub,
        password: 'googleauth',
        role: 'customer',
        status: true,
        notifications: [],
        picture
      }

      user = await UserModel.createUser(basicUser);
    } else {
      user = user[0];
      await UserModel.updateUser(user._id, {
        name: given_name?.toString().trim().toLowerCase(),
        lastname: family_name?.toString().trim().toLowerCase(),
        picture
      });
    }

    const usrReduced = getCleanUser(user);
    const token = generateToken(usrReduced);

    return { code: 200, message: "success", info: usrReduced, token }
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
      const result = await UserModel.updateUser({ _id }, { password });

      if (!result) throw ({ message: `User id: (${_id}) not found` });

      return result
    },
    updateUserStatus: async (_id, status) => {
      const result = await UserModel.updateUser({ _id }, { status });

      if (!result) throw ({ message: `User id: (${_id}) not found` });

      return result
    },
    deleteUser: async (_id) => {
      const result = await UserModel.deleteUser({ _id });

      if (!result) throw ({ message: `User id: (${_id}) not found` });

      return result
    },
    createRateApp
  }
}