const JWT = require('jsonwebtoken');

function AuthorizationCheck(req, res, next) {
    const token = req.headers.authorization;

    // 1. Cek apakah sudah ada token
    // if(token === undefined || token === null) {
    if(!token) {
        // 2. Jika tidak ada token, berikan respon 401
        return res.status(401).json({ message: 'Not Authorized !' });
    }

    // 3. Kalau ada token tetapi tokennya tidak valid maka berikan respon 401
    try {
        const validToken = JWT.verify(token.replace('Basic ', ''), process.env.SECRET_JWT);
    } catch(error) {
        console.log(error);
        return res.status(401).json({ message: 'Not Authorized !' });
    }

    // 4. Kalau ada token dan tokennya valid maka diperbolehkan akses API
    next();
}

module.exports = { AuthorizationCheck }