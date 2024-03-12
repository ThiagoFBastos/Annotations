const express = require('express');
const usersControllers = require('../controllers/users');
const usersMiddlewares = require('../middlewares/users');
const userValidators = require('../validators/users');

const router = express.Router();

router.get('/profile', usersMiddlewares.Authentication, usersControllers.ProfilePage);
router.post('/profile', usersMiddlewares.Authentication, userValidators.updateUserValidators, usersControllers.ChangeProfile);

router.get('/login', usersMiddlewares.AlredyAuthenticated, usersControllers.LoginPage);

router.post('/login', usersMiddlewares.AlredyAuthenticated, userValidators.loginUserValidators, usersControllers.Login);

router.get('/logout', usersMiddlewares.Authentication, usersControllers.Logout);

router.get('/register', usersMiddlewares.AlredyAuthenticated, usersControllers.RegisterPage);
router.post('/register', usersMiddlewares.AlredyAuthenticated, userValidators.registerUserValidators, usersControllers.Register);

router.post('/password', userValidators.passwordChangeUserValidators, usersControllers.ChangePassword);

module.exports = router;
