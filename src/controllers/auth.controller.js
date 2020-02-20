const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req , res , next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: decoded._id , token});

        if(!user){
            throw new Error('You are not logged in.');
        }
        next();
    } catch (error) {
        res.status(401).send({error:'please login.'});
    }
}

module.exports = auth;