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
    }
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;
