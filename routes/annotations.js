const express = require('express');
const router = express.Router();

const Annotation = require('../models/annotations');
const annotationsControllers = require('../controllers/annotations');
const annotationsMiddlewares = require('../middlewares/annotations');
const annotationValidators = require('../validators/annotations');

router.use(annotationsMiddlewares.Authentication);

router.param('annotationId', annotationsMiddlewares.ExistsAnnotation);

router.get('/', annotationsControllers.AllAnnotations);

router.get('/search', annotationsControllers.Search);

router.get('/add', annotationsControllers.AddAnnotationPage);
router.post('/add', annotationValidators.addAnnotationValidators, annotationsMiddlewares.AddAnnotationValidation, annotationsControllers.AddAnnotation);

router.get('/edit/:annotationId', annotationsControllers.EditPage);
router.post('/edit/:annotationId', annotationValidators.addAnnotationValidators, annotationsMiddlewares.EditAnnotationValidation, annotationsControllers.Edit);

router.get('/delete/:annotationId', annotationsControllers.Delete);

router.get('/:annotationId', annotationsControllers.Profile);

module.exports = router;
