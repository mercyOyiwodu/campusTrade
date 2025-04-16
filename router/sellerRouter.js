const { verify, forgotPassword, resetPassword, login, register, updateSeller, deleteSeller, logOut, changePassword, searchSellers,getAll , getSellerDashboard } = require('../controller/sellerController');
const { registerValidation, forgetPasswords, resetPasswords } = require('../middlewares/validator');
const { authenticateAdmin } = require('../middlewares/adminAuth')
const upload = require('../utils/multer');
const passport = require('passport');
const JWT = require('jsonwebtoken');
const sellerRouter = require('express').Router();

/**  
 * @swagger
 * /api/v1/register:
 *   post:
 *     tags:
 *       - Seller
 *     summary: Register a new seller
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "example@email.com"
 *               password:
 *                 type: string
 *                 example: "yourPassword123"
 *               confirmPassword:
 *                 type: string
 *                 example: "yourPassword123"
 *     responses:
 *       201:
 *         description: Seller registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Seller created successfully. Please check your email to verify your account."
 *               data:
 *                 id: 1
 *                 email: "example@email.com"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             example:
 *               message: "Email and password are required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Error creating Seller: [error message]"
 */
sellerRouter.post('/register', register);

/**
 * @swagger
 * /api/v1/verify-user/{token}:
 *   get:
 *     tags:
 *       - Seller
 *     summary: Verify seller account via token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seller verified successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Account verified successfully"
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid or expired token"
 */
 
sellerRouter.get('/verify-user/:token', verify);

/**
 * @swagger
 * /api/v1/forget:
 *   post:
 *     tags:
 *       - Seller
 *     summary: Send password reset link
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
 *       200:
 *         description: Password reset link sent
 *         content:
 *           application/json:
 *             example:
 *               message: "Password reset link sent"
 *       404:
 *         description: Seller not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Seller with this email does not exist"
 */
sellerRouter.post('/forget', forgetPasswords, forgotPassword); 

/**
 * @swagger
 * /api/v1/reset/{token}:
 *   post:
 *     tags:
 *       - Seller
 *     summary: Reset password using token
 *     parameters:
 *       - in: path
 *         name: token
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
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             example:
 *               message: "Password has been reset successfully"
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid or expired token"
 */
sellerRouter.post('/reset/:token', resetPasswords, resetPassword);

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     tags:
 *       - Seller
 *     summary: Login seller
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
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               message: "Login successful"
 *               data:
 *                 token: JWT_TOKEN
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid email or password"
 */
sellerRouter.post('/login', login);

/**
 * @swagger
 * /api/v1/signout:
 *   post:
 *     tags:
 *       - Seller
 *     summary: Sign out seller
 *     responses:
 *       200:
 *         description: Signed out successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Logout successful"
 */
sellerRouter.post('/signout', logOut);

/**
 * @swagger
 * /api/v1/change/{id}:
 *   patch:
 *     tags:
 *       - Seller
 *     summary: Change seller password
 *     parameters:
 *       - in: path
 *         name: id
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
 *               oldPassword:
 *                 type: string
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *               fullName:
 *                 type: John doe
 *               profilePic:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Password changed successfully"
 *       400:
 *         description: Incorrect old password
 *         content:
 *           application/json:
 *             example:
 *               message: "Old password is incorrect"
 */

sellerRouter.patch('/change/:id', changePassword);

/**
 * @swagger
 * /api/v1/remove:
 *   delete:
 *     tags:
 *       - Seller
 *     summary: Delete seller account
 *     responses:
 *       200:
 *         description: Seller deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Seller account deleted successfully"
 */
sellerRouter.delete('/remove', deleteSeller);

/**
 * @swagger
 * /api/v1/searchSellers:
 *   get:
 *     tags:
 *       - Seller
 *     summary: Search for sellers by school or location
 *     parameters:
 *       - in: query
 *         name: school
 *         schema:
 *           type: string
 *         description: Name of the school
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Seller location
 *     responses:
 *       200:
 *         description: Sellers retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Sellers retrieved successfully"
 *               data:
 *                 - id: 1
 *                   fullName: John Doe
 *                   school: UNILAG
 *                   location: Lagos
 *       404:
 *         description: No sellers found
 *         content:
 *           application/json:
 *             example:
 *               message: "No sellers found"
 */
sellerRouter.get('/searchSellers', searchSellers);
 
/**
 * @swagger
 * /api/v1/getSellerDashboard:
 *   get:
 *     tags:
 *       - Seller
 *     summary: Get seller dashboard details
 *     responses:
 *       200:
 *         description: Seller dashboard retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Seller dashboard retrieved successfully"
 *               data:
 *                 totalProducts: 5
 *                 totalOrders: 12
 *                 totalRevenue: 34000
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized access"
 */
sellerRouter.get('/getSellerDashboard', getSellerDashboard);

/**
 * @swagger
 * /api/v1/getAll:
 *   get:
 *     tags:
 *       - Seller (Admin)
 *     summary: Get all sellers (Admin only)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all sellers
 *         content:
 *           application/json:
 *             example:
 *               message: "All sellers retrieved successfully"
 *               data:
 *                 - id: 1
 *                   fullName: John Doe
 *                   email: johndoe@example.com
 */             
sellerRouter.get('/getAll', authenticateAdmin, getAll);

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