const recipeDao = require('../daos/recipes.dao.server');
const axios = require('axios');
const apiKey = "fd8eb1342ad14b99aa1933816c38d9fe"
const baseUrl = "https://api.spoonacular.com/recipes";

const addRecipe = (userId, recipe) => {
    const newRecipe = {
        ...recipe,
        userId: userId,
    };
    return recipeDao.addRecipe(newRecipe);
}

const fetchRandomRecipeApi = async () => {
    try {
        const recipes = await axios.get(`${baseUrl}/random?number=16&apiKey=${apiKey}`)
        return recipes.data;   
    } catch (e) {
        return {
            err: e,
            msg: "Failed to fetch recipes",
        };
    }
}

const updateRecipe = (recipeId, recipe) => {
    return recipeDao.updateRecipe(recipeId, recipe);
}

const deleteRecipe = (recipeId) => {
    return recipeDao.deleteRecipe(recipeId);
}

const getAllOwnedRecipes = (userId) => {
    return recipeDao.getAllOwnedRecipes(userId);
}

module.exports = {
    addRecipe,
    fetchRandomRecipeApi,
    updateRecipe,
    deleteRecipe,
    getAllOwnedRecipes,
};