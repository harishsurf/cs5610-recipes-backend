const mongoose = require('mongoose');

let recipeSchema = new mongoose.Schema({
    title: String,
    id: int,
    image: String,
    imageType: String,
    ingredients: String,
    instructions: String,
    readyInMinutes: int,
    servings: int,
    sourceUrl: String,
    // not sure how this should be named
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}
}, {collection: 'recipes'});

module.exports = mongoose.model('RecipesModel', recipeSchema);
