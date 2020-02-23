const request = require('supertest');
let server ;
const Review = require('../src/models/review');
const User = require('../src/models/user');
const mongoose = require('mongoose');

const userOne = {   
    email:'ali@example.com',
    password:'123456'
}

const reviewOne = {
	movieId: new mongoose.Types.ObjectId,
	rate: 4,
	description: "description3",
	title: "title3"
}

beforeEach(async () => { 
    server = require('../src/server');
    await new Review(reviewOne).save();
})

afterEach(async () => {
    await Review.deleteMany();
    await User.deleteMany();
    await server.close(); 
});

describe('Testing all CRUD opertions on Review' , () => {
    it('should create new review', async () => {
        const token = await new User(userOne).generateAccessToken();
        const response = await request(server)
                        .post('/api/reviews')
                        .set('Authorization' , `Bearer ${token}`)
                        .send(reviewOne)
                        .expect(201);

        const review = await Review.findById(response.body._id);
        expect(review).not.toBeNull;
    })

    it('should read a review' , async () => {
        const token = await new User(userOne).generateAccessToken();
        const response = await request(server)
            .get(`/api/reviews`)
            .set('Authorization' , `Bearer ${token}`)
            .expect(200);
        console.log(response.body);
    })
})