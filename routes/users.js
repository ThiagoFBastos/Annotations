const express = require('express');
const usersControllers = require('../controllers/users');
const usersMiddlewares = require('../middlewares/users');
const userValidators = require('../validators/users');

const router = express.Router();

router.get('/profile', usersMiddlewares.Authentication, (req, res) => res.render('users/profile', {title: 'Perfil', user: req.session.user, profileTab: true}));
router.post('/profile', usersMiddlewares.Authentication, userValidators.updateUserValidators, usersControllers.ChangeProfile);

router.get('/login', (req, res) => res.render('users/login', {title: 'Login'}));

router.post('/login', userValidators.loginUserValidators, usersControllers.Login);

router.get('/logout', usersMiddlewares.Authentication, usersControllers.Logout);

router.get('/register', (req, res) => res.render('users/register', {title: 'Registro'}));
router.post('/register', userValidators.registerUserValidators, usersControllers.Register);

router.post('/password', userValidators.passwordChangeUserValidators, usersControllers.ChangePassword);

module.exports = router;
