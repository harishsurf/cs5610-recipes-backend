const recipeDao = require('../daos/recipes.dao.server');
const axios = require('axios');
const apiKey = "54a4329446b941c4a1e48206f0703ae4"
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
        const recipes = await axios.get(`${baseUrl}/random?number=16&apiKey=${apiKey}`);
        const allLocalRecipes = await recipeDao.findAllLocalRecipe();
        const finalRecipes = [
            ...convertRecipes(recipes.data.recipes),
            ...allLocalRecipes
        ];
        return finalRecipes;

    } catch (e) {
        return {
            err: e,
            msg: "Failed to fetch recipes",
        };
    }
}

const convertRecipes = (recipes) => {
    return recipes.map(recipe => ({
        _id: recipe.id,
        title: recipe.title,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        imageUrl: recipe.image,
        sourceUrl: recipe.sourceUrl,
        userId: {
            username: recipe.sourceName || 'spoonacular',
        }
    }));
}

const getRecipeById = async (recipeId) => {

    try {
        const recipe = await recipeDao.getRecipeById(recipeId);
        if (recipe != null) {
            return recipe;
        } else {
            try {
                const recipeDetailsSecondHalf = `information?includeNutrition=false&apiKey=${apiKey}`
                const spoonacularRecipe = await axios.get(`${baseUrl}/${recipeId}/${recipeDetailsSecondHalf}`);
                return convertSpoonacularRecipe(spoonacularRecipe.data);
            } catch (e) {
                return {
                    err: e,
                    msg: "Failed to fetch recipe from Spoonacular"
                }
            }
        }
    } catch (e) {
        console.log("failed to find recipe in local DB")
        try {
            const recipeDetailsSecondHalf = `information?includeNutrition=false&apiKey=${apiKey}`
            const spoonacularRecipe = await axios.get(`${baseUrl}/${recipeId}/${recipeDetailsSecondHalf}`);
            return convertSpoonacularRecipe(spoonacularRecipe.data, recipeId);
        } catch (e2) {
            return {
                err: e2,
                msg: "Failed to fetch recipe from Spoonacular"
            }
        }
    }
}

const convertSpoonacularRecipe = (spoonacularRecipeDetails, recipeId) => {

    let ingredientString = '';
    spoonacularRecipeDetails.extendedIngredients.forEach(
        extendedIngredient => {
            ingredientString = `${ingredientString}${extendedIngredient.originalString}\n`
        });
    const instructions = spoonacularRecipeDetails.instructions;
    //const instructions = spoonacularRecipeDetails.analyzedInstructions.steps.map(step => `${step}\n`)
    const recipe = {
        _id: Number(recipeId),
        title: spoonacularRecipeDetails.title,
        ingredients: ingredientString,
        instructions: instructions,
        readyInMinutes: spoonacularRecipeDetails.readyInMinutes,
        servings: spoonacularRecipeDetails.servings,
        imageUrl: spoonacularRecipeDetails.image,
        sourceUrl: spoonacularRecipeDetails.sourceUrl
    }
    console.log(recipe);
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

const findReviewCommentsForRecipe = (recipeId) => {
    return recipeDao.findReviewCommentsForRecipe(recipeId);
}

const updateReviewComments = (recipeId, reviewCommentObj) => {
    return recipeDao.updateReviewComments(recipeId, reviewCommentObj);
}

module.exports = {
    addRecipe,
    fetchRandomRecipeApi,
    updateRecipe,
    deleteRecipe,
    getAllOwnedRecipes,
    getRecipeById,
    getLatestRecipes,
    findReviewCommentsForRecipe,
    updateReviewComments,
};
