const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: String,
    ingredients: String,
    instructions: String,
    readyInMinutes: Number,
    servings: Number,
    sourceUrl: String,
    imageUrl: String,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}
}, {collection: 'recipes', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

module.exports = recipeSchema;
