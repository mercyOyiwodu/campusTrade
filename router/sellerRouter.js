const { verify, forgotPassword, resetPassword, login, register, updateSeller, deleteSeller } = require('../controller/sellerController');
const { registerValidation } = require('../middlewares/validator');
const upload = require('../utils/multer');
const passport = require('passport');
const JWT = require('jsonwebtoken');
const sellerRouter = require('express').Router();
/**
 * @swagger
 * tags:
 *   name: Seller
 *   description: Endpoints related to user authentication
 */


/**
 * @swagger
 * paths:
 *   /api/v1/sellers/register:
 *     post:
 *       summary: Register a new seller
 *       description: Creates a new seller account, uploads profile image, hashes password, and sends a verification email.
 *       tags:
 *         - Seller
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               required:
 *                 - fullName
 *                 - email
 *                 - password
 *                 - profilePic
 *               properties:
 *                 fullName:
 *                   type: string
 *                   example: "Jane Doe"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "janedoe@example.com"
 *                 password:
 *                   type: string
 *                   format: password
 *                   example: "StrongPassword123"
 *                 phoneNumber:
 *                   type: string
 *                   example: "08012345678"
 *                 profilePic:
 *                   type: string
 *                   format: binary
 *                 jambRegNo:
 *                   type: string
 *                   example: "12345678AB"
 *                 location:
 *                   type: string
 *                   example: "Lagos, Nigeria"
 *                 school:
 *                   type: string
 *                   example: "University of Lagos"
 *                 connectLink:
 *                   type: string
 *                   example: "https://linkedin.com/in/janedoe"
 *                 description:
 *                   type: string
 *                   example: "I sell textbooks and educational materials."
 *       responses:
 *         "201":
 *           description: Seller registered successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Seller created successfully. Please check your email to verify your account."
 *                   data:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "60d0fe4f5311236168a109cb"
 *                       fullName:
 *                         type: string
 *                         example: "Jane Doe"
 *                       email:
 *                         type: string
 *                         example: "janedoe@example.com"
 *                       phoneNumber:
 *                         type: string
 *                         example: "08012345678"
 *                       profilePic:
 *                         type: string
 *                         example: "https://res.cloudinary.com/yourcloud/image/upload/v123456/profile.jpg"
 *                       jambRegNo:
 *                         type: string
 *                         example: "12345678AB"
 *                       location:
 *                         type: string
 *                         example: "Lagos, Nigeria"
 *                       school:
 *                         type: string
 *                         example: "University of Lagos"
 *                       connectLink:
 *                         type: string
 *                         example: "https://linkedin.com/in/janedoe"
 *                       description:
 *                         type: string
 *                         example: "I sell textbooks and educational materials."
 *         "400":
 *           description: Bad Request - Missing or invalid fields
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Profile image is required"
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Error creating Seller: Something went wrong"
 */

sellerRouter.post('/register', registerValidation, upload.single('profilePic'), register);

/**
 * @swagger
 * paths:
 *   /api/v1/verify-user/{token}:
 *     get:
 *       summary: Verify seller email
 *       description: Verifies a seller's email using a token from the email link. If the token is expired, a new one is sent automatically.
 *       tags:
 *         - Seller
 *       parameters:
 *         - in: path
 *           name: token
 *           required: true
 *           schema:
 *             type: string
 *           description: JWT token sent to the seller's email
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       responses:
 *         "200":
 *           description: Account verified or new link sent
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Account verified successfully"
 *         "400":
 *           description: Verification issues (already verified or seller not found)
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Seller already verified, please login"
 *         "404":
 *           description: Seller not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Seller not found"
 *         "500":
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Internal server error TokenExpiredError"
 */

sellerRouter.get('/verify-user/:token', verify);

sellerRouter.post('/forget', forgotPassword);

sellerRouter.post('/reset', resetPassword);

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and returns a token.
 *     tags: [User]
 *     security: []  # No authentication required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPassword123!
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                 token:
 *                   type: string
 *                   example: jwt_token_here
 *       400:
 *         description: Invalid password or missing credentials.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */
sellerRouter.post('/login', login);
sellerRouter.patch('edit-profile', updateSeller)
sellerRouter.delete('remove', deleteSeller)

/**
 * @swagger
 * /api/v1/google-authenticate:
 *   get:
 *     summary: Google Authentication
 *     description: Redirects to Google's authentication page. **No authentication required.**
 *     tags: [User]
 *     security: []  # No authentication required
 *     responses:
 *       302:
 *         description: Redirects to Google authentication.
 */
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