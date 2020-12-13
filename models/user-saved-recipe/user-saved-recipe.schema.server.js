const mongoose = require('mongoose');

const userSavedRecipe = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
    recipe: {type:mongoose.Schema.Types.ObjectId, ref: 'RecipesModel'},
},{collection: 'user_saved_recipe', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});


userSavedRecipe.index({ user: 1, recipe: 1 }, { unique: true })

module.exports = userSavedRecipe;
