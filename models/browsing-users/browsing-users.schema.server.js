const mongoose = require('mongoose');

const browsingUserSchema = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref: 'UserModel'}
},{collection: 'browser_users'});

module.exports = browsingUserSchema;
