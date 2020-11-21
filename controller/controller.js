const daoObj = require('../services/dao');

module.exports = function(app) {

    // USER CONTROLLER
    app.post('/api/recipes', (req, res) => {
        console.log(req);
        daoObj.createRecipe(req.body)
            .then(actualRecipe => {
                res.json(actualRecipe);
            })
            .catch(error => {
                console.log(error);
            })
    });

    app.get('/api/users/', function (req, res) {
        daoObj.getRecipes()
            .then(actualRecipes => {
                res.json(actualRecipes);
            })
    });
}