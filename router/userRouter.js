const router = require ('express').Router()
//const {register, verifyUser,  login,  resendVerificationEmail,getAll,  makeAdmin} = require('../controllers/userController');
const {authenticate, adminAuth} = require('../middlewares/authentication');
const { signUpValidation } = require('../middlewares/validator');
const passport = require('passport')
const jwt = require('jsonwebtoken')

// router.post('/register', signUpValidation, register);
// router.get('/verify-user/:token', verifyUser);
// router.post('/resendlink', resendVerificationEmail)
// router.post('/login', login)
// router.get('/users', authenticate, getAll)
// router.patch('/make-admin/:id', authenticate, adminAuth, makeAdmin)


router.get('/google-authenticate', passport.authenticate('google',{ scope:['profile', 'email'] }));

router.get('/auth/google/login', passport.authenticate('google'), async (req, res) => {
    console.log('Req User: ', req.user)
const token = await jwt.sign({ userId: req.user._id, isVerfied: req.user.isVerfied }, process.env.SECRET, {expiresIn: "1d"});
res.status(200).json({
    message: 'Google Auth Login Successful',
    data: req.user,
    token
});
})

module.exports = router;