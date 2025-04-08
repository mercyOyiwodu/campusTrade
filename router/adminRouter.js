const adminRouter = require('express').Router();
const adminController = require('../controller/adminController');
const { authenticateAdmin, isSuperAdmin, adminAuth } = require('../middlewares/adminAuth');
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
// adminRouter.patch('/make-admin/:id', authenticateAdmin, isSuperAdmin, adminController.createAdmin);

// adminRouter.patch('/make-super/:id', authenticateAdmin, adminController.makeSuperAdmin);
adminRouter.post('/login', adminController.loginAdmin);

adminRouter.get('/sellers/:id/verify', authenticateAdmin, adminAuth, adminController.verifySeller);

// Export router
module.exports = adminRouter ;
