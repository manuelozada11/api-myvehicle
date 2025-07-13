import { defaultCatcher } from '../../../shared/config/defaultCatcher.js';
import { config } from '../../../shared/config/config.js';
import _ from 'lodash';
import { stravaService } from '../services/strava.service.js';

export const verifyChallenge = async (req, res) => {
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (!mode) return res.status(400).json({ code: 400, message: 'missing mode field' });
    if (!token) return res.status(400).json({ code: 400, message: 'missing token field' });
    if (!challenge) return res.status(400).json({ code: 400, message: 'missing challenge field' });

    if (mode === 'subscribe' && token === config.strava.verify_token) {
      return res.status(200).json({ hub: { challenge } });
    }

    return res.status(400).json({ code: 400, message: 'invalid mode or token' });
  } catch (e) {
    defaultCatcher(e, res);
  }
}

export const newEvent = async (req, res) => {
  try {
    const event = _.pick(req.body, "object_id", "aspect_type", "action", "event_time", "object_type", "owner_id", "subscription_id", "updates");

    if (event.object_type === "activity" && (event.aspect_type === "create" || event.aspect_type === "update" || event.aspect_type === "delete")) {
      await stravaService.handleActivity(event);
    }

    return res.status(200).json({ code: 200, message: 'event received' });
  } catch (e) {
    defaultCatcher(e, res);
  }
}
