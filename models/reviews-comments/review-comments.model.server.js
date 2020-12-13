const mongoose = require('mongoose');
const reviewCommentsSchema = require('./review-comments.schema.server');

const reviewCommentsModel = mongoose.model('ReviewCommentsModel', reviewCommentsSchema);

module.exports = reviewCommentsModel;
