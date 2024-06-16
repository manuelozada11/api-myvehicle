import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
    const auth = req.headers.authorization;

    if (!auth) return res.status(401).json({ code: 400, message: "MISSING_TOKEN" });

    if (!auth?.includes('Bearer ')) return res.status(401).json({ code: 400, message: "INVALID_TOKEN" });
    const token = auth.replace('Bearer ', '');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(401).json({ code: 401, message: 'UNAUTHORIZED_USER' });

        if (user.iss === process.env.JWT_ISS) {
            req.user = user;
            next();
        }
        else return res.status(401).json({ message: 'UNAUTHORIZED_USER', code: 401 });
    });
}