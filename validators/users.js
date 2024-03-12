const {body} = require('express-validator');

exports.updateUserValidators = [
    body('first_name', 'O primeiro nome não pode ser vazio').not().isEmpty(),
    body('last_name', 'O último nome não pode ser vazio').not().isEmpty(),
    body('email', 'O email não pode ser vazio').not().isEmpty(),
    body('email', 'O email está com o formato incorreto').isEmail()  
];

exports.loginUserValidators = [
    body('email', 'O email não pode ser vazio').not().isEmpty(),
    body('email', 'O email está com o formato incorreto').isEmail(),
    body('password', 'A senha não pode ser vazia').not().isEmpty()
];

exports.registerUserValidators = [
    body('first_name', 'O primeiro nome não pode ser vazio').not().isEmpty(),
    body('last_name', 'O último nome não pode ser vazio').not().isEmpty(),
    body('email', 'O email não pode ser vazio').not().isEmpty(),
    body('email', 'O email está com o formato incorreto').isEmail(),
    body('password', 'A senha deve conter entre 8 a 30 caracteres').isLength({min: 8, max: 30})
];

exports.passwordChangeUserValidators = [
    body('new_password', 'A senha deve conter entre 8 a 30 caracteres').isLength({min: 8, max: 30}),
    body('new_password_confirm', 'A senha deve conter entre 8 a 30 caracteres').isLength({min: 8, max: 30}),
    body('password', 'A senha deve conter entre 8 a 30 caracteres').isLength({min: 8, max: 30}),
];
