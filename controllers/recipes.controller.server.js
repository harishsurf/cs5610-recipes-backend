const recipeService = require('../services/recipes.service.server');
const userSavedRecipe = require('../services/user-saved-recipe.service.server');
const axios = require('axios');
const apiKey = "fd8eb1342ad14b99aa1933816c38d9fe"
const baseUrl = "https://api.spoonacular.com/recipes";


module.exports = function (app) {
    app.get('/api/recipes', (req, res) => {
        recipeService.fetchRandomRecipeApi().then(data => {
            if (data.err) {
                res.status(500).send(data);
            } else {
                res.send(data);
            }
        }).catch(err => {
            res.status(500).send(err);
        })
    });

    app.get('/api/recipes/:recipeId', (req, res) => {
        const recipeId = req.params.recipeId;
        console.log(recipeId);
        recipeService.getRecipeById(recipeId).then(data => {
            if (data.err) {
                console.log(data.err, data.msg)
                res.status(500).send(data);
            } else {
                res.send(data);
            }
        }).catch(err => {
            res.status(500).send(err);
        })

    });

    app.post('/api/users/:userId/recipes', (req, res) => {
        const userId = req.params.userId;
        const recipe = req.body;
        recipeService.addRecipe(userId, recipe).then(newRecipe => {
            res.json(newRecipe);
        }).catch(data => {
            res.status(500).send({
                error: "Internal server problem",
            });
        });
    });

    app.get('/api/users/:userId/recipes', (req, res) => {
        const userId = req.params.userId;
        recipeService.getAllOwnedRecipes(userId).then(recipes => {
            res.json(recipes);
        }).catch(err => {
            res.status(500).send({
                error: "Internal server problem",
            });
        });
    });

    app.put('/api/recipes/:recipeId', (req, res) => {
        const recipeId = req.params.recipeId;
        const recipe = req.body;
        recipeService.updateRecipe(recipeId, recipe).then(updatedRecipe => {
            if (updatedRecipe.error) {
                res.status(500).send({
                    error: 'Something went wrong.',
                    msg: updatedRecipe.error,
                });
            } else {
                res.json(updatedRecipe);
            }
        }).catch(err => {
            res.status(500).send({
                err,
                msg: "Failed to update Recipe",
            });
        })
    });

    app.delete('/api/recipes/:recipeId', (req, res) => {
        const recipeId = req.params.recipeId;
        recipeService.deleteRecipe(recipeId).then(deletedRecipe => {
            res.json(deletedRecipe);
        }).catch(err => {
            res.status(500).send({
                err,
                msg: "Failed to delete Recipe",
            });
        })
    });


    app.get('api/recentRecipes/users/:userId', (req, res) => {
        const userId = req.params.userId;
        recipeService.getLatestRecipes(userId).then((data) => {
            if(data && !data.error) {
                userSavedRecipe.findRecentSavedRecipe(userId).then((savedRecipes) => {
                    let recipes = [];
                    if(savedRecipes && !savedRecipes.error) {
                        recipes = [
                            ...data,
                            ...savedRecipes
                        ];
                    } else {
                        recipes = [
                            ...data,
                        ]
                    }
                    res.json(recipes);
                }).catch((err) => {
                    res.json(data);
                })
            } else {
                userSavedRecipe.findRecentSavedRecipe(userId).then((savedRecipes) => {
                    let recipes = [];
                    if(savedRecipes && !savedRecipes.error) {
                        recipes = [
                            ...savedRecipes
                        ];
                        res.json(recipes);
                    } else {
                        res.status(500).send({
                            error: 'Cannot fetch Recent Recipes',
                        });
                    }
                }).catch((err) => {
                    res.status(500).send({
                        error: 'Cannot fetch Recent Recipes',
                    });
                });
            }
        }).catch((err) => {
            userSavedRecipe.findRecentSavedRecipe(userId).then((savedRecipes) => {
                let recipes = [];
                if(savedRecipes && !savedRecipes.error) {
                    recipes = [
                        ...savedRecipes
                    ];
                    res.json(recipes);
                } else {
                    res.status(500).send({
                        error: 'Cannot fetch Recent Recipes',
                    });
                }
            }).catch((err) => {
                res.status(500).send({
                    error: 'Cannot fetch Recent Recipes',
                });
            });
        })
    })
}

