const { createSellers, verify, forgotPassword, resetPassword, login } = require('../controller/sellerController');
const { registerValidation } = require('../middlewares/validator');
const upload = require('../utils/multer');
const passport = require('passport');

const sellerRouter = require('express').Router();

sellerRouter.post('/register', registerValidation, upload.single('profilePic'), createSellers);

sellerRouter.get('/verify-user/:token', verify);

sellerRouter.post('/forget', forgotPassword);

sellerRouter.post('/reset', resetPassword);

sellerRouter.post('/login', login)

sellerRouter.get('/google-authenticate', passport.authenticate('google', {scope: ['profile', 'email']}));

sellerRouter.get('/auth/google/login', passport.authenticate('google'), async (req, res)=>{
    console.log('Req user:', req.user);
    
    const token = await jwt.sign({userId: req.user._id, isVerified: req.user.isVerified},
         process.env.jwt_secret, {expiresIn: '1day'});
    res.status(200).json({
        message: 'Google Auth Login Successful',
        data: req.user,
        token
    });
})
module.exports = sellerRouter;