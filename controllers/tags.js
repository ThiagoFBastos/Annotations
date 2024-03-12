const Tag = require('../models/tags');
const Annotation = require('../models/annotations');
const mongoose = require('../models/db');
const {validationResult} = require('express-validator');

const PAGINATION = 8;

exports.AllTags = async (req, res, next) => {
    try {
        let tags = await Tag.find({user: req.session.user._id});
        let blocks = [];
        for(let i = 0; i < tags.length; ++i) {
            if(i % 4 == 0)
                blocks.push([]);
            blocks[i >> 2].push(tags[i]);
        }
        res.render('tags/all', {
            title: 'Todas as tags',
            tags: blocks
        });
    } catch(e) {
        next(e);
    }
};

exports.Profile = async (req, res, next) => {
    try {
        const ObjectId = mongoose.Types.ObjectId;
        const page = parseInt(req.query.page ?? 1);
        let tag = await Tag.findOne({$and: [{_id: req.params.tagId}, {user: req.session.user._id}]});

        if(tag == null)
            res.status(404).render('not_found');
        else {
            let annotations = await Annotation.find({tags: req.params.tagId}).skip((page - 1) * PAGINATION).limit(PAGINATION);
            let countPages = Math.ceil((await Annotation.find({tags: new ObjectId(req.params.tagId)}).count()) / PAGINATION);
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
                        url: `/tags/${req.params.tagId}?page=${curPage}`,
                        page: curPage,
                        current: curPage == page
                    });
                }
            }

            res.render('tags/tag', {
                title: tag.name,
                tag: tag,
                annotations: annotations,
                URL_PREVIOUS: page == 1 ? false: `/tags/${req.params.tagId}?page=${page - 1}`,
                URL_NEXT: page == countPages ? false: `/tags/${req.params.tagId}?page=${page+1}`,
                navigationPages: navigationPages
            });
        }
    } catch(e) {
        next(e);
    }
};

exports.AddTag = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            let nameErrors = errors.errors.filter(error => error.path == 'name');
            let descriptionErrors = errors.errors.filter(error => error.path == 'description');

            res.render('tags/add', {
                title: 'Adicionar tag',
                nameErrors: nameErrors,
                descriptionErrors: descriptionErrors
            });
        } else {
            const {name, description} = req.body;
            let tag = new Tag({name: name, description: description, user: req.session.user._id});
            await tag.save();

            res.render('tags/add', {
                title: 'Adicionar tag',
                alert: {
                    class: 'alert-success',
                    message: 'Tag adicionada com sucesso'
                }
            });
        }
    } catch(e) {
        next(e);
    }
}

exports.Delete = async (req, res, next) => {
    try {
        if(await Tag.exists({$and: [{_id: req.params.tagId}, {user: req.session.user._id}]})) {
            await Tag.findByIdAndDelete(req.params.tagId);
            res.redirect('/');
        } else
            res.status(404).render('not_found');
    } catch(e) {
        next(e);
    }
};

exports.EditPage = async (req, res, next) => {
    try {
        let tag = await Tag.findOne({$and: [{_id: req.params.tagId}, {user: req.session.user._id}]});

        if(tag == null)
            res.status(404).render('not_found');
        else {
            res.render('tags/edit', {
                title: `${tag.name} | editar`,
                tag: tag
            });
        }
    } catch(e) {
        next(e);
    }
};

exports.Edit = async (req, res, next) => {
    try {
        if(await Tag.exists({$and: [{_id: req.params.tagId}, {user: req.session.user._id}]})) {
            const errors = validationResult(req);

            if(errors.isEmpty()) {
                const {name, description} = req.body;

                await Tag.findByIdAndUpdate(req.params.tagId, {$set: {name: name, description: description}});

                let tag = await Tag.findById(req.params.tagId);

                res.render('tags/edit', {
                    title: `${tag.name} | editar`,
                    tag: tag,
                    alert: {
                        class: 'alert-success',
                        message: 'Tag alterada com sucesso'
                    }
                });
            } else {
                let nameErrors = errors.errors.filter(error => error.path == 'name');
                let descriptionErrors = errors.errors.filter(error => error.path == 'description');
                let tag = await Tag.findById(req.params.tagId);

                res.render('tags/edit', {
                    title:  `${tag.name} | editar`,
                    tag: tag,
                    nameErrors: nameErrors,
                    descriptionErrors: descriptionErrors
                });
            }
        } else
            res.status(404).render('not_found');
    } catch(e) {
        next(e);
    }
};
