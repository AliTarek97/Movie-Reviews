const express = require('express');
const {signUp , login} = require('./controllers/user.controller');
const 
{   addMovie, 
    getMovies , 
    updateMovie ,
    deleteMovie
} = require('./controllers/movie.controller');
const {addReview , getReview} = require('./controllers/review.controller');

const router = express.Router();

//Users APIs
router.post('/users/signup' , signUp);
router.post('/users/login', login);

//Movies APIs
router.post('/movies' , addMovie);
router.get('/movies' , getMovies);
router.delete('/movies/:id' , deleteMovie);
router.patch('/movies/:id', updateMovie);

//Reviews APIs
router.post('/reviews', addReview);
router.get('/reviews', getReview);


module.exports = router;