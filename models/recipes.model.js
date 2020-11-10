const mongoose = require('mongoose');

let recipeSchema = new mongoose.Schema({
    recipe_name: String,
    ingredients: String,
    tags : {type: String, enum: ["enum1, enum2"]},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}
}, {collection: 'recipes'});

module.exports = mongoose.model('RecipesModel', recipeSchema);