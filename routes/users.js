const express = require('express');
const usersControllers = require('../controllers/users');
const usersMiddlewares = require('../middlewares/users');
const userValidators = require('../validators/users');

const router = express.Router();

router.get('/profile', usersMiddlewares.Authentication, usersControllers.ProfilePage);
router.post('/profile', usersMiddlewares.Authentication, userValidators.updateUserValidators, usersMiddlewares.ChangeProfileValidation, usersControllers.ChangeProfile);

router.get('/login', usersMiddlewares.AlredyAuthenticated, usersControllers.LoginPage);

router.post('/login', usersMiddlewares.AlredyAuthenticated, userValidators.loginUserValidators, usersMiddlewares.LoginValidation, usersControllers.Login);

router.get('/logout', usersMiddlewares.Authentication, usersControllers.Logout);

router.get('/register', usersMiddlewares.AlredyAuthenticated, usersControllers.RegisterPage);
router.post('/register', usersMiddlewares.AlredyAuthenticated, userValidators.registerUserValidators, usersMiddlewares.RegisterValidation, usersControllers.Register);

router.post('/password', userValidators.passwordChangeUserValidators, usersMiddlewares.ChangePasswordValidation, usersControllers.ChangePassword);

module.exports = router;
