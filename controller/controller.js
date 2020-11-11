const daoObj = require('../daos/dao');

module.exports = function(app) {

    // USER CONTROLLER
    app.post('/api/recipes', (req, res) => {
        daoObj.createRecipe(req)
            .then(actualRecipe => {
                res.json(actualRecipe);
            })
    });

    app.get('/api/users/', function (req, res) {
        daoObj.getRecipes()
            .then(actualRecipes => {
                res.json(actualRecipes);
            })
    });
}