const Annotation = require('../models/annotations');
const Tag = require('../models/tags');
const {validationResult} = require('express-validator');

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

exports.AddAnnotationValidation = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if(errors.isEmpty())
            next();
        else {
            let titleErrors = errors.errors.filter(error => error.path == 'title');
            let descriptionErrors = errors.errors.filter(error => error.path == 'description');

            res.render('annotations/add', {
                title: 'Adicionar anotação',
                tags: await Tag.find({user: req.session.user._id}),
                titleErrors: titleErrors,
                descriptionErrors: descriptionErrors
            });
        }
    } catch(e) {
        next(e);
    }
};

exports.EditAnnotationValidation = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if(errors.isEmpty())
            next();
        else {

            let titleErrors = errors.errors.filter(error => error.path == 'title');
            let descriptionErrors = errors.errors.filter(error => error.path == 'description');

            let annotation = await req.annotation.populate('tags');

            let tags = (await Tag.find({user: req.session.user._id})).map(tag => {
                tag.selected = annotation.tags.find(value => value.equals(tag._id)) != undefined;
                return tag;
            });

            res.render('annotations/edit', {
                title: `${annotation.title} | editar`,
                annotation: annotation,
                tags: tags,
                titleErrors: titleErrors,
                descriptionErrors: descriptionErrors
            });
        }
    } catch(e) {
        next(e);
    }
};
