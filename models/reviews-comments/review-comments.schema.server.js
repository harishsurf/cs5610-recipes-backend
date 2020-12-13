const mongoose = require('mongoose');

const reviewCommentsSchema = new mongoose.Schema({
    comment: String,
    rating: Number,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
}, {collection: 'review_comments'});

module.exports = reviewCommentsSchema;
