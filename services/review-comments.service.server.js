const userService = require("./users.service.server");

const reviewCommentDao = require('../daos/review-comments.dao.server');

const createReviewComment = (reviewComment) => {
    return reviewCommentDao.createReviewComment(reviewComment);
}

const populateReviewComment = async (reviewArray) => {
    let arrayOfReviewObj = [];
    for (let review of reviewArray) {
        const user = await userService.findUserById(review.userId);
                arrayOfReviewObj.push({
                    reviewObj: review,
                    userObj: user,
                });
    }
    return arrayOfReviewObj;
}

module.exports = {
    createReviewComment,
    populateReviewComment
}
