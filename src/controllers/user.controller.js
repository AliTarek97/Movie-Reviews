const User = require('../models/user');

const signUp = async (req , res) => {
    const user = new User(req.body);

    try{
        await user.save();
        res.status(201).send({user});
    } catch(error) {
        res.status(500).send(error.message);
    }
}

const login = async (req , res) => {
    try {
        const user = await User.validateUser(req.body.email , req.body.password);
        const token = await user.generateAccessToken();
        res.send({user , token});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    signUp,
    login
}