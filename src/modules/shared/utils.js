export const verifyBasicAuth = (authHeader) => {
    if (authHeader?.includes('Basic ')) {
        let base64Credentials = authorization.split(' ')[1]
        let credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')

        if (credentials?.includes(':')) {
            const [ usr, pwd ] = credentials?.split(':')

            let data = { usr, pwd }

            console.log(usr, pwd);

            return { data: data }
        } 
        
        return { error: 'invalid_format' }
    } 
    
    return { error: 'invalid_format' }
}