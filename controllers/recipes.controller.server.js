const axios = require('axios');
const apiKey = "fd8eb1342ad14b99aa1933816c38d9fe"
const baseUrl = "https://api.spoonacular.com/recipes";

module.exports = function (app) {
    app.get('/api/recipes', (req, res) => {
        axios.get(`${baseUrl}/random?number=16&apiKey=${apiKey}`)
            .then(resp => res.send(resp.data))
            .catch((err) => {
                res.status(500).send({
                    err,
                    msg: "Failed to fetch recipes",
                });
            });
    });

    app.get('/api/recipes/:recipeId', (req, res) => {
        const recipeId = req.params.recipeId;
        const recipeDetailsSecondHalf = "information?includeNutrition=false&apiKey=fd8eb1342ad14b99aa1933816c38d9fe"
        axios.get(`${baseUrl}/${recipeId}/${recipeDetailsSecondHalf}`)
            .then(resp => res.send(resp.data))
            .catch((err) => {
                res.status(500).send({
                    err,
                    msg: "Failed to fetch recipe",
                });
            });
    });


}

