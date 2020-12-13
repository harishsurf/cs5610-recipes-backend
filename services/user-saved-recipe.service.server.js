const userSavedRecipeDao = require('../daos/user-saved-recipe.dao.server');
const recipeDao = require('../daos/recipes.dao.server');

const findAllRecipeForUser = (userId) => userSavedRecipeDao.findAllSavedRecipes(userId);

const saveRecipe = (recipeId, userId) => {
    return userSavedRecipeDao.saveRecipe(recipeId, userId);
};

const deleteSavedRecipe = (recipeId, userId) => userSavedRecipeDao.deleteSavedRecipe(recipeId, userId);

const findRecentSavedRecipe = (userId) => userSavedRecipeDao.findRecentSavedRecipe(userId);


module.exports = {
    saveRecipe,
    deleteSavedRecipe,
    findAllRecipeForUser,
    findRecentSavedRecipe
};