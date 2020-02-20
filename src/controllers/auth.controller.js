const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req , res , next) => {
    try {
        const token = req.header('Athorization').split('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded._id);

        if(!user){
            throw new Error('You are not authenticated.');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({error:'please authenticate.'});
    }
}

module.exports = auth;