const mongoose = require('mongoose');

let adminUserSchema = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref: 'UserModel'}
},{collection: 'admin_users'});

module.exports = mongoose.model('AdminUserModel', adminUserSchema);