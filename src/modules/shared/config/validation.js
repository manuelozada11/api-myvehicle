export const varValidates = () => {
    ['SERVER_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_CLUSTER'].forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Variable ${key} is not defined`)
        }
    })
}