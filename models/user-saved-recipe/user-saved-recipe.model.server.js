const mongoose = require('mongoose');
const userSavedRecipeSchema = require('./user-saved-recipe.schema.server');

const userSavedRecipe = mongoose.model('UserSavedRecipeSchema', userSavedRecipeSchema);

module.exports = userSavedRecipe;
