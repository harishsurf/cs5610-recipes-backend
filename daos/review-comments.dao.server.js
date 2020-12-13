const reviewCommentsModel = require('../models/reviews-comments/review-comments.model.server');

const createReviewComment = async (reviewComment) => {
    const newReviewComment = new reviewCommentsModel({
        ...reviewComment,
    });
    const createReviewComment = await newReviewComment.save();
    if (!createReviewComment || !createReviewComment._doc) {
        return null;
    }
    return createReviewComment._doc;
}


module.exports = {
    createReviewComment,
}
