

export const config = {
  strava: {
    api_url: process.env.STRAVA_API_URL,
    clientId: process.env.STRAVA_CLIENT_ID,
    clientSecret: process.env.STRAVA_CLIENT_SECRET,
    verify_token: process.env.STRAVA_VERIFY_TOKEN
  },
  resend: {
    api_key: process.env.RESEND_API_KEY,
    from: process.env.RESEND_FROM
  }
}