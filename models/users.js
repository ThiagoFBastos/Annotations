const mongoose = require('mongoose');

const {Schema} = mongoose;

const UserSchema = Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    annotations: [{
        type: Schema.Types.ObjectId,
        ref: 'Annotations'
    }]
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;