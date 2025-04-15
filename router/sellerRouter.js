const { verify, forgotPassword, resetPassword, login, register, updateSeller, deleteSeller, logOut, changePassword } = require('../controller/sellerController');
const { registerValidation, forgetPasswords, resetPasswords } = require('../middlewares/validator');
const upload = require('../utils/multer');
const passport = require('passport');
const JWT = require('jsonwebtoken');
const sellerRouter = require('express').Router();
 

/**
 * @swagger
 * paths:
 *   /api/v1/register:
 *     post:
 *       summary: Register a new seller
 *       description: Registers a new seller with required details and a profile image. Sends a verification email after registration.
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
 *                 - confirmPassword
 *                 - profilePic
 *               properties:
 *                 fullName:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "john@example.com"
 *                 password:
 *                   type: string
 *                   format: password
 *                   example: "StrongPassword123"
 *                 confirmPassword:
 *                   type: string
 *                   format: password
 *                   example: "StrongPassword123"
 *                 phoneNumber:
 *                   type: string
 *                   example: "08012345678"
 *                 profilePic:
 *                   type: string
 *                   format: binary
 *                   description: Seller's profile picture (required)
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
 *                     example:
 *                       id: "1"
 *                       fullName: "John Doe"
 *                       email: "john@example.com"
 *                       profilePic: "https://res.cloudinary.com/your-cloud/image/upload/v1/profile.jpg"
 *                       isloggedIn: false
 *                       phoneNumber: "08012345678"
 *                   token:
 *                     type: string
 *                     example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         "400":
 *           description: Bad request (validation failure, existing user, or missing fields)
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
 *                     example: "Error creating Seller: [error details]"
 */

sellerRouter.post('/register', upload.single('profilePic'), registerValidation, register);


/**
 * @swagger
 * paths:
 *   /api/v1/verify-user/{token}:
 *     get:
 *       summary: Verify seller's email
 *       description: Verifies the seller's account using a JWT token sent to their email. If the token is expired, a new one is issued and emailed.
 *       tags:
 *         - Seller
 *       parameters:
 *         - name: token
 *           in: path
 *           required: true
 *           description: JWT token sent via email for account verification
 *           schema:
 *             type: string
 *             example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       responses:
 *         "200":
 *           description: Verification status response
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 oneOf:
 *                   - properties:
 *                       message:
 *                         type: string
 *                         example: "Account verified successfully"
 *                   - properties:
 *                       message:
 *                         type: string
 *                         example: "Link expired: A new verification link was sent, please check your email"
 *         "400":
 *           description: Invalid or already verified token / seller not found
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
 *                     example: "Internal server error TokenExpiredError:<error-message>"
 */
sellerRouter.get('/verify-user/:token', verify);


/**
 * @swagger
 * /api/v1/forget:
 *   post:
 *     summary: Initiate password reset
 *     description: Sends a password reset link to the seller's email address.
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
 *                 example: johndoe@example.com
 *     responses:
 *       "200":
 *         description: Password reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset initiated, Please check your email for the reset link
 *       "400":
 *         description: Email not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Please input your email
 *       "404":
 *         description: Seller not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error: <error-message>"
 */
sellerRouter.post('/forget', forgotPassword);


/**
 * @swagger
 * /api/v1/reset/{token}:
 *   post:
 *     summary: Reset seller's password
 *     description: Allows a seller to reset their password using a valid token sent to their email.
 *     tags:
 *       - Seller
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: JWT token from the password reset email
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
 *                 example: newStrongPassword123
 *               confirmPassword:
 *                 type: string
 *                 example: newStrongPassword123
 *     responses:
 *       "200":
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successful
 *       "400":
 *         description: Passwords do not match or link expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password does not match
 *       "404":
 *         description: Seller not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error:<error-message>"
 */
sellerRouter.post('/reset/:token', resetPassword);


/**
 * @swagger
 * paths:
 *   /api/v1/login:
 *     post:
 *       summary: Seller login
 *       description: Authenticates a seller using email and password, returning a token upon successful login.
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
 *                   example: johndoe@example.com
 *                 password:
 *                   type: string
 *                   example: mySecurePassword123
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
 *                     example: Login successful
 *                   data:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       fullName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       profilePic:
 *                         type: string
 *                       isVerified:
 *                         type: boolean
 *                       phoneNumber:
 *                         type: string
 *                       isAdmin:
 *                         type: boolean
 *                   token:
 *                     type: string
 *                     example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         "400":
 *           description: Missing credentials, user not found or invalid password
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Seller not found
 *         "500":
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Internal server error: [Error message]" 
 */
sellerRouter.post('/login', login);


/**
 * @swagger
 * paths:
 *   /api/v1/signout:
 *     post:
 *       summary: Seller logout
 *       description: Logs out a seller by setting their isLoggedIn status to false.
 *       tags:
 *         - Seller
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         "200":
 *           description: Logout successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: user logged out successfully
 *         "404":
 *           description: Seller not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: user not found
 *         "500":
 *           description: Server error during logout
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Error Logging out User :<error-message>"
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
 * /api/v1/edit-profile/{id}:
 *   patch:
 *     summary: Update seller profile
 *     description: Updates seller profile information such as full name and profile picture.
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the seller to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: John doe
 *               profilePic:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       "200":
 *         description: Seller profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your information has been updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Seller'
 *       "404":
 *         description: Seller not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       "500":
 *         description: Error updating seller
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating seller: <error-message>"
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