import { emailConstants } from '../../../shared/constants/email.constants.js';
import { getCleanUser, generateToken, hashPassword } from '../users.utils.js';
import { Resend } from "resend";
import { OAuth2Client } from 'google-auth-library';
import { UserModel } from "../models/user.model.js";
import { makeUserRepository } from "../repositories/index.js";
import bcrypt from 'bcryptjs';
import { httpClient } from '../../../shared/infra/http/httpClient.js';
import { config } from "../../../shared/config/config.js";

export const makeService = (repository) => {
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
  };

  const createUser = async ({ lang, password, name, lastname, username, email, ...fields }) => {
    let response = 1;
    
    if (fields.step === 1) {
      response = await repository.getUserBy({ username: username });
      if (response) return { code: 400, message: 'USER_ALREADY_EXISTS' };

      response = await repository.getUserBy({ email: email });
      if (response) return { code: 400, message: 'EMAIL_ALREADY_IN_USE' };

      return { code: 200, message: 'VALID_USER' };
    }

    const hashed = await hashPassword(password);
    const user = {
      status: false,
      username: username.toString().trim().toLowerCase(),
      email: email.toString().trim().toLowerCase(),
      name: name.toString().trim(),
      lastname: lastname.toString().trim(),
      phoneNumber: fields.phoneNumber?.toString().trim(),
      password: hashed,
      role: "customer",
      notifications: [],
      integrations: []
    }

    response = await repository.createUser(user);

    const resendKey = config.resend?.api_key;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const email = emailConstants.find(e => e.emailId === 1);

      const usrReduced = getCleanUser(response);
      const token = generateToken(usrReduced);

      let html = email.html;
      html = html.replace('{{name}}', user?.name || '');
      html = html.replace('{{body}}', email.body[lang] || '');
      html = html.replace('{{btnName}}', email.btnName[lang] || '');
      html = html.replace('{{token}}', token);

      await resend.emails.send({
        from: config.resend.from,
        to: user.email,
        subject: email.subject[lang],
        html
      });
    }

    return { code: 200, message: 'USER_CREATED_SUCCESSFULLY' };
  }

  const userSignIn = async ({ usr, pwd, googleToken }) => {
    if (googleToken) return await _googleSignin(googleToken);

    const user = await repository.userSignIn({ username: usr });
    if (!user) return { code: 404, message: "USER_NOT_FOUND" };

    const authenticated = await bcrypt.compare(pwd, user.password);
    if (!authenticated) return { code: 401, message: "INVALID_CREDENTIALS" };

    if (!user) return { code: 404, message: "USER_NOT_FOUND" };
    if (!user.status) return { code: 403, message: "USER_INACTIVED" };

    const usrReduced = getCleanUser(user);
    const token = generateToken(usrReduced);

    return { code: 200, message: "success", info: usrReduced, token }
  }

  const getUserById = async ({ _id }) => {
    const usr = await repository.getUserById({ _id });

    if (!usr) return null

    return usr
  }

  const getUsers = async (filter) => {
    const users = await repository.getUsers(filter);

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

    const result = await repository.updateUserById(_id, fieldsToUpdate);
    if (!result) throw ({ code: 404, message: `User id: (${_id}) not found` });

    return { code: 200, message: 'USER_UPDATED_SUCCESSFULLY', payload: result };
  }

  const addIntegration = async ({ _id, ...body }) => {
    const { code } = body;

    // we check if the user already has a Strava integration added
    const user = await repository.getUserBy({ _id, "integrations.name": "strava" });
    if (user) return { code: 202, message: 'Integration already exists', name: 'strava', user: getCleanUser(user) };

    const stravaConfig = await _exchangeCodeForToken(code);

    // we create the integration in our database
    const result = await repository.updateUserById(_id, { $push: { integrations: stravaConfig } });
    if (!result) return { code: 404, message: 'User not found' };

    return { code: 200, message: 'Integration added successfully', name: 'strava', user: getCleanUser(result) };
  }

  const activateUser = async (user) => {
    const found = await repository.getUserById(user._id);
    if (!found) return ({ code: 404, message: `User id: (${user._id}) not found` });
    if (found.status) return { code: 200, message: 'USER_ACTIVATED_SUCCESSFULLY' };
    // if (found.status) return ({ code: 400, message: 'USER_ALREADY_ACTIVATED' });

    const result = await repository.updateUserById(user._id, { status: true });
    if (!result) throw ({ code: 404, message: `User id: (${user._id}) not found` });

    return { code: 200, message: 'USER_ACTIVATED_SUCCESSFULLY' };
  }

  const getStravaAthlete = async (userConfig, userId) => {
    try {
      // Validate the Strava token
      userConfig = await _validateStravaToken(userConfig, userId);

      const client = httpClient({ baseURL: `${config.strava.api_url}/api/v3`, headers: { Authorization: `Bearer ${userConfig.accessToken}` } });
      const response = await client.get(`/athlete`);

      return response.data;
    } catch (error) {
      console.error("Error during Strava API call:", error);
      throw new Error('Error fetching athlete data from Strava');
    }
  }

  const forgotPassword = async ({ email, lang }) => {
    lang = lang || 'en';

    // Check if the user exists
    const user = await repository.getUserBy({ email });
    if (!user) return { code: 404, message: 'user not found' };
    
    // Generate a reset token (simple random string, in production use a secure token)
    const userReduced = getCleanUser(user);
    const token = generateToken(userReduced); 
    
    const resendKey = config.resend?.api_key;
    if (resendKey) {
      const emailTemplate = emailConstants.find(e => e.emailId === 2);
  
      let html = emailTemplate.html;
      html = html.replace('{{name}}', userReduced.name || '');
      html = html.replace('{{body}}', emailTemplate.body[lang] || '');
      html = html.replace('{{btnName}}', emailTemplate.btnName[lang] || '');
      html = html.replace('{{token}}', token);

      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: config.resend.from,
        to: user.email,
        subject: emailTemplate.subject[lang],
        html
      });
    }

    return { code: 200, message: 'reset password email sent' };
  };

  const resetPassword = async ({ password, passwordConfirmation }, user) => {
    try {
      // Check if user exists
      const foundUser = await repository.getUserById({ _id: user._id });
      if (!foundUser) return { code: 404, message: 'user not found' };

      // Validate password
      if (password !== passwordConfirmation) {
        return { code: 400, message: "passwords don't match" };
      }

      // Validate password format
      if (password?.length < 8) {
        return { code: 400, message: 'password must be at least 8 characters' };
      }

      if (!regexValidation(password, 'lowercase')) {
        return { code: 400, message: 'password must contain at least one lowercase letter' };
      }

      if (!regexValidation(password, 'uppercase')) {
        return { code: 400, message: 'password must contain at least one uppercase letter' };
      }

      if (!regexValidation(password, 'number')) {
        return { code: 400, message: 'password must contain at least one number' };
      }

      // Hash the new password
      const hashedPassword = await hashPassword(password);

      // Update user password
      const result = await repository.updateUserById(foundUser._id, { password: hashedPassword });
      if (!result) return { code: 404, message: 'user not found' };

      return { code: 200, message: 'password reset successfully' };
    } catch (error) {
      throw error;
    }
  };

  // Private functions
  const _googleSignin = async (credentials) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credentials,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture, sub } = payload;

    let user = await repository.getUsers({ email });
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
        integrations: [],
        picture
      }

      user = await repository.createUser(basicUser);
    } else {
      user = user[0];
      await repository.updateUserById(user._id, {
        name: given_name?.toString().trim().toLowerCase(),
        lastname: family_name?.toString().trim().toLowerCase(),
        picture
      });
    }

    const usrReduced = getCleanUser(user);
    const token = generateToken(usrReduced);

    return { code: 200, message: "success", info: usrReduced, token }
  }

  /* Strava API functions */
  const _exchangeCodeForToken = async (code) => {
    try {
      const client = httpClient({ baseURL: config.strava.api_url });
      const params = {
        client_id: config.strava.clientId,
        client_secret: config.strava.clientSecret,
        code: code,
        grant_type: 'authorization_code'
      };

      // if so, we proceed to exchange the code for an access token
      const response = await client.post('/oauth/token', params);
      if (response.status > 200) return { code: 500, message: 'Error during Strava API call' };

      const athleteToken = response.data;
      const stravaConfig = {
        name: "strava",
        refreshToken: athleteToken.refresh_token,
        accessToken: athleteToken.access_token,
        expiresAt: athleteToken.expires_at,
        tokenType: athleteToken.token_type,
        scope: "read,profile:read_all",
        metadata: JSON.stringify(athleteToken.athlete) // Store athlete data as metadata
      };

      return stravaConfig;
    } catch (error) {
      console.error("Error during Strava API call:", error);
      throw new Error('Error exchanging code for Strava token');
    }
  }

  const _refreshStravaToken = async (stravaConfig, userId) => {
    try {
      const params = {
        client_id: config.strava.clientId,
        client_secret: config.strava.clientSecret,
        refresh_token: stravaConfig.refreshToken,
        grant_type: 'refresh_token'
      };

      const client = httpClient({ baseURL: config.strava.api_url });
      const response = await client.post('/oauth/token', params);

      // Update the user's integration with the new access token
      const dbconfig = await repository.updateUserBy({ _id: userId, "integrations.name": "strava" }, {
        $set: {
          "integrations.$.refreshToken": response.data.refresh_token,
          "integrations.$.accessToken": response.data.access_token,
          "integrations.$.expiresAt": response.data.expires_at
        }
      });

      return dbconfig.integrations.find(i => i.name === "strava");
    } catch (error) {
      console.error("Error during Strava API call:", error.data || error.message);
      throw new Error('Error refreshing Strava token');
    }
  }

  const _validateStravaToken = async (stravaConfig, userId) => {
    if (stravaConfig.expiresAt && stravaConfig.expiresAt < Math.floor(Date.now() / 1000)) {
      console.log("Strava token expired, refreshing...");
      stravaConfig = await _refreshStravaToken(stravaConfig, userId);
    }

    return stravaConfig;
  }

  return {
    createUser,
    userSignIn,
    getUserById,
    getUsers,
    updateUser: async (_id, name, lastname, email, password, phoneNumber) => {
      const result = await repository.updateUserById({ _id }, { name, lastname, phoneNumber });

      if (!result) throw ({ message: `User id: (${_id}) not found` });

      return result
    },
    updateUserPassword: async (_id, password) => {
      const result = await repository.updateUserById({ _id }, { password });

      if (!result) throw ({ message: `User id: (${_id}) not found` });

      return result
    },
    updateUserStatus: async (_id, status) => {
      const result = await repository.updateUserById({ _id }, { status });

      if (!result) throw ({ message: `User id: (${_id}) not found` });

      return result
    },
    deleteUser: async (_id) => {
      const result = await repository.deleteUser({ _id });

      if (!result) throw ({ message: `User id: (${_id}) not found` });

      return result
    },
    createRateApp,
    addIntegration,
    activateUser,
    getStravaAthlete,
    forgotPassword,
    resetPassword
  }
}

export const userService = makeService({ ...makeUserRepository(UserModel) });