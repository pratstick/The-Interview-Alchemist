const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;

    // Check if token is in the authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            let token = req.headers.authorization;

            if (token && token.startsWith('Bearer')) {
                token = token.split(' ')[1]; //extract the token from the header
                const decoded = jwt.verify(token, process.env.JWT_SECRET); //verify the token
                req.user = await User.findById(decoded.id).select('-password'); //find the user by id and exclude the password field
                next(); //call the next middleware
            } else {
                res.status(401).json({ message: 'Not authorized, no token' });
            }
            } catch (error) { 
                res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
            }    
        }
    };
    
    module.exports = { protect };