const request = require('supertest');
let server ;
const Movie = require('../src/models/movie');
const User = require('../src/models/user');
const mongoose = require('mongoose');

const userOne = {   
    email:'ali@example.com',
    password:'123456'
}

const movieOne = {
    _id: new mongoose.Types.ObjectId,
	name: "movie 1",
	genre: "comedy",
	year: "2018",
	actors: ["actor 3" , "actor 4"]
}

beforeEach(async () => { 
    server = require('../src/server');
})

afterEach(async () => {
    await Movie.deleteMany();
    await User.deleteMany();
    await server.close(); 
});

describe('Testing all CRUD operations on Movie' , () => {
    it('Should create a movie' , async () => {
        const token = await new User(userOne).generateAccessToken();
        const response = await request(server)
                                .post('/api/movies')
                                .set('Authorization' , `Bearer ${token}`)
                                .send({
                                    name: "movie 1",
                                    genre: "comedy",
                                    year: "2018",
                                    actors: ["actor 3" , "actor 4"]
                                })
                                .expect(201);
        const movie = await Movie.findById(response.body._id);
        expect(movie).not.toBeNull
        // expect([...response.body]).toMatchObject({
        //     _id: movie._id.toHexString(),
        //     actors: movie.actors,
        //     reviews: movie.reviews,
        //     name: movie.name,
        //     genre: movie.genre,
        //     year: movie.years
        // })
    })

    it('Should read a movie' , async () => {
        const token = await new User(userOne).generateAccessToken();
        await new Movie(movieOne).save();
        await request(server)
                .get('/api/movies')
                .set('Authorization' , `Bearer ${token}`)
                .expect(200);
    })

    it('Should not read a movie for unauthenticated user' , async () => {
        await new Movie(movieOne).save();
        await request(server)
                .get('/api/movies')
                .expect(401);
    })

    it('Should delete a movie' , async () => {
        const token = await new User(userOne).generateAccessToken();
        const movie = await new Movie(movieOne).save();
        const response = await request(server)
                .delete(`/api/movies/${movie._id}`)
                .set('Authorization' , `Bearer ${token}`)
                .expect(200);
        const movieAfter = await Movie.findById(response.body._id);
        expect(movieAfter).toBeNull;
    })

    it('Should update a movie' , async () => {
        const token = await new User(userOne).generateAccessToken();
        const movie = await new Movie(movieOne).save();
        const response = await request(server)
                .patch(`/api/movies/${movie._id}`)
                .set('Authorization' , `Bearer ${token}`)
                .send({
                    year:"2001"
                })
                .expect(200);
        const movieAfter = await Movie.findById(response.body._id);
        expect(movieAfter.year).toBe('2001');
    })

    it('Should not update a movie, Wrong updates' , async () => {
        const token = await new User(userOne).generateAccessToken();
        const movie = await new Movie(movieOne).save();
        await request(server)
                .patch(`/api/movies/${movie._id}`)
                .set('Authorization' , `Bearer ${token}`)
                .send({
                    age:"2001"
                })
                .expect(400);
    })
})