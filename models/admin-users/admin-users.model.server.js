const mongoose = require('mongoose');
const adminUserSchema = require('./admin-users.schema.server');

const adminUserModel = mongoose.model('AdminUserModel', adminUserSchema);

module.exports = adminUserModel;
