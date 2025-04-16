const { verify, forgotPassword, resetPassword, login, register, updateSeller, deleteSeller, logOut, changePassword } = require('../controller/sellerController');
const { registerValidation, forgetPasswords, resetPasswords } = require('../middlewares/validator');
const upload = require('../utils/multer');
const passport = require('passport');
const JWT = require('jsonwebtoken');
const sellerRouter = require('express').Router();


/**
 * @openapi
 * components:
 *   schemas:
 *     Seller:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The seller's email address
 *         password:
 *           type: string
 *           description: The seller's password
 *         confirmPassword:
 *           type: string
 *           description: The seller's password confirmation
 */

/**
 * @openapi
 * /api/v1/seller/register:
 *   post:
 *     summary: Register a new seller
 *     tags:
 *       - Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Seller'
 *     responses:
 *       '201':
 *         description: Seller created successfully. Please check your email for verification.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 token:
 *                   type: string
 *       '400':
 *         description: Validation error or seller already exists
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/seller/verify-user/{token}:
 *   get:
 *     summary: Verify seller account
 *     tags:
 *       - Seller
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for seller verification
 *     responses:
 *       '200':
 *         description: Account successfully verified
 *       '400':
 *         description: Seller already verified or token expired
 *       '404':
 *         description: Seller not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/seller/forget:
 *   post:
 *     summary: Request password reset link
 *     tags:
 *       - Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The seller's email address
 *     responses:
 *       '200':
 *         description: Password reset initiated, check your email for the link
 *       '400':
 *         description: Missing email or seller not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/seller/reset/{token}:
 *   post:
 *     summary: Reset password
 *     tags:
 *       - Seller
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for resetting password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: New password
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm the new password
 *     responses:
 *       '200':
 *         description: Password reset successful
 *       '400':
 *         description: Passwords do not match
 *       '404':
 *         description: Seller not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/seller/login:
 *   post:
 *     summary: Login a seller
 *     tags:
 *       - Seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Seller'
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 token:
 *                   type: string
 *       '400':
 *         description: Invalid email or password
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/seller/signout:
 *   post:
 *     summary: Logout a seller
 *     tags:
 *       - Seller
 *     responses:
 *       '200':
 *         description: Seller logged out successfully
 *       '404':
 *         description: Seller not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/seller/change/{id}:
 *   patch:
 *     summary: Change seller's password
 *     tags:
 *       - Seller
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The seller's ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: New password
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm the new password
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *       '400':
 *         description: Passwords do not match
 *       '404':
 *         description: Seller not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/seller/remove:
 *   delete:
 *     summary: Remove a seller's account
 *     tags:
 *       - Seller
 *     responses:
 *       '200':
 *         description: Seller removed successfully
 *       '404':
 *         description: Seller not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/seller/google-authenticate:
 *   get:
 *     summary: Authenticate seller with Google
 *     tags:
 *       - Seller
 *     responses:
 *       '200':
 *         description: Google authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 token:
 *                   type: string
 *       '500':
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/v1/seller/auth/google/login:
 *   get:
 *     summary: Handle Google login redirect
 *     tags:
 *       - Seller
 *     responses:
 *       '200':
 *         description: Google login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 token:
 *                   type: string
 *       '500':
 *         description: Internal server error
 */


sellerRouter.post('/register', upload.single('profilePic'), registerValidation, register);
sellerRouter.get('/verify-user/:token', verify);
sellerRouter.post('/forget', forgotPassword);
sellerRouter.post('/reset/:token', resetPassword);
sellerRouter.post('/login', login);
sellerRouter.post('/signout', logOut);
sellerRouter.patch('/change/:id', changePassword);
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