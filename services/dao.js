const recipesModel = require('../models/recipes.model')
const usersModel = require('../models/User.model')

createRecipe = (newRecipe) => recipesModel.create(newRecipe);

getRecipes = () => recipesModel.find();

module.exports = {
    createRecipe,
    getRecipes
};