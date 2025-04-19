const { verify, forgotPassword, resetPassword, login, register, deleteSeller, logOut, changePassword, getDashboardStats, getApprovedPosts, getPendingPosts, getRecentPosts, getWeeklyCategoryUploadStats, getAll, getSellerById} = require('../controller/sellerController');
const { registerValidation, forgetPasswords, resetPasswords } = require('../middlewares/validator');
const upload = require('../utils/multer');
const passport = require('passport');
const JWT = require('jsonwebtoken');
const sellerRouter = require('express').Router();
const {authenticateAdmin} =require('../middlewares/adminAuth')
const {authenticate} =require('../middlewares/authentication')


/**
 * @swagger
 * /verify-user/{token}:
 *   get:
 *     summary: Verify a seller's email using a verification token
 *     tags:
 *       - Seller Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token sent to the seller's email
 *     responses:
 *       200:
 *         description: Account verified successfully or new verification link sent
 *         content:
 *           application/json:
 *             example:
 *               message: Account verified successfully
 *       400:
 *         description: Bad request (e.g., seller not found or already verified)
 *         content:
 *           application/json:
 *             example:
 *               message: Seller already verified, please login
 *       404:
 *         description: Seller not found
 *         content:
 *           application/json:
 *             example:
 *               message: Seller not found
 *       500:
 *         description: Server error
 */

sellerRouter.post('/register', register);

/**
 * @swagger
 * /api/v1/verify-user/{token}:
 *   get:
 *     summary: Verify a seller's email using a verification token
 *     tags:
 *       - Seller Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token sent to the seller's email
 *     responses:
 *       200:
 *         description: Account verified successfully or new verification link sent
 *         content:
 *           application/json:
 *             example:
 *               message: Account verified successfully
 *       400:
 *         description: Bad request (e.g., seller not found or already verified)
 *         content:
 *           application/json:
 *             example:
 *               message: Seller already verified, please login
 *       404:
 *         description: Seller not found
 *         content:
 *           application/json:
 *             example:
 *               message: Seller not found
 *       500:
 *         description: Server error
 */

sellerRouter.get('/verify-user/:token', verify);

/**
 * @swagger
 * /api/v1/seller/forget:
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
 * /api/v1/seller/reset/{token}:
 *   post:
 *     summary: Reset seller's password using a token
 *     tags:
 *       - Seller Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token sent to seller's email for password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *                 example: NewStrongPassword123!
 *               confirmPassword:
 *                 type: string
 *                 example: NewStrongPassword123!
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             example:
 *               message: Password reset successful
 *       400:
 *         description: Password mismatch or expired token
 *         content:
 *           application/json:
 *             examples:
 *               mismatch:
 *                 value:
 *                   message: Passwords do not match
 *               expired:
 *                 value:
 *                   message: Link expired, Please initiate a link
 *       404:
 *         description: Seller not found
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 *       500:
 *         description: Internal server error
 */

sellerRouter.post('/reset/:token', resetPasswords, resetPassword);

/**
 * @swagger
 * /api/v1/seller/login:
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
 sellerRouter.post('/login', login)

/**
 * @swagger
 * /api/v1/seller/signout:
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
sellerRouter.post('/signout',authenticate ,logOut);

/**
 * @swagger
 * /api/v1/seller/change/{id}:
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

sellerRouter.patch('/change/:token', changePassword);

/**
 * @swagger
 * /api/v1/seller/remove:
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
sellerRouter.delete('/remove/:id', deleteSeller);


/**
 * @swagger
 * /api/v1/seller/getSellerDashboard:
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
sellerRouter.get('/stats', authenticate, getDashboardStats);
sellerRouter.get('/recent-posts', authenticate, getRecentPosts);
sellerRouter.get('/pending-posts', authenticate, getPendingPosts);
sellerRouter.get('/approved-posts', authenticate, getApprovedPosts);
sellerRouter.get('/category-weekly-stats', authenticate, getWeeklyCategoryUploadStats);


/**
 * @swagger
 * /api/v1/seller/getAll:
 *   get:
 *     tags:
 *       - Seller (Admin)
 *     summary: Get all sellers (Admin only)
 *     description: This endpoint retrieves all registered sellers. Only accessible by authenticated admins using a Bearer token.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all sellers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All registered seller in the platform"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: uuid
 *                         example: "thk890J.iIsInR5cCI6Ikp-XVCJ91"
 *                       fullName:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "johndoe@example.com"
 *                       phoneNumber:
 *                         type: string
 *                         example: "+2348000000000"
 *                       school:
 *                         type: string
 *                         example: "University of Lagos"
 *                 total:
 *                   type: string
 *                   example: "5"
 *       401:
 *         description: Unauthorized - Missing or invalid admin token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: Admin token required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error: [error message]"
 */                                                                                                                                                                              
sellerRouter.get('/getAll', authenticateAdmin, getAll);


sellerRouter.get('/getOneSeller/:id',getSellerById)

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
sellerRouter.get('/google-authenticate', passport.authenticate('google', {scope: ['profile', 'email']}));

/**
 * @Swagger
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

sellerRouter.get('/auth/google/login', passport.authenticate('google'), async (req, res)=>{
    try{
        const token = await JWT.sign({sellerId: req.seller.id, isVerified: req.seller.isVerified},
            process.env.JWT_SECRET, {expiresIn: '1day'});
            const redirectUrl = `https://legacy-builder.vercel.app/callback/${token}/${req.seller.id}`;
    return res.redirect(redirectUrl);

    //    res.status(200).json({
    //        message: 'Google Auth Login Successful',
    //        data: req.seller,
    //        token
    //    });
    }catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Internal Server Error" 
        });

    }

    
   
})



module.exports = sellerRouter;