const userModel = require('../models/users/users.model.server');
const recipeModel = require('../models/recipes/recipes.model.server');
const reviewCommentsModel = require('../models/reviews-comments/review-comments.model.server');
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

const findAllLocalRecipe = async () => {
    const recipes = await recipeModel.find({}).populate("userId");
    const finalRecipes = recipes.filter(recipe => !recipe.id);
    return finalRecipes;
}

const findAllRecipes = async () => {
    const data = await recipeModel.find({}).populate("userId");
    const finalRecipes = data.filter(recipe => !recipe.id);
    // const finalRecipes = data.map(recipe => {
    //     if(recipe.id) {
    //         return {
    //             title: recipe.title,
    //             ingredients: recipe.ingredients,
    //             instructions: recipe.instructions,
    //             readyInMinutes: recipe.readyInMinutes,
    //             servings: recipe.servings,
    //             imageUrl: recipe.imageUrl,
    //             sourceUrl: recipe.sourceUrl,
    //             _id: recipe.id,
    //             reviewComments: recipe.reviewComments,
    //         }
    //     }
    //     return {
    //         title: recipe.title,
    //         ingredients: recipe.ingredients,
    //         instructions: recipe.instructions,
    //         readyInMinutes: recipe.readyInMinutes,
    //         servings: recipe.servings,
    //         imageUrl: recipe.imageUrl,
    //         _id: recipe._id,
    //         userId: recipe.userId,
    //         reviewComments: recipe.reviewComments,
    //     };
    // });
    return finalRecipes;
}


const findReviewCommentsForRecipe = async (recipeId) => {
    let recipeWithReviewComment;
    try {
        recipeWithReviewComment = await recipeModel.findOne({_id: recipeId})
            .populate({
                path: 'reviewComments',
                populate: {path: "userId"}
            })
    } catch (e) {
        recipeWithReviewComment = await recipeModel.findOne({id: recipeId})
            .populate({
                path: 'reviewComments',
                populate: {path: "userId"}
            })
        if (recipeWithReviewComment == null) {
            return [];
        }
    }
    if (recipeWithReviewComment.id) {
        return {
            title: recipeWithReviewComment.title,
            ingredients: recipeWithReviewComment.ingredients,
            instructions: recipeWithReviewComment.instructions,
            readyInMinutes: recipeWithReviewComment.readyInMinutes,
            servings: recipeWithReviewComment.servings,
            imageUrl: recipeWithReviewComment.imageUrl,
            sourceUrl: recipeWithReviewComment.sourceUrl,
            _id: recipeWithReviewComment.id,
            reviewComments: recipeWithReviewComment.reviewComments,
        }
    } else {
        return {
            title: recipeWithReviewComment.title,
            ingredients: recipeWithReviewComment.ingredients,
            instructions: recipeWithReviewComment.instructions,
            readyInMinutes: recipeWithReviewComment.readyInMinutes,
            servings: recipeWithReviewComment.servings,
            imageUrl: recipeWithReviewComment.imageUrl,
            _id: recipeWithReviewComment._id,
            userId: recipeWithReviewComment.userId,
            reviewComments: recipeWithReviewComment.reviewComments,
        }
    }
}

const updateReviewComments = async (recipeId, reviewCommentObj) => {
    let localRecipe;

    try {
        localRecipe = await recipeModel.findOne({_id: recipeId})
    } catch (e) {
        localRecipe = await recipeModel.findOne({id: recipeId})
        if (localRecipe == null) {
            const recipeService = require("../services/recipes.service.server");
            const thirdPartyRecipe = await recipeService.getRecipeById(recipeId)
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
            localRecipe = await savedThirdPartyRecipe.save();
        }
    }
    // const recipe = {
    //     ...localRecipe,
    //     reviewComments: [...localRecipe.reviewComments, reviewCommentObj._id]
    // }

    await recipeModel.update({_id: localRecipe._id}, {$push: {reviewComments: reviewCommentObj._id}});
    const recipeFound = await recipeModel.findOne({_id: localRecipe._id});
    console.log("recipeFound", recipeFound);

    if (recipeFound) {
        if (recipeFound.id) {
            return {
                title: recipeFound.title,
                ingredients: recipeFound.ingredients,
                instructions: recipeFound.instructions,
                readyInMinutes: recipeFound.readyInMinutes,
                servings: recipeFound.servings,
                imageUrl: recipeFound.imageUrl,
                sourceUrl: recipeFound.sourceUrl,
                _id: recipeFound.id,
                reviewComments: recipeFound.reviewComments,
            }
        } else {
            return {
                title: recipeFound.title,
                ingredients: recipeFound.ingredients,
                instructions: recipeFound.instructions,
                readyInMinutes: recipeFound.readyInMinutes,
                servings: recipeFound.servings,
                imageUrl: recipeFound.imageUrl,
                _id: recipeFound._id,
                userId: recipeFound.userId,
                reviewComments: recipeFound.reviewComments,
            }
        }
    }
    const error = {
        error: "Cannot update recipe",
    };
    return error;
}

const deleteReviewComments = async (recipeId, reviewCommentId) => {
    let localRecipe;
    try {
        localRecipe = await recipeModel.findOne({_id: recipeId})
    } catch (e) {
        localRecipe = await recipeModel.findOne({id: recipeId})
        if (localRecipe == null) {
            return "No recipe present";
        }
    }
    await recipeModel.updateOne({_id: localRecipe._id}, {$pullAll: {reviewComments: [reviewCommentId]}});

    try {
        await reviewCommentsModel.deleteOne({_id: reviewCommentId})

        return "deleted successfully"
    } catch (e) {
        console.log(e)
        return "error";
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
    findAllLocalRecipe,
    findAllRecipes,
    findReviewCommentsForRecipe,
    updateReviewComments,
    deleteReviewComments
}
