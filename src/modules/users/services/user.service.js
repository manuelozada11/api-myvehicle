import { getCleanUser, generateToken, hashPassword, regexValidation } from '../users.utils.js';
import { OAuth2Client } from 'google-auth-library';
import { UserModel } from "../models/user.model.js";
import { makeUserRepository } from "../repositories/index.js";
import bcrypt from 'bcryptjs';
import { httpClient } from '../../../shared/infra/http/httpClient.js';
import { config } from "../../../shared/config/config.js";
import { emailService } from '../../../shared/services/email.service.js';

export const makeService = (repository) => {
  const createUser = async ({ lang, password, name, lastname, username, email, country, termsAccepted, ...fields }) => {
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
      country: country?.toString().trim(),
      termsAccepted: termsAccepted || false,
      password: hashed,
      role: "customer",
      notifications: [],
      integrations: [],
      language: lang
    }

    response = await repository.createUser(user);

    // Send welcome email using AWS SES
    try {
      const usrReduced = getCleanUser(response);
      const token = generateToken(usrReduced);

      await emailService.sendWelcomeEmail({
        to: user.email,
        name: user.name,
        token,
        lang
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't fail user creation if email fails
    }

    return { code: 200, message: 'USER_CREATED_SUCCESSFULLY' };
  }

  const userSignIn = async ({ usr, pwd, googleToken, lang }) => {
    if (googleToken) return await _googleSignin(googleToken, lang);

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

  const getUsers = async (filter, noReduced = false) => {
    const users = await repository.getUsers(filter);

    if (!users.length) return [];

    if (noReduced) return users;

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

    const athleteToken = await _exchangeCodeForToken(code);

    const stravaConfig = {
      name: "strava",
      user: { _id },
      userId: athleteToken.athlete.id,
      refreshToken: athleteToken.refresh_token,
      accessToken: athleteToken.access_token,
      expiresAt: athleteToken.expires_at,
      tokenType: athleteToken.token_type,
      scope: "read,activity:read,activity:read_all,profile:read_all",
      metadata: JSON.stringify(athleteToken.athlete) // Store athlete data as metadata
    };

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

  const getStravaAthlete = async (userConfig) => {
    try {
      // Validate the Strava token
      userConfig = await _validateStravaToken(userConfig);

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

    // Send password reset email using AWS SES
    try {
      await emailService.sendPasswordResetEmail({
        to: user.email,
        name: userReduced.name,
        token,
        lang
      });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return { code: 500, message: 'error sending reset email' };
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

      if (!regexValidation(password, "password")) {
        return { code: 400, message: "password doesn't meet requirements" };
      }

      const hashed = await hashPassword(password);
      const result = await repository.updateUserById(user._id, { password: hashed });

      if (!result) return { code: 404, message: 'user not found' };

      return { code: 200, message: 'password reset successfully' };
    } catch (error) {
      console.error("Error resetting password:", error);
      return { code: 500, message: 'error resetting password' };
    }
  }

  const markNotificationAsRead = async ({ _id, notificationId }) => {
    try {
      const result = await repository.updateUserBy(
        { _id, "notifications._id": notificationId },
        { $set: { "notifications.$.read": true } });

      if (!result) return { code: 404, message: 'user not found' };

      return { code: 200, message: 'notification marked as read' };
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return { code: 500, message: 'error marking notification as read' };
    }
  }

  const addNotification = async ({ _id, ...body }) => {
    const result = await repository.updateUserById(_id, { $push: { notifications: { message: body.message } } });
    if (!result) return { code: 404, message: 'user not found' };

    return { code: 200, message: 'notification added successfully' };
  }

  const googleSignup = async ({ googleToken, ...fields }) => {
    const payload = await _googleValidateTicket(googleToken);
    if (!payload) return { code: 400, message: 'invalid google token' };

    // we get the user info from the google payload
    const { email, given_name, family_name, picture, sub } = payload;

    const validate = await repository.getUsers({ email });
    if (fields?.step === "validate") {
      if (validate.length > 0) return { code: 400, message: 'user already exists' };

      return { code: 200, message: "success", info: { name: given_name, lastname: family_name } };
    }

    const user = {
      status: true,
      username: sub,
      email,
      name: given_name?.toString().trim().toLowerCase(),
      lastname: family_name?.toString().trim().toLowerCase(),
      country: fields.country?.toString().trim() || 'none',
      termsAccepted: fields.termsAccepted || false,
      password: 'googleauth',
      role: "customer",
      notifications: [],
      integrations: [],
      picture,
      language: fields.lang,
    }

    const created = await repository.createUser(user);

    const reduced = getCleanUser(created);
    const token = generateToken(reduced);

    return { code: 200, message: "success", info: reduced, token, user: created }
  }

  // Private functions
  const _googleValidateTicket = async (credentials) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credentials,
      audience: clientId
    });

    if (!ticket) return null;
    return ticket.getPayload();
  }

  const _googleSignin = async (credentials) => {
    const payload = await _googleValidateTicket(credentials);
    if (!payload) return { code: 400, message: 'invalid google token' };

    // we get the email from the google payload
    const { email } = payload;

    const users = await repository.getUsers({ email });
    if (!users.length) return { code: 400, message: 'user not found' };

    const user = users[0];
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
      if (response.status > 200) throw new Error('Error exchanging code for Strava token');

      return response.data;
    } catch (error) {
      console.error("Error during Strava API call:", error);
      throw new Error('Error exchanging code for Strava token');
    }
  }

  const _refreshStravaToken = async (stravaConfig) => {
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
      const dbconfig = await repository.updateUserBy({ _id: stravaConfig.user._id, "integrations.name": "strava" }, {
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

  const _validateStravaToken = async (stravaConfig) => {
    if (stravaConfig.expiresAt && stravaConfig.expiresAt < Math.floor(Date.now() / 1000)) {
      console.log("Strava token expired, refreshing...");
      stravaConfig = await _refreshStravaToken(stravaConfig);
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
    resetPassword,
    addNotification,
    markNotificationAsRead,
    googleSignup
  }
}

export const userService = makeService({ ...makeUserRepository(UserModel) });