const mongoose = require('mongoose');

let browsingUserSchema = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref: 'UserModel'}
},{collection: 'browser_users'});

module.exports = mongoose.model('BrowningUserModel', browsingUserSchema);