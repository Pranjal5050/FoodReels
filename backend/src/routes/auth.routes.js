const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');


/* User APIs */
router.post('/user/register', AuthController.registeruser);
router.post('/user/login', AuthController.loginuser);
router.get('/user/logout', AuthController.logout);

/* foodPartner APIs */
router.post('/food-partner/register', AuthController.registerfoodpartner);
router.post('/food-partner/login', AuthController.loginfoodpartner);
router.get('/food-partner/logout', AuthController.logoutfoodPartner);

module.exports = router;