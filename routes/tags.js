const express = require('express');
const tagsControllers = require('../controllers/tags');
const tagsMiddlewares = require('../middlewares/tags');
const tagsValidators = require('../validators/tags');

const router = express.Router();

router.use(tagsMiddlewares.Authentication);

router.param('tagId', tagsMiddlewares.ExistsTag);

router.get('/', tagsControllers.AllTags);

router.get('/add', tagsControllers.AddTagPage);
router.post('/add', tagsValidators.addTagValidators, tagsMiddlewares.AddTagValidation, tagsControllers.AddTag);

router.get('/delete/:tagId', tagsControllers.Delete);

router.get('/edit/:tagId', tagsControllers.EditPage);
router.post('/edit/:tagId', tagsValidators.addTagValidators, tagsMiddlewares.EditTagValidation, tagsControllers.Edit);

router.get('/:tagId', tagsControllers.Profile);

module.exports = router;
