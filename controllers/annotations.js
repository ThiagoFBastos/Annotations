const Annotation = require('../models/annotations');
const Tag = require('../models/tags');
const mongoose = require('../models/db');
const {validationResult} = require('express-validator');

const PAGINATION = 8;

exports.AllAnnotations = async (req, res, next) => {
    try {
        const ObjectId = mongoose.Types.ObjectId;
        let page = parseInt(req.query.page ?? 1);
        let countPages = Math.ceil((await Annotation.find({user: new ObjectId(req.session.user._id)}).count()) / PAGINATION);
        let annotations = await Annotation.find({user: req.session.user._id}).skip((page - 1) * PAGINATION).limit(PAGINATION);
        let navigationPages = [];
        let delta;

        if(countPages < 5 || page <= 2) delta = page - 1;
        else if(page - 2 >= 1 && page + 2 <= countPages) delta = 2;
        else if(page - 3 >= 1 && page + 1 <= countPages) delta = 3;
        else delta = 4;

        for(let i = 0; i < 5; ++i) {
            let curPage = page - delta + i;
            if(curPage <= countPages) {
                navigationPages.push({
                    url: `/annotations?page=${curPage}`,
                    page: curPage,
                    current: curPage == page
                });
            }
        }

        res.render('annotations/all', {
            title: 'Anotações',
            URL_PREVIOUS: page == 1 ? false : `/annotations?page=${page - 1}`,
            URL_NEXT: page == countPages ? false: `/annotations?pahe=${page + 1}`,
            navigationPages: navigationPages,
            annotations: annotations
        });
    } catch(e) {
        next(e);
    }
};

exports.AddAnnotationPage = async (req, res, next) => {
    try {
        let tags = await Tag.find({user: req.session.user._id});
        res.render('annotations/add', {
            title: 'Adicionar anotação',
            tags: tags
        });
    } catch(e) {
        next(e);
    }
};

exports.AddAnnotation = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            let titleErrors = errors.errors.filter(error => error.path == 'title');
            let descriptionErrors = errors.errors.filter(error => error.path == 'description');

            res.render('annotations/add', {
                title: 'Adicionar anotação',
                tags: await Tag.find({user: req.session.user._id}),
                titleErrors: titleErrors,
                descriptionErrors: descriptionErrors
            });
        } else {
            const ObjectId = mongoose.Types.ObjectId;

            [{title, description, tags} = req.body];

            if(typeof(tags) != 'object')
                tags = [tags];

            tags = tags.map(id => new ObjectId(id));
            let annotation = new Annotation({title: title, description: description, tags: tags, user: req.session.user._id});
            await annotation.save();

            res.render('annotations/add', {
                title: 'Adicionar anotação',
                tags: await Tag.find({user: req.session.user._id}),
                alert: {
                    class: 'alert-success',
                    message: 'A anotação foi criada com sucesso'
                }
            });
        }
    } catch(e) {
        next(e);
    }
};

exports.Profile = async (req, res, next) => {
    try {
        let annotation = await Annotation.findOne({$and : [{_id: req.params.annotationId}, {user: req.session.user._id}]}).populate('tags');

        if(annotation == null)
            res.status(404).render('not_found');
        else {
            let partial_tags = annotation.tags.slice(0, 3);
            let hasMoreThanThree = annotation.tags.length > 3;

            res.render('annotations/annotation', {
                title: annotation.title,
                annotation: annotation,
                partial_tags: partial_tags,
                hasMoreThanThree: hasMoreThanThree
            })
        }
    } catch(e) {
        next(e);
    }
};

exports.EditPage = async (req, res, next) => {
    try {
        let annotation = await Annotation.findOne({$and: [{_id: req.params.annotationId}, {user: req.session.user._id}]}).populate('tags');

        if(annotation == null)
            res.status(404).render('not_found');
        else {
            let tags = (await Tag.find({user: req.session.user._id})).map(tag => {
                tag.selected = annotation.tags.find(value => value.equals(tag._id)) != undefined;
                return tag;
            });
            res.render('annotations/edit', {
                title: `${annotation.title} | editar`,
                annotation: annotation,
                tags: tags
            });
        }
    } catch(e) {
        next(e);
    }
};

exports.Edit = async (req, res, next) => {
    try {
        if(await Annotation.exists({$and: [{_id: req.params.annotationId}, {user: req.session.user._id}]})) {
            const errors = validationResult(req);

            if(errors.isEmpty()) {
                const ObjectId = mongoose.Types.ObjectId;

                [{title, description, tags} = req.body];

                if(typeof(tags) != 'object')
                    tags = [tags];

                tags = tags.map(id => new ObjectId(id));
                await Annotation.findByIdAndUpdate(req.params.annotationId, {$set: {title: title, description: description, tags: tags}});
                
                res.redirect('/annotations/' + req.params.annotationId);
            } else {
                let titleErrors = errors.errors.filter(error => error.path == 'title');
                let descriptionErrors = errors.errors.filter(error => error.path == 'description');

                let annotation = await Annotation.findById(req.params.annotationId).populate('tags');

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
        } else
            res.status(404).render('not_found');
    } catch(e) {
        next(e);
    }
};

exports.Delete = async (req, res, next) => {
    try {
        if(await Annotation.exists({$and: [{_id: req.params.annotationId}, {user: req.session.user._id}]})) {
            await Annotation.findByIdAndDelete(req.params.annotationId);
            res.redirect('/');
        } else
            res.status(404).render('not_found');
    } catch(e) {
        next(e);
    }
};

exports.Search = async (req, res, next) => {
    try {
        const ObjectId = mongoose.Types.ObjectId;
        let page = parseInt(req.query.page ?? 1);
        let keywords = req.query.keywords;
        let annotations = await Annotation.find({$and: [{title: {$regex: keywords, $options: 'i'}}, {user: req.session.user._id}]}).skip((page - 1) * PAGINATION).limit(PAGINATION);
        let countPages = Math.ceil((await Annotation.find({$and: [{title: {$regex: keywords, $options: 'i'}}, {user: new ObjectId(req.session.user._id)}]}).count()) / PAGINATION);
        let navigationPages = [];
        let delta;

        if(countPages < 5 || page <= 2) delta = page - 1;
        else if(page - 2 >= 1 && page + 2 <= countPages) delta = 2;
        else if(page - 3 >= 1 && page + 1 <= countPages) delta = 3;
        else delta = 4;

        for(let i = 0; i < 5; ++i) {
            let curPage = page - delta + i;
            if(curPage <= countPages) {
                navigationPages.push({
                    url: `/annotations/search?keywords=${keywords}&page=${curPage}`,
                    page: curPage,
                    current: curPage == page
                });
            }
        }

        res.render('annotations/search', {
            title: `Resultados de: ${keywords}`,
            annotations: annotations,
            URL_PREVIOUS: page == 1 ? false : `/annotations/search?keywords=${keywords}&page=${page - 1}`,
            URL_NEXT: page == countPages ? false : `/annotations/search?keywords=${keywords}&page=${page + 1}`,
            navigationPages: navigationPages
        });
    } catch(e) {
        next(e);
    }
};
