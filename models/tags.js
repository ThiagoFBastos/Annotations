const mongoose = require('./db');

const {Schema} = mongoose;

const TagSchema = Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
});

TagSchema.virtual('url').get(function() {
    return `/tags/${this._id}`;
});

const Tag = mongoose.model("Tags", TagSchema);

module.exports = Tag;
