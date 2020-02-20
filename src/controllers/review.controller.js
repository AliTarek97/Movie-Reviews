const Review = require('../models/review');

const addReview = async (req , res) => {
    const review = new Review(req.body)
    try {
        await review.save();
        res.status(201).send(review);
    } catch (error) {
        res.status(400).send();
    }
};

const getReview = async (req , res) => {
    try {
        const reviews = await Review.find();
        if(!reviews.length){
            throw new Error('Reviews are not found.');
        }
        res.send(reviews);
    } catch (error) {
        res.status(400).send(error.message);
    }

}

module.exports = {
    addReview,
    getReview
}