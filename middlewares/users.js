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
