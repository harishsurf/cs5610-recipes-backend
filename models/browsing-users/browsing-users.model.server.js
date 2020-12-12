const mongoose = require('mongoose');
const browsingUserSchema = require('./browsing-users.schema.server');

const browsingUserModel = mongoose.model('BrowningUserModel', browsingUserSchema);

module.exports = browsingUserModel;
