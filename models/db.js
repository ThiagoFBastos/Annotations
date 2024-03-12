const mongoose = require('mongoose');

mongoose.connect('mongodb://root:example@localhost:27017/annotations?authSource=admin').then(() => {
    console.log('o mongodb está funcionando');
}).catch((e) => {
    console.log('houve um erro: ', e);
});

module.exports = mongoose;
