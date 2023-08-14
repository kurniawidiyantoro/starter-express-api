const { userGameModel } = require('../models/UserGameModel');
const CryptoJS = require('crypto-js');
const JWT = require('jsonwebtoken');

// const readToken = JWT.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiaWQiOjEsImlhdCI6MTY4OTkyMTk5OCwiZXhwIjoxNjg5OTI1NTk4fQ.DsvIpHgnIKKoVLEaYPMLOx1Z7kiNGR7y3y2-9dWwnOs", process.env.SECRET_JWT);
// console.log(readToken);

class AuthController {
    static async login(req, res) {
        try {
            // 1. Ambil data dari usernya
            const payload = req.body;
            const inputEmail = payload.email;
            const inputPassword = payload.password;
            // console.log('Payload: ', payload);
            // console.log('inputEmail: ', inputEmail);
            // console.log('inputPassword: ', inputPassword);

            // 2. Cari data usernya di database
            const userData = await userGameModel.getUserGame(inputEmail);
            console.log(userData);

            // 3. Kalau data user gak ada, lempar error
            if(userData === null) {
                console.log('Invalid Email !');
                return res.status(400).json({ message: 'Invalid Email !'});
            }

            // 4. kalau passwordnya gak match, lempar error
            const inputHashedPassword = CryptoJS.HmacSHA256(inputPassword, process.env.SECRET_LOGIN).toString();
            // console.log(inputHashedPassword);

            if(inputHashedPassword !== userData.password) {
                console.log('Invalid Password !');
                return res.status(400).json({ message: 'Invalid Password !'});
            }

            // 5. Passwordnya match, bikin token otorisasi dengan JWT
            const token = JWT.sign({ username: userData.username, id: userData.id }, process.env.SECRET_JWT, { expiresIn: '1h' });
            
            // 6. kirim tokennya ke user / frontend
            res.json({ message: 'success', email: userData.email, token });
        } catch(error) {
            console.log(error);
            res.status(500).json('Internal Server Error !');
        }
    }
}

module.exports = { AuthController }