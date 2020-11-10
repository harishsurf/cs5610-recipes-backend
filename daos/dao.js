const recipesModel = require('../models/recipes.model')
const usersModel = require('../models/users.model')

export const createRecipe = (newRecipe) => recipesModel.create(newRecipe);

export const getRecipes = () => recipesModel.find();