const {body} = require('express-validator');

exports.addAnnotationValidators = [
    body('title', 'O título não pode ser vazio').not().isEmpty().trim(),
    body('description', 'A descrição não pode ser vazia').not().isEmpty().trim()
];
