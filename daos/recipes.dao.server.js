const userModel = require('../models/users/users.model.server');
const recipeModel = require('../models/recipes/recipes.model.server');
const userSavedRecipeModel = require('../models/user-saved-recipe/user-saved-recipe.model.server');

const getRecipeById = async (recipeId) => {
    const recipe = await recipeModel.findById(recipeId);
    return recipe;
}

const addRecipe = async (recipe) => {
    const newRecipe = new recipeModel({
        ...recipe,
    });
    const addedRecipe = await newRecipe.save();
    if (!addedRecipe || !addedRecipe._doc) {
        return null;
    }
    return addedRecipe._doc;
}

const updateRecipe = async (recipeId, recipe) => {
    const checkIfRecipeExist = await recipeModel.findById(recipeId);
    if (!checkIfRecipeExist) {
        return {
            error: "Recipe does not exist",
        };
    }
    const recipeFound = await recipeModel.findByIdAndUpdate(recipeId, recipe, {
        new: true,
    }).populate("userId");
    if (recipeFound) {
        return recipeFound;
    }
    const error = {
        error: "Cannot update recipe",
    };
    return error;
}


const deleteRecipe = async (recipeId) => {
    const data = await recipeModel.deleteOne({
        _id: recipeId,
    });

    userSavedRecipeModel.deleteMany({
        recipe: recipeId,
    });

    return data;
}

const getAllOwnedRecipes = async (userId) => {
    const data = await recipeModel.find({
        userId: userId,
    }).populate("userId");
    return data;
}

const getLatestRecipes = async (userId) => {
    const recipes = await recipeModel.find({userId: userId}).populate("userId").sort({updatedAt: -1}).limit(5);
    return recipes;
}

const findLocalRecipe = async (recipeId) => {
    const recipe = await recipeModel.findById(recipeId);
    return recipe;
}

module.exports = {
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getAllOwnedRecipes,
    getLatestRecipes,
    findLocalRecipe,
    getRecipeById
}
