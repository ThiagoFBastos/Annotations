const {body} = require('express-validator');

exports.addTagValidators = [
    body('name', 'O nome não pode ser vazio').not().isEmpty().trim(),
    body('description', 'A descrição não pode ser vazia').not().isEmpty().trim()
];
