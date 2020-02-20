const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    actors: {
        type: [String],
        required: true
    },
    reviews: {type: [String]}
})

movieSchema.virtual('review' , {
    ref: 'Review',
    localField: '_id',
    foreignField: 'movieId'
})

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;