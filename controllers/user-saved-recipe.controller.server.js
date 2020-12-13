const userSavedRecipe = require('../services/user-saved-recipe.service.server');

module.exports = function (app) {
    
    app.post('/api/recipes/:recipeId/users/:userId', (req, res) => {
        const recipeId = req.params.recipeId;
        const userId = req.params.userId;

        userSavedRecipe.saveRecipe(recipeId, userId)
            .then((data) => {
                if(data && !data.error) {
                    res.json(data);
                } else {
                    res.status(500).send({
                        error: data.error,
                    });
                }
            }).catch((err) => {
                res.status(500).send({
                    error: err,
                });
            })
    });

    app.delete('/api/recipes/:recipeId/users/:userId', (req, res) => {
        const recipeId = req.params.recipeId;
        const userId = req.params.userId;

        userSavedRecipe.deleteSavedRecipe(recipeId, userId)
            .then((data) => {
                if(data && !data.error) {
                    res.json(data);
                } else {
                    res.status(500).send({
                        error: data.error,
                    });
                }
            }).catch((err) => {
                res.status(500).send({
                    error: err,
                });
            })
    });

    app.get('/api/savedRecipes/users/:userId', (req, res) => {
        const recipeId = req.params.recipeId;
        const userId = req.params.userId;

        userSavedRecipe.findAllRecipeForUser(userId)
            .then((data) => {
                if(data && !data.error) {
                    res.json(data);
                } else {
                    res.status(500).send({
                        error: data.error,
                    });
                }
            }).catch((err) => {
                res.status(500).send({
                    error: err,
                });
            })
    })

}