export const customError = (message, code) => {
    let err = new Error();

    if (code) err.code = code;
    err.message = message;
    
    return err;
}