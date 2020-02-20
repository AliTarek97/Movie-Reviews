const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    description: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
})

const Review = mongoose.model('Review' , reviewSchema);
module.exports = Review;