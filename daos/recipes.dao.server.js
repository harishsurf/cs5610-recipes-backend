const recipesModel = require('../models/recipes/recipes.model.server');
const usersModel = require('../models/users/users.model.server');

createRecipe = (newRecipe) => recipesModel.create(newRecipe);

getRecipes = () => recipesModel.find();

module.exports = {
    createRecipe,
    getRecipes
};
