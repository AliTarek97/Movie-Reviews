const Movie = require('../models/movie');

const addMovie = async (req , res) => {
    const movie = new Movie(req.body)
    try {
        await movie.save();
        res.status(201).send(movie);
    } catch (error) {
        res.status(400).send(error);
    }
}

const getMovies = async (req , res) => {
    try {
        const movies = await Movie.find();
        
        for(const movie of movies){
            const totalReviews = await movie.populate('review').execPopulate();

            const reviewIds = totalReviews.review.map((data) => {
                 return data['_id'];
            })
            
            movie.reviews = [...movie.reviews , ...reviewIds];            
        }
        res.send(movies);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateMovie = async (req , res) => {
    const _id = req.params.id;
    try {
        const movie = await Movie.findByIdAndUpdate({ _id } , req.body);
        if(!movie){
            throw new Error('Movie is not found.');
        }
        res.send(movie);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteMovie = async (req , res) => {
    const _id = req.params.id;
    try {
        const movie = await Movie.findByIdAndRemove({ _id });
        if(!movie){
            throw new Error('Movie is not found.')
        }
        res.send(200);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addMovie,
    getMovies,
    updateMovie,
    deleteMovie
}