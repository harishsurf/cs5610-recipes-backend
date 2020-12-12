const mongoose = require('mongoose');
const metaDataUserRecipeSchema = require('./metadata-user-recipe.schema.server');

const metaDataUserRecipeModel = mongoose.model('MetaDataUserRecipeModel', metaDataUserRecipeSchema);

module.exports = metaDataUserRecipeModel;
