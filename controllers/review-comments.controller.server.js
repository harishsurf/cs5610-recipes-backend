const reviewCommentsService = require('../services/review-comments.service.server');
const recipeService = require('../services/recipes.service.server');

module.exports = function (app) {

    app.get('/api/recipes/:recipeId/reviewComments', (req, res) => {
        const recipeId = req.params.recipeId;

        recipeService.findReviewCommentsForRecipe(recipeId)
            .then(reviewArray => {
                if (reviewArray.err) {
                    res.status(500).send(reviewArray);
                } else {
                    console.log(reviewArray);
                    res.status(200).send(reviewArray)
                    // reviewCommentsService.populateReviewComment(reviewArray)
                    //     .then(arrayOfReviewObj => res.send(arrayOfReviewObj))
                    //     .catch(err => {
                    //         res.status(500).send(err);
                    //     })
                }
            })
            .catch(err => {
                res.status(500).send(err);
            })

    });

    app.post('/api/recipes/:recipeId/reviewComments', (req, res) => {
        const recipeId = req.params.recipeId;
        const reviewCommentObj = req.body;

        reviewCommentsService.createReviewComment(reviewCommentObj)
            .then(newReviewComment => {
                recipeService.updateReviewComments(recipeId, newReviewComment)
                    .then(() => res.send(newReviewComment))
                    .catch(err => {
                        res.status(500).send(err);
                    });
            })
            .catch(err => {
            res.status(500).send(err);
        })
    });

    app.delete('/api/recipes/:recipeId/reviewComments/:reviewId', (req, res) => {
        const recipeId = req.params.recipeId;
        const reviewId = req.params.reviewId;

        recipeService.deleteReviewComments(recipeId, reviewId)
            .then((msg)=> res.send({msg}))
            .catch(err => res.send({err}));
    })
}
