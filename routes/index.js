var express = require('express');
var router = express.Router();

// import controller
const { UserGameController } = require('../controllers/UserGameController');
const { AuthController } = require('../controllers/AuthController');
const { FirebaseController } = require('../controllers/FirebaseController');
// import middleware
const { AuthorizationCheck } = require('../lib/AuthorizationCheck');

// // halaman root
// router.get("/", (req, res) => res.send("chapter 10 team 2"));

/* Auth API */
router.post('/login', AuthController.login);

/* API */
router.post('/usergame/insert', UserGameController.insertData);
router.post('/usergame/upload-profile-pic', FirebaseController.uploadImage);
router.post('/usergame/get', AuthorizationCheck, UserGameController.getData);
router.post('/usergame/update/profile', AuthorizationCheck, UserGameController.updateProfile);
router.post('/usergame/update/password', AuthorizationCheck, UserGameController.updatePassword);
router.post('/usergame/getProfilePicUrl', AuthorizationCheck, FirebaseController.getProfilePicUrl);
router.post('/gamehistory/insert', AuthorizationCheck, UserGameController.insertGameHistory);
router.post('/gamehistory/get', AuthorizationCheck, UserGameController.getGameHistory); 
router.post('/gamehistory/get/all', UserGameController.getAllGameHistory);
router.post('/gamehistory/get/rank', UserGameController.getRankGameHistory);

module.exports = router;