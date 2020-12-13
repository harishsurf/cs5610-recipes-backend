const recipeDao = require('../daos/recipes.dao.server');
const usersService = require('./users.service.server');
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

const getRecipeById = async (recipeId) => {

//TODO add try/catch maybe
    const recipe = await recipeDao.getRecipeById(recipeId);
    if (recipe != null) {
        return recipe;
    } else {
        try {
            const recipeDetailsSecondHalf = "information?includeNutrition=false&apiKey=fd8eb1342ad14b99aa1933816c38d9fe"
            const spoonacularRecipe = await axios.get(`${baseUrl}/${recipeId}/${recipeDetailsSecondHalf}`);
            return convertSpoonacularRecipe(spoonacularRecipe.data, recipeId);
        } catch (e) {
            return {
                err: e,
                msg: "Failed to fetch recipe"
            }
        }
    }
}

// class spoonacularRecipeDetails
//
// = {
//     title: '',
//     extendedIngredients: [{originalString: ''}],
//     instructions: '',
//     readyInMinutes: '',
//     servings: '',
//     sourceUrl: '',
//     imageUrl: '',
//     analyzedInstructions: [{steps: [{step: ''}]}]
// }

const convertSpoonacularRecipe = (spoonacularRecipeDetails, recipeId) => {

    let ingredientString = '';
    spoonacularRecipeDetails.extendedIngredients.forEach(
        extendedIngredient => {
            ingredientString = `${ingredientString}${extendedIngredient.originalString}\n`
        });
    console.log(ingredientString)
    const instructions = spoonacularRecipeDetails.instructions;
    //const instructions = spoonacularRecipeDetails.analyzedInstructions.steps.map(step => `${step}\n`)
    console.log(instructions)
    const recipe = {
        _id: recipeId,
        title: spoonacularRecipeDetails.title,
        ingredients: ingredientString,
        instructions: instructions,
        readyInMinutes: spoonacularRecipeDetails.readyInMinutes,
        servings: spoonacularRecipeDetails.servings,
        imageUrl: spoonacularRecipeDetails.imageUrl,
        sourceUrl: spoonacularRecipeDetails.sourceUrl
    }
    return recipe
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

const getLatestRecipes = (userId) => {
    return recipeDao.getLatestRecipes(userId);
}

module.exports = {
    addRecipe,
    fetchRandomRecipeApi,
    updateRecipe,
    deleteRecipe,
    getAllOwnedRecipes,
    getRecipeById,
    getLatestRecipes
};
