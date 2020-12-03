const mongoose = require('mongoose');

let recipeSchema = new mongoose.Schema({
    recipe_name: String,
    recipe_id: int,
    image_url: String,
    image_type: String,
    ingredients: String,
    instructions: String,
    ready_in_minutes: int,
    servings: int,
    source_url: String,
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}
}, {collection: 'recipes'});

module.exports = mongoose.model('RecipesModel', recipeSchema);
