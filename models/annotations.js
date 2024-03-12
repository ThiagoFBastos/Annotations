const mongoose = require('./db');

const {Schema} = mongoose;

const AnnotationSchema = Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tags'
    }],
    createdAt: {
        type: Date,
        require: true,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
});

const Annotation = mongoose.model("Annotations", AnnotationSchema);

module.exports = Annotation;
