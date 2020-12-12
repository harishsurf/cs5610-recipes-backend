const mongoose = require('mongoose');

const authorUserSchema = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref: 'AuthorModel'}
},{collection: 'author_users'});

module.exports = authorUserSchema;
