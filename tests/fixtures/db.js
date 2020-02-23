const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    user:{
        _id:userOneId,   
        email:'ali@example.com',
        password:'123456'
    },
    token:{
        token: jwt.sign({_id: userOneId} , process.env.JWT_SECRET)
    }
}

const setupDatabase = async () => {
    await User.deleteMany();
    await new User(userOne).save();
}

module.exports = {
    setupDatabase,
    userOne,
    userOneId
}