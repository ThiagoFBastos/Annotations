const User = require('../models/users');
const {validationResult} = require('express-validator');

exports.Login = async (req, res, next) => {
	try {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
		    const {email, password} = req.body;
		    let user = await User.findOne({$and: [{email: email}, {password: password}]});

		    if(user == null) {
			    res.render('users/login', {
                    title: 'Login',
                    alert: {
                        class: 'alert-danger',
                        message: 'Usuário e/ou senha incorretos'
                    }
                });
            } else {
			    req.session.user = user;
			    res.redirect('/');
		    }
        } else {
            let emailErrors = errors.errors.filter(error => error.path == 'email');
            let passwordErrors = errors.errors.filter(error => error.path == 'password');

            res.render('users/login', {
                emailErrors: emailErrors,
                passwordErrors: passwordErrors
            });
        }
	} catch(e) {
		next(e);
	}
};

exports.Register = async (req, res, next) => {
	try {
        const errors = validationResult(req);

        if(errors.isEmpty()) {
		    const {first_name, last_name, email, password} = req.body;

            if(await User.exists({email: email})) {
                res.render('users/register', {
                    title: 'Registro',
                    alert: {
                        class: 'alert-danger',
                        message: 'Já existe um usuário com esse email'
                    }
                });
            } else {
		        let user = new User({first_name: first_name, last_name: last_name, email: email, password: password});
		        await user.save();

		        res.redirect('/users/login');
            }
        } else {
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
	} catch(e) {
		next(e);
	}
};

exports.Logout = async (req, res) => {
	req.session.destroy();
	res.redirect('/users/login');
};

exports.ProfilePage = (req, res) => {
    res.render('users/profile', {title: 'Perfil', profileTab: true});
};

exports.LoginPage = (req, res) => {
    res.render('users/login', {title: 'Login'});
};

exports.RegisterPage = (req, res) => {
    res.render('users/register', {title: 'Registro'});
};

exports.ChangeProfile = async (req, res, next) => {
	try {
        const errors = validationResult(req);

        if(errors.isEmpty()) {
		    const {first_name, last_name, email, password} = req.body;

		    if(password != req.session.user.password) {
			    res.render('users/profile', {
				    title: 'Perfil',
				    alertProfile: {
					    class: 'alert-danger',
					    message: 'Senha incorreta'
				    },
                    profileTab: true
			    });
            } else if(await User.exists({email: email})) {
                res.render('users/profile', {
				    title: 'Perfil',
				    alertProfile: {
					    class: 'alert-danger',
					    message: 'O email já está em uso'
				    },
                    profileTab: true
			    });
            } else {
			    await User.findByIdAndUpdate(req.session.user._id, {$set: {first_name: first_name, last_name: last_name, email: email}});

			    req.session.user = await User.findById(req.session.user._id);
                res.locals.user = req.session.user;

			    res.render('users/profile', {
				    title: 'Perfil',
				    alertProfile: {
					    class: 'alert-success',
					    message: 'Dados alterados com sucesso'
				    },
                    profileTab: true
			    });
		    }
        } else {
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
	} catch(e) {
		next(e);
	}
};

exports.ChangePassword = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if(errors.isEmpty()) {
            const {new_password, new_password_confirm, password} = req.body;

            if(new_password != new_password_confirm) {
                res.render('users/profile', {
                    title: 'Perfil',
                    alertPassword: {
                        class: 'alert-danger',
                        message: 'A nova senha e a sua confirmação não coincidem'
                    },
                    passwordTab: true
                });
            } else if(req.session.user.password != password) {
                res.render('users/profile', {
                    title: 'Perfil',
                    alertPassword: {
                        class: 'alert-danger',
                        message: 'Senha incorreta'
                    },
                    passwordTab: true
                });
            } else {
                await User.findByIdAndUpdate(req.session.user._id, {$set: {password: new_password}});

                req.session.user.password = new_password;

                res.render('users/profile', {
                    title: 'Perfil',
                    alertPassword: {
                        class: 'alert-success',
                        message: 'Senha alterada com sucesso'
                    },
                    passwordTab: true
                });
            }
        } else {
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
    } catch(e) {
        next(e);
    }
};
