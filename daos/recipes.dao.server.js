const recipeService = require("../services/recipes.service.server");

const userModel = require('../models/users/users.model.server');
const recipeModel = require('../models/recipes/recipes.model.server');
const userSavedRecipeModel = require('../models/user-saved-recipe/user-saved-recipe.model.server');

const getRecipeById = async (recipeId) => {
    const recipe = await recipeModel.findById(recipeId).populate("userId");
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

const findAllRecipes = async () => {
    const data = await recipeModel.find().populate("userId");
    return data;
}


const findReviewCommentsForRecipe = async (recipeId) => {
    const recipeWithReviewComment = await recipeModel.find({_id: recipeId}).populate("reviewComments");
    return recipeWithReviewComment;
}

const updateReviewComments = async (recipeId, reviewCommentObj) => {
    const localRecipe = await recipeModel.find({_id: recipeId});
    if (localRecipe == null) {
        const thirdPartyRecipe = await recipeService.getRecipeById(recipeId);
        const savedThirdPartyRecipe = new recipeModel({
                ...thirdPartyRecipe,
                reviewComments: [reviewCommentObj],
            }
        );
        const savedRecipe = await savedThirdPartyRecipe.save();
        if (savedRecipe && savedRecipe._doc) {
            return savedRecipe._doc;
        }
    } else {
        const recipe = {
            ...localRecipe,
            reviewComments: [...localRecipe.reviewComments, reviewCommentObj]
        }
        const recipeFound = await recipeModel.findByIdAndUpdate(recipeId, recipe, {
            new: true,
        })
        if (recipeFound) {
            return recipeFound;
        }
        const error = {
            error: "Cannot update recipe",
        };
        return error;
    }
}


module.exports = {
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getAllOwnedRecipes,
    getLatestRecipes,
    findLocalRecipe,
    getRecipeById,
    findAllRecipes,
    findReviewCommentsForRecipe,
    updateReviewComments
}
