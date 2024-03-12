const Annotation = require('../models/annotations');

exports.Authentication = (req, res, next) => {
    if(req.session.user != undefined)
        next();
    else
        res.redirect('/users/login');
};

exports.ExistsAnnotation = async (req, res, next, id) => {
    try {
        let annotation = await Annotation.findOne({$and: [{_id: id}, {user: req.session.user._id}]});

        if(annotation == null)
            res.status(404).render('not_found');
        else {
            req.annotation = annotation;
            next();
        }
    } catch(e) {
        next(e);
    }
};
