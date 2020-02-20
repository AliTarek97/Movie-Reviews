const express = require('express');

const userController = require('./controllers/user.controller');
const movieController = require('./controllers/movie.controller');
const reviewController = require('./controllers/review.controller');
const auth = require('./controllers/auth.controller');

const router = express.Router();

//Users APIs
router.post('/users/signup' , userController.signUp);
router.post('/users/login', userController.login);

//Movies APIs
router.post('/movies' , auth, movieController.addMovie);
router.get('/movies' , auth,  movieController.getMovies);
router.delete('/movies/:id', auth, movieController.deleteMovie);
router.patch('/movies/:id', auth, movieController.updateMovie);

//Reviews APIs
router.post('/reviews', auth, reviewController.addReview);
router.get('/reviews', auth, reviewController.getReview);
router.delete('/reviews/:id', auth, reviewController.deleteReview) ;
router.patch('/reviews/:id', auth, reviewController.updateReview);


module.exports = router;