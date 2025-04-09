const { verify, forgotPassword, resetPassword, login, register, updateSeller, deleteSeller, logOut, changePassword } = require('../controller/sellerController');
const { registerValidation, forgetPasswords, resetPasswords } = require('../middlewares/validator');
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
 *   /api/v1/register:
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

sellerRouter.post('/register',  upload.single('profilePic'), registerValidation, register);

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

/**
 * @swagger
 * paths:
 *   /api/v1/forget:
 *     post:
 *       summary: Initiate password reset
 *       description: Sends a password reset link to the seller's email if the account exists.
 *       tags:
 *         - Seller
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "janedoe@example.com"
 *       responses:
 *         "200":
 *           description: Password reset link sent successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Password reset initiated, Please check your email for the reset link"
 *         "400":
 *           description: Email not provided
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Please input your email"
 *         "404":
 *           description: Seller not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User not found"
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Internal Server Error"
 */
sellerRouter.post('/forget', forgetPasswords, forgotPassword);

/**
 * @swagger
 * paths:
 *   /api/v1/reset:
 *     post:
 *       summary: Reset seller password
 *       description: Resets the seller's password using a token from the email reset link.
 *       tags:
 *         - Seller
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - token
 *                 - password
 *                 - confirmPassword
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 password:
 *                   type: string
 *                   format: password
 *                   example: "NewSecurePassword123"
 *                 confirmPassword:
 *                   type: string
 *                   format: password
 *                   example: "NewSecurePassword123"
 *       responses:
 *         "200":
 *           description: Password reset successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Password reset successful"
 *         "400":
 *           description: Invalid input or token expired
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Password does not match"
 *         "404":
 *           description: Seller not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User not found"
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Internal Server Error"
 */
sellerRouter.post('/reset', resetPasswords, resetPassword);

/**
 * @swagger
 * paths:
 *   /api/v1/login:
 *     post:
 *       summary: Seller login
 *       description: Authenticates a seller and returns a JWT token.
 *       tags:
 *         - Seller
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *                 - password
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "janedoe@example.com"
 *                 password:
 *                   type: string
 *                   format: password
 *                   example: "SecurePassword123"
 *       responses:
 *         "200":
 *           description: Login successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Login successful"
 *                   data:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "60d0fe4f5311236168a109ca"
 *                       fullName:
 *                         type: string
 *                         example: "Jane Doe"
 *                       email:
 *                         type: string
 *                         example: "janedoe@example.com"
 *                       isVerified:
 *                         type: boolean
 *                         example: true
 *                       isAdmin:
 *                         type: boolean
 *                         example: false
 *                   token:
 *                     type: string
 *                     example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         "400":
 *           description: Missing credentials, user not found, or invalid password
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Invalid password"
 *         "500":
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Internal server error"
 */
sellerRouter.post('/login', login);
sellerRouter.post('/signout', logOut);
sellerRouter.patch('/change/:id', changePassword);

/**
 * @swagger
 * paths:
 *   /api/v1/edit-profile:
 *     patch:
 *       summary: Update seller profile
 *       description: Updates a seller's profile including full name, email, and optionally profile picture.
 *       tags:
 *         - Seller
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID of the seller to update
 *                   example: "123"
 *                 fullName:
 *                   type: string
 *                   example: "Jane Doe"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "jane@example.com"
 *                 profilePic:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: binary
 *                   description: Optional new profile image(s)
 *       responses:
 *         "201":
 *           description: User updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User created successfully"
 *                   data:
 *                     type: object
 *                     description: The updated user object
 *                     example:
 *                       id: "123"
 *                       fullName: "Jane Doe"
 *                       email: "jane@example.com"
 *                       profilePic: ["profile1.jpg"]
 *         "404":
 *           description: Seller not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User not found"
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Internal Server Error: [error details]"
 */

sellerRouter.patch('edit-profile', updateSeller)

/**
 * @swagger
 * paths:
 *   /api/v1/remove:
 *     delete:
 *       summary: Delete seller account
 *       description: Deletes a seller account and removes associated profile pictures from the server.
 *       tags:
 *         - Seller
 *       parameters:
 *         - in: query
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the seller to be deleted
 *           example: "123"
 *       responses:
 *         "201":
 *           description: User deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User deleted successfully"
 *         "404":
 *           description: Seller not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User not found"
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Internal Server Error: [error details]"
 */

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