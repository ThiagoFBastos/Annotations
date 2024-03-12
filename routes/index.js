const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    if(req.session.user == undefined)
        res.redirect('/users/login');
    else
        next();
}, (req, res) => {
	res.render('inicio', {title: 'annotations'});
});

module.exports = router;
