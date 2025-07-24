

export const config = {
  strava: {
    api_url: process.env.STRAVA_API_URL,
    clientId: process.env.STRAVA_CLIENT_ID,
    clientSecret: process.env.STRAVA_CLIENT_SECRET,
    verify_token: process.env.STRAVA_VERIFY_TOKEN
  },
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    ses: {
      from: process.env.AWS_SES_FROM_EMAIL
    }
  },
  resend: {
    api_key: process.env.RESEND_API_KEY,
    from: process.env.RESEND_FROM
  }
}