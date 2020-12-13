const userSavedRecipeModel = require('../models/user-saved-recipe/user-saved-recipe.model.server');

const deleteSavedRecipe = async (recipeId, userId) => {
    try {
        const data = userSavedRecipeModel.findOne({
            user: userId,
            recipe: recipeId,
        });
        await userSavedRecipeModel.deleteOne({
            user: userId,
            recipe: recipeId,
        });
        return data;
    } catch (err) {
        return {
            err: "Cannot delete item try again"
        }
    }
}

const saveRecipe = async (recipeId, userId) => {
    const savedRecipe = new userSavedRecipeModel({
        user: userId,
        recipe: recipeId
    });
    const finalSavedRecipe = await savedRecipe.save();
    if (!finalSavedRecipe || !finalSavedRecipe._doc) {
        return null;
    }
    const fetchSavedRecipe = await userSavedRecipeModel.find({
        user: userId,
        recipe: recipeId
    }).populate('user recipe'); 
    return fetchSavedRecipe;
}

const findRecentSavedRecipe =  async (userId) => {
    const fetchSavedRecipe = await userSavedRecipeModel.find({
        user: userId,
    }).populate("user recipe").sort({createdAt: -1}).limit(10); 

    const recipes = fetchSavedRecipe.map(savedRecipe => savedRecipe.recipe);
    return recipes;
}

const findAllSavedRecipes = async (userId) => {
    const fetchSavedRecipe = await userSavedRecipeModel.find({
        user: userId,
    }).populate("user recipe").sort({createdAt: -1}); 

    const recipes = fetchSavedRecipe.map(savedRecipe => savedRecipe.recipe);

    return recipes;
}



module.exports = {
    deleteSavedRecipe, 
    saveRecipe,
    findRecentSavedRecipe,
    findAllSavedRecipes
}