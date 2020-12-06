const mongoose = require('mongoose');
const authorUserSchema = require('./author-users.schema.server');

const authorUserModel = mongoose.model('AuthorUserModel', authorUserSchema);

module.exports = authorUserModel;
