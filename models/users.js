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

UserSchema.virtual('name').get(function() {
    return this.first_name + ' ' + this.last_name;
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;
