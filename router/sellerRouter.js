const { verify, forgotPassword, resetPassword, login, register, updateSeller, deleteSeller, logOut, changePassword } = require('../controller/sellerController');
const { registerValidation, forgetPasswords, resetPasswords } = require('../middlewares/validator');
const upload = require('../utils/multer');
const passport = require('passport');
const JWT = require('jsonwebtoken');
const sellerRouter = require('express').Router();
 

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new seller
 *     tags: [Seller]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - confirmPassword
 *               - profilePic
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Seller created successfully
 *       400:
 *         description: Bad request
 */
sellerRouter.post('/register', upload.single('profilePic'), registerValidation, register);


/**
 * @swagger
 * /verify-user/{token}:
 *   get:
 *     summary: Verify seller account using token
 *     tags: [Seller]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account verified
 *       400:
 *         description: Token expired or invalid
 */
sellerRouter.get('/verify-user/:token', verify);


/**
 * @swagger
 * /forget:
 *   post:
 *     summary: Send password reset email
 *     tags: [Seller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent
 */
sellerRouter.post('/forget', forgotPassword);


/**
 * @swagger
 * /reset/{token}:
 *   post:
 *     summary: Reset password using token
 *     tags: [Seller]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */
sellerRouter.post('/reset/:token', resetPassword);


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Seller login
 *     tags: [Seller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
sellerRouter.post('/login', login);


/**
 * @swagger
 * /signout:
 *   post:
 *     summary: Logout seller
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out
 */
sellerRouter.post('/signout', logOut);


/**
 * @swagger
 * /change/{id}:
 *   patch:
 *     summary: Change seller password
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 */
sellerRouter.patch('/change/:id', changePassword);


/**
 * @swagger
 * /edit-profile/{id}:
 *   patch:
 *     summary: Update seller profile
 *     tags: [Seller]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Seller updated
 */
sellerRouter.patch('/edit-profile/:id', upload.array('profilePic'), updateSeller);


/**
 * @swagger
 * /remove:
 *   delete:
 *     summary: Delete seller
 *     tags: [Seller]
 *     responses:
 *       200:
 *         description: Seller deleted
 */
sellerRouter.delete('/remove', deleteSeller);


sellerRouter.get('/google-authenticate', passport.authenticate('google', {scope: ['profile', 'email']}));

sellerRouter.get('/auth/google/login', passport.authenticate('google'), async (req, res)=>{
    console.log('Req user:', req.seller);
    
    const token = await JWT.sign({sellerId: req.seller.id, isVerified: req.seller.isVerified},
         process.env.JWT_SECRET, {expiresIn: '1day'});
    res.status(200).json({
        message: 'Google Auth Login Successful',
        data: req.seller,
        token
    });
})
module.exports = sellerRouter;