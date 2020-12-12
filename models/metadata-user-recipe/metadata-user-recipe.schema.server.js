const mongoose = require('mongoose');

const metaDataUserRecipe = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
    recipe: {type:mongoose.Schema.Types.ObjectId, ref: 'RecipesModel'},
    comment: String,
    rating: {type: Number, required: true}
},{collection: 'metadata_user_recipe', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});


metaDataUserRecipe.index({ user: 1, recipe: 1 }, { unique: true })

module.exports = metaDataUserRecipe;
