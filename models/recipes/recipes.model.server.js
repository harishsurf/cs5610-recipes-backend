const mongoose = require('mongoose');
const recipeSchema = require('./recipes.schema.server');

const recipeModel = mongoose.model('RecipesModel', recipeSchema);

module.exports = recipeModel;
