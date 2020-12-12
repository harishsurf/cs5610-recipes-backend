const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref: 'UserModel'}
},{collection: 'admin_users'});

module.exports = adminUserSchema;
