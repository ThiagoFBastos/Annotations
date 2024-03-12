const express = require('express');
const tagsControllers = require('../controllers/tags');
const tagsMiddlewares = require('../middlewares/tags');
const tagsValidators = require('../validators/tags');

const router = express.Router();

router.use(tagsMiddlewares.Authentication);

router.get('/', tagsControllers.AllTags);

router.get('/add', (req, res) => res.render('tags/add', {title: 'Adicionar Tag'}));
router.post('/add', tagsValidators.addTagValidators, tagsControllers.AddTag);

router.get('/delete/:tagId', tagsControllers.Delete);

router.get('/edit/:tagId', tagsControllers.EditPage);
router.post('/edit/:tagId', tagsValidators.addTagValidators, tagsControllers.Edit);

router.get('/:tagId', tagsControllers.Profile);

module.exports = router;
