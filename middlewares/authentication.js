const JWT = require('jsonwebtoken');
const Seller = require('../models/seller');

exports.authenticateSeller = async (req, res, next) => {
    try {
        // Get the token from the request header
        const auth = req.header('Authorization');
        if (auth == undefined) {
            return res.status(401).json({
                message: 'Authentication required'
            });
        }
        
        const token = auth.split(' ')[1];
        if (token == undefined) {
            return res.status(401).json({
                message: 'Invalid token'
            });
        }
        
        const decodedToken = await JWT.verify(token, process.env.JWT_SECRET);
        
        // Check if token is for seller
        if (decodedToken.type !== 'seller') {
            return res.status(403).json({
                message: 'Seller privileges required'
            });
        }
        
        // Check for the seller and throw error if not found
        const seller = await Seller.findByPk(decodedToken.sellerId);
        if (seller == null) {
            return res.status(404).json({
                message: 'Authentication failed: seller not found'
            });
        }
        
        // Attach only necessary seller data to request
        req.seller = {
            id: seller.id,
            email: seller.email,
            password: hashedPassword
            // Add other relevant seller fields
        };

        next();
    } catch (error) {
        if (error instanceof JWT.TokenExpiredError) {
            return res.status(401).json({
                message: 'Session timed-out, please login'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Invalid token'
            });
        }
        
        console.log(error.message);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};
