const userSavedRecipeDao = require('../daos/user-saved-recipe.dao.server');
const recipeDao = require('../daos/recipes.dao.server');

const findAllRecipeForUser = (userId) => userSavedRecipeDao.find(userId);

const saveRecipe = (recipeId, userId) => {
    recipeDao.findLocalRecipe(recipeId).then(data => {
        if(data) {
            userSavedRecipeDao.saveRecipe(recipeId, userId);
        } else {
            recipeDao.getRecipeById(recipeId).then(recipe => {
                recipeDao.saveRecipe(recipe);
                userSavedRecipeDao.saveRecipe(recipeId, userId);
            });
        }
    }).catch(err => {
        return {
            error: "Failed To save recipe.",
        }
    })
};

const deleteSavedRecipe = (recipeId, userId) => userSavedRecipeDao.deleteSavedRecipe(userId,recipeId);

const findRecentSavedRecipe = (userId) => userSavedRecipeDao.findRecentSavedRecipe(userId);


module.exports = {
    saveRecipe,
    deleteSavedRecipe,
    findAllRecipeForUser,
    findRecentSavedRecipe
};