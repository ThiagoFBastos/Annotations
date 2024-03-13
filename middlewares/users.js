const {validationResult} = require('express-validator');

exports.Authentication = (req, res, next) => {
    if(req.session.user == undefined)
        res.redirect('/users/login');
    else
        next();
};

exports.AlredyAuthenticated = (req, res, next) => {
    if(req.session.user)
        res.redirect('/');
    else
        next();
};

exports.LoginValidation = (req, res, next) => {
    const errors = validationResult(req);

    if(errors.isEmpty()) 
        next();
    else {
        let emailErrors = errors.errors.filter(error => error.path == 'email');
        let passwordErrors = errors.errors.filter(error => error.path == 'password');

        res.render('users/login', {
            emailErrors: emailErrors,
            passwordErrors: passwordErrors
        });
    }
};

exports.RegisterValidation = (req, res, next) => {
    const errors = validationResult(req);

    if(errors.isEmpty())
        next();
    else {
        let firstNameErrors = errors.errors.filter(error => error.path == 'first_name');
        let lastNameErrors = errors.errors.filter(error => error.path == 'last_name');
        let emailErrors = errors.errors.filter(error => error.path == 'email');
        let passwordErrors = errors.errors.filter(error => error.path == 'password');

        res.render('users/register', {
            title: 'Registro',
            firstNameErrors: firstNameErrors,
            lastNameErrors: lastNameErrors,
            emailErrors: emailErrors,
            passwordErrors: passwordErrors
        });
    }
};

exports.ChangeProfileValidation = (req, res, next) => {
    const errors = validationResult(req);

    if(errors.isEmpty())
        next();
    else {
        let firstNameErrors = errors.errors.filter(error => error.path == 'first_name');
        let lastNameErrors = errors.errors.filter(error => error.path == 'last_name');
        let emailErrors = errors.errors.filter(error => error.path == 'email');

        res.render('users/profile', {
            title: 'Perfil',
            firstNameErrors: firstNameErrors,
            lastNameErrors: lastNameErrors,
            emailErrors: emailErrors,
            profileTab: true
        });
    }
};

exports.ChangePasswordValidation = (req, res, next) => {
    const errors = validationResult(req);

    if(errors.isEmpty())
        next();
    else {
        let newPasswordErrors = errors.errors.filter(error => error.path == 'new_password');
        let newPasswordConfirmErrors = errors.errors.filter(error => error.path == 'new_password_confirm');
        let passwordErrors = errors.errors.filter(error => error.path == 'password');

        res.render('users/profile', {
            title: 'Perfil',
            newPasswordErrors: newPasswordErrors,
            newPasswordConfirmErrors: newPasswordConfirmErrors,
            passwordErrors: passwordErrors,
            passwordTab: true
        });
    }
};
