const Movie = require('../models/movie');
const Review = require('../models/review');

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
        const sortAttributes = ['name' , 'genre'];
        const filterAttributes = ['genre' , 'year'];

        if(req.query.sortBy){
            const querySortObject = convertJson(req.query.sortBy);
            req.sortBy = validateUpdates(querySortObject , sortAttributes);
        }
        if(req.query.filterBy){
            const queryFilterObject = convertJson(req.query.filterBy);
            req.filterBy = validateUpdates(queryFilterObject , filterAttributes);
        }

        req.sortBy = (req.sortBy === undefined) ? '' : req.sortBy; 
        req.filterBy = (req.filterBy === undefined) ? '' : req.filterBy;
        
        const movies = await Movie.find().where(req.filterBy).sort(req.sortBy);
        
        for(const movie of movies){
            const totalReviews = await movie.populate('review').execPopulate();

            const reviewIds = totalReviews.review.map((data) => {
                 return data['_id'];
            })
            
            movie.reviews = [...reviewIds];
            await movie.save();          
        }
        res.send(movies);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateMovie = async (req , res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowdUpdates = ['name' , 'genre' , 'year' , 'actors'];
    const ValidUpdates = updates.every((update) => allowdUpdates.includes(update));

    if( !ValidUpdates ){
        return res.status(400).send({error: 'Invalid Updates'});
    }

    try {
        const movie = await Movie.findById( _id);

        if(!movie){
            return res.status(404).send();
        }

        updates.forEach((update) => movie[update] = req.body[update]);
        movie.save();
        res.send(movie);
    } catch (error) {
        res.status(400).send(error);
    }
}

const deleteMovie = async (req , res) => {
    const _id = req.params.id;
    try {
        const movie = await Movie.findByIdAndDelete({ _id });
        if(!movie){
            throw new Error('Movie is not found.')
        }
        for(const reviewId of movie.reviews) {
            console.log(reviewId);
           await Review.findOneAndDelete({_id:reviewId});
       }
        res.send(movie);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const convertJson = (queryString) => {
    const query = queryString.toString();
    const queryObject = JSON.parse(query.substring(1 , query.length)) ;

    return queryObject;
}

const validateUpdates = (queryObject , attributesArray) => {
    const queryAttributes = Object.keys(queryObject);
    const valid = queryAttributes.every((attribute) => attributesArray.includes(attribute));

    if(!valid) throw new Error('Wrong query string parameters');
    else return queryObject;
}

module.exports = {
    addMovie,
    getMovies,
    updateMovie,
    deleteMovie
}