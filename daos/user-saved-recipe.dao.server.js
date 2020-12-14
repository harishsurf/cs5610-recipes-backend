const userSavedRecipeModel = require('../models/user-saved-recipe/user-saved-recipe.model.server');
const userModel = require('../models/users/users.model.server');
const recipeModel = require('../models/recipes/recipes.model.server');
const recipeService = require('../services/recipes.service.server');
const { ObjectId } = require('mongodb');

const deleteSavedRecipe = async (recipeId, userId) => {
    try {
        const data = await userSavedRecipeModel.findOne({
            user: userId,
            recipe: recipeId,
        });
        await userSavedRecipeModel.deleteOne({
            user: userId,
            recipe: recipeId,
        });
        return data;
    } catch (err) {
        try {
            const recipe = await recipeModel.findOne({
                id: recipeId,
            });
            const data1 = await userSavedRecipeModel.findOne({
                user: userId,
                recipe: recipe._id,
            });
            await userSavedRecipeModel.deleteOne({
                user: userId,
                recipe: recipe._id,
            });
            return data1;
        } catch (e) {
            return {
                err: "Cannot delete item try again"
            }
        }
    }
}

const saveRecipe = async (recipeId, userId) => {
    let recipe;
    try {
        recipe = await recipeModel.findOne({
            _id: recipeId,
        });
    } catch (err) {
        recipe = await recipeModel.findOne({
            id: recipeId,
        });
        if(!recipe) {
            const thirdPartyRecipe = await recipeService.getRecipeById(recipeId);
            const savedThirdPartyRecipe = new recipeModel({
                title: thirdPartyRecipe.title,
                ingredients: thirdPartyRecipe.ingredients,
                instructions: thirdPartyRecipe.instructions,
                readyInMinutes: thirdPartyRecipe.readyInMinutes,
                servings: thirdPartyRecipe.servings,
                imageUrl: thirdPartyRecipe.imageUrl,
                sourceUrl: thirdPartyRecipe.sourceUrl,
                id: thirdPartyRecipe._id,
            });
            recipe = await savedThirdPartyRecipe.save();
        }
    }
    const savedRecipe = new userSavedRecipeModel({
        user: userId,
        recipe: recipe._id
    });
    const finalSavedRecipe = await savedRecipe.save();
    if (!finalSavedRecipe || !finalSavedRecipe._doc) {
        return null;
    }
  
    const fetchSavedRecipe = await userSavedRecipeModel.findOne({
        user: userId,
        recipe: recipe._id
    }).populate({
        path: 'recipe',
        populate: { path: "userId"}
    }).populate({
        path: 'user'
    });

    if(fetchSavedRecipe.recipe.id) {
       return {
            ...fetchSavedRecipe,
            recipe: {
                ...fetchSavedRecipe.recipe,
                _id: fetchSavedRecipe.recipe.id
            }
        }
    }
    return fetchSavedRecipe;
}

const findRecentSavedRecipe = async (userId) => {
    const fetchSavedRecipe = await userSavedRecipeModel.find({
        user: userId,
    }).populate({
        path: 'recipe',
        populate: { path: "userId"}
    }).sort({createdAt: -1}).limit(5);

    const recipes = fetchSavedRecipe.map(savedRecipe => savedRecipe.recipe);
    const finalRecipes = recipes.map(recipe => {
        if(recipe.id) {
            return {
                title: recipe.title,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                readyInMinutes: recipe.readyInMinutes,
                servings: recipe.servings,
                imageUrl: recipe.imageUrl,
                sourceUrl: recipe.sourceUrl,
                _id: recipe.id,
                reviewComments: recipe.reviewComments,
            }
        }
        return {
            title: recipe.title,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            readyInMinutes: recipe.readyInMinutes,
            servings: recipe.servings,
            imageUrl: recipe.imageUrl,
            _id: recipe._id,
            userId: recipe.userId,
            reviewComments: recipe.reviewComments,
        };
    });
    return finalRecipes;
}

const findAllSavedRecipes = async (userId) => {

    const fetchSavedRecipe = await userSavedRecipeModel.find({
        user: userId,
    }).populate({
        path: 'recipe',
        populate: { path: "userId"}
    }).sort({createdAt: -1});

    const recipes = fetchSavedRecipe.map(savedRecipe => {
        // savedRecipe.recipe.populate("userId");
        return savedRecipe.recipe;
    });

    const finalRecipes = recipes.map(recipe => {
        if(recipe.id) {
            return {
                title: recipe.title,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                readyInMinutes: recipe.readyInMinutes,
                servings: recipe.servings,
                imageUrl: recipe.imageUrl,
                sourceUrl: recipe.sourceUrl,
                _id: recipe.id,
                reviewComments: recipe.reviewComments,
            }
        }
        return {
            title: recipe.title,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            readyInMinutes: recipe.readyInMinutes,
            servings: recipe.servings,
            imageUrl: recipe.imageUrl,
            _id: recipe._id,
            userId: recipe.userId,
            reviewComments: recipe.reviewComments,
        };
    });

    return finalRecipes;
}


module.exports = {
    deleteSavedRecipe,
    saveRecipe,
    findRecentSavedRecipe,
    findAllSavedRecipes
}
