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

const deleteReview = async (req , res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if(!review){
            return res.status(400).send();
        }
        res.send(review);
    } catch (error) {
        res.status(500).send();
    }
}

const updateReview = async (req , res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowdUpdates = ['rate' , 'description' , 'title'];
    const ValidUpdates = updates.every((update) => allowdUpdates.includes(update));

    if( !ValidUpdates ) {
        return res.status(400).send({error: 'Invalid Updates.'});
    }

    try {

        const review = await Review.findById(_id);

        if( !review ){
            return res.status(404).send();
        }
        
        updates.forEach((update) => review[update] = req.body[update]);
        review.save();
        res.send(review);

    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = {
    addReview,
    getReview,
    deleteReview,
    updateReview
}