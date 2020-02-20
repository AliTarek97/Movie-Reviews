const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if( !validator.isEmail(value) ){
                throw new Error('Email is invalid.');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    token:{
        type: String
    }

})

userSchema.methods.toJSON = function () {
    const user = this;
    const userJson = user.toObject();

    delete userJson.password;
    delete userJson.token;

    return userJson;
}

userSchema.methods.generateAccessToken = async function () {
    console.log('inside generateAccessToken');
    const user = this;
    
    const token = jwt.sign({_id: user._id.toString()} , process.env.JWT_SECRET);
    console.log(token);
    user.token = token;
    await user.save();

    return token;        
}

userSchema.statics.validateUser = async (email , password) => {
    console.log('inside validateuser')
    const user = await User.findOne({ email });

    if(!user){
        throw new Error('Unable to login, Email is not found.')
    }

    const theSame = await bcrypt.compare(password , user.password);
    if(!theSame){
        throw new Error('Unable to login, Wrong password'); 
    }

    return user;
}

userSchema.pre('save' , async function (next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password , 8);
    }
    next();
})

const User = mongoose.model('User' , userSchema);
module.exports = User;