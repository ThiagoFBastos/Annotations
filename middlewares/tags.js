const Tag = require('../models/tags');
const {validationResult} = require('express-validator');

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

exports.AddTagValidation = (req, res, next) => {
    const errors = validationResult(req);

    if(errors.isEmpty())
        next();
    else {
        let nameErrors = errors.errors.filter(error => error.path == 'name');
        let descriptionErrors = errors.errors.filter(error => error.path == 'description');

        res.render('tags/add', {
            title: 'Adicionar tag',
            nameErrors: nameErrors,
            descriptionErrors: descriptionErrors
        });
    }
};

exports.EditTagValidation = (req, res, next) => {
    const errors = validationResult(req);

    if(errors.isEmpty())
        next();
    else {
        let nameErrors = errors.errors.filter(error => error.path == 'name');
        let descriptionErrors = errors.errors.filter(error => error.path == 'description');

        res.render('tags/edit', {
            title:  `${req.tag.name} | editar`,
            tag: req.tag,
            nameErrors: nameErrors,
            descriptionErrors: descriptionErrors
        });
    }
};
