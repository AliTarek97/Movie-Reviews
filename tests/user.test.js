const request = require('supertest');
let server ;
const User = require('../src/models/user');

const userOne = {   
    email:'ali@example.com',
    password:'123456'
}

beforeEach(async () => { 
    server = require('../src/server');
})

afterEach(async () => {
    await User.deleteMany();
    await server.close(); 
});

describe('Signup and login user' , () => {
    it('should signup a new user' ,  async () => {
        const response = await request(server)
                        .post('/api/users/signup')
                        .send({
                            email: "ahmed@example.com",
                            password: "123456"
                        })
                        .expect(201);
        
        const user =  await User.findById(response.body.user._id);
        expect(user).not.toBeNull;
    
        expect(response.body).toMatchObject({
            user: {
                _id: user._id.toHexString(),
                email: "ahmed@example.com",         
            }
        })
    })
    
    it('should login a user' ,  async () => {
        await new User(userOne).save();
        const response = await request(server)
                        .post('/api/users/login')
                        .send({
                            email: userOne.email,
                            password: userOne.password
                        })
                        .expect(200);
        const user =  await User.findById(response.body.user._id);
        expect(user).not.toBeNull;
    
        expect(response.body.token).toBe(user.token)
    })

    it('should not signup a new user , valid email' ,  async () => {
        await request(server)
                .post('/api/users/signup')
                .send({
                    email: "ahmed.example.com",
                    password: "123456"
                })
                .expect(500);
    })

    it('should login a user' ,  async () => {
        await new User(userOne).save();
        await request(server)
                        .post('/api/users/login')
                        .send({
                            email: userOne.email,
                            password: '444'
                        })
                        .expect(400);
    })
})