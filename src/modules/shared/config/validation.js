export const varValidates = () => {
    ['SERVER_PORT', 'MONGODB_URI'].forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Variable ${key} is not defined`)
        }
    })
}