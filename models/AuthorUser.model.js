const mongoose = require('mongoose');

let authorUserSchema = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref: 'AuthorModel'}
},{collection: 'author_users'});

module.exports = mongoose.model('AuthorUserModel', authorUserSchema);