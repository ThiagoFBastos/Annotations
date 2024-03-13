const Tag = require('../models/tags');
const Annotation = require('../models/annotations');
const mongoose = require('../models/db');
const asyncHandler = require('express-async-handler')

const PAGINATION = 8;

exports.AllTags = asyncHandler(async (req, res, next) => {
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
});

exports.Profile = asyncHandler(async (req, res, next) => {
    const ObjectId = mongoose.Types.ObjectId;
    const page = parseInt(req.query.page ?? 1);
    let tag = req.tag;
    let annotations = await Annotation.find({tags: req.params.tagId}).skip((page - 1) * PAGINATION).limit(PAGINATION);
    let countPages = Math.ceil((await Annotation.find({tags: new ObjectId(req.params.tagId)}).count()) / PAGINATION);
    let navigationPages = [], delta;

    if(countPages < 5 || page <= 2) delta = page - 1;
    else if(page - 2 >= 1 && page + 2 <= countPages) delta = 2;
    else if(page - 3 >= 1 && page + 1 <= countPages) delta = 3;
    else delta = 4;

    for(let i = 0; i < 5 && page - delta + i <= countPages; ++i) {
        let curPage = page - delta + i;
        navigationPages.push({
            url: `/tags/${req.params.tagId}?page=${curPage}`,
            page: curPage,
            current: curPage == page
        });  
    }

    res.render('tags/tag', {
        title: tag.name,
        tag: tag,
        annotations: annotations,
        URL_PREVIOUS: page == 1 ? false: `/tags/${req.params.tagId}?page=${page - 1}`,
        URL_NEXT: page == countPages ? false: `/tags/${req.params.tagId}?page=${page+1}`,
        navigationPages: navigationPages
    });
});

exports.AddTagPage = (req, res) => {
    res.render('tags/add', {title: 'Adicionar Tag'});
};

exports.AddTag = asyncHandler(async (req, res, next) => {
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
});

exports.Delete = asyncHandler(async (req, res, next) => {
    await Tag.findByIdAndDelete(req.params.tagId);
    res.redirect('/');
});

exports.EditPage = (req, res, next) => {
    res.render('tags/edit', {
        title: `${req.tag.name} | editar`,
        tag: req.tag
    });
};

exports.Edit = asyncHandler(async (req, res, next) => {
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
});
