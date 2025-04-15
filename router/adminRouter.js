const adminRouter = require('express').Router();
const {loginAdmin, createAdmin, verifyAdmin, verifySeller}= require('../controller/adminController');
const { authenticateAdmin, adminAuth } = require('../middlewares/adminAuth');
const { registerValidation} = require('../middlewares/validator');
const JWT = require('jsonwebtoken');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints for admin management
 */


// Authentication routes
/**
 * @swagger
 * /api/v1/make-admin/{id}:
 *   patch:
 *     summary: Make a user an admin
 *     description: Grants admin privileges to a user. **Requires authentication and Super Admin role.**
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []  # Requires authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to be made an admin
 *     responses:
 *       200:
 *         description: User successfully promoted to admin.
 *       400:
 *         description: User is already an admin.
 *       401:
 *         description: Unauthorized - No token provided or insufficient privileges.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */
adminRouter.post('/createAdmin', registerValidation, createAdmin);
adminRouter.patch('/verify-seller/:sellerId', authenticateAdmin, verifySeller);

// adminRouter.patch('/make-admin/:id', authenticateAdmin, adminController.createAdmin);
adminRouter.get('/verify-admin/:token', verifyAdmin)
adminRouter.post('/login', loginAdmin);

// Export router
module.exports = adminRouter ;
