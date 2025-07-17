export const varValidates = () => {
    ['MONGODB_URI', 'JWT_SECRET', 'JWT_ISS', 'SENTRY_DSN'].forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Variable ${key} is not defined`)
        }
    })
}