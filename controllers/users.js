const User = require('../models/users');

exports.Login = async (req, res, next) => {
	try {   
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
	} catch(e) {
		next(e);
	}
};

exports.Register = async (req, res, next) => {
	try {
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
	    const {first_name, last_name, email, password} = req.body;

        let context = {title: 'Perfil', profileTab: true};

	    if(password != req.session.user.password)
            context.alertProfile = {class: 'alert-danger', message: 'Senha incorreta'};	   
        else if(await User.exists({$and: [{email: email}, {_id: {$ne: req.session.user._id}}]}))
            context.alertProfile = {class: 'alert-danger', message: 'O email já está em uso'};
        else {
		    await User.findByIdAndUpdate(req.session.user._id, {$set: {first_name: first_name, last_name: last_name, email: email}});
		    req.session.user = await User.findById(req.session.user._id);
            res.locals.user = req.session.user;
		    context.alertProfile = {class: 'alert-success', message: 'Dados alterados com sucesso'};
	    }

        res.render('users/profile', context);
	} catch(e) {
		next(e);
	}
};

exports.ChangePassword = async (req, res, next) => {
    try {
        const {new_password, new_password_confirm, password} = req.body;

        let context = {title: 'Perfil', passwordTab: true};

        if(new_password != new_password_confirm)
            context.alertPassword = {class: 'alert-danger',message: 'A nova senha e a sua confirmação não coincidem'};
        else if(req.session.user.password != password)
            context.alertPassword = {class: 'alert-danger',message: 'Senha incorreta'};
        else {
            await User.findByIdAndUpdate(req.session.user._id, {$set: {password: new_password}});
            req.session.user.password = new_password;
            context.alertPassword = {class: 'alert-success', message: 'Senha alterada com sucesso'};
        }

        res.render('users/profile', context);
    } catch(e) {
        next(e);
    }
};
