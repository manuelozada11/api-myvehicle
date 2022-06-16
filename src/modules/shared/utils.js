export const verifyBasicAuth = (authHeader) => {
    if (!authHeader?.includes('Basic ')) return { error: 'invalid authorization header' };
    
    let base64Credentials = authorization.split(' ')[1]
    let credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')

    if (!credentials?.includes(':')) return { error: 'invalid authorization header' };

    const [ usr, pwd ] = credentials?.split(':')

    return { usr, pwd }
}

export const validatePassword = (password, confirmPwd) => {
    if (password !== confirmPwd) return { error: 'password doesn\'t match' }
    
    // para validar números, letras y caracteres especiales
    const regexLetras = /[a-zA-Z]+/;
    const regexNum = /[0-9]+/;
    const regexChar = /["#$%&/()=¿?¡!_.,+*']+/;

    if (!regexLetras.test(password)) return { error: 'password must contain at least one letter' }
    if (!regexNum.test(password)) return { error: 'password must contain at least one number' }
    if (!regexChar.test(password)) return { error: 'password must contain at least one special character' }

    return false
}

export const validateEmail = (email) => {
    const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regexEmail.test(email)) return { error: 'invalid email' }

    return false
}