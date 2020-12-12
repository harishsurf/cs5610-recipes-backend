const mongoose = require('mongoose');
const metaDataSchema = require('./metadata-user-recipe.schema.server');

const metaData = mongoose.model('MetaDataSchema', metaDataSchema);

module.exports = metaData;
