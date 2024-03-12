const Tag = require('../models/tags');

exports.Authentication = (req, res, next) => {
    if(req.session.user == undefined)
        res.redirect('/users/login');
    else
        next();
};

exports.ExistsTag = async (req, res, next, id) => {
    try {
        let tag = await Tag.findOne({$and: [{_id: id}, {user: req.session.user._id}]});
        
        if(tag == null)
            res.status(404).render('not_found');
        else {
            req.tag = tag;
            next();
        }
    } catch(e) {
        next(e);
    }
};
