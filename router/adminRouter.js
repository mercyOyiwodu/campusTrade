const adminRouter = require('express').Router();
const {loginAdmin, createAdmin, verifyAdmin, verifySeller}= require('../controller/adminController');
const { authenticateAdmin, adminAuth } = require('../middlewares/adminAuth');
const { registerValidation} = require('../middlewares/validator');

const JWT = require('jsonwebtoken');

/**
 * @swagger
 * /api/v1/createAdmin:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *               confirmPassword:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Validation error or admin already exists
 *       500:
 *         description: Internal server error
 */
adminRouter.post('/createAdmin', registerValidation, createAdmin);

/**
 * @swagger
 * /api/v1/verify-seller/{sellerId}:
 *   patch:
 *     summary: Verify a seller account
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the seller to verify
 *     responses:
 *       200:
 *         description: Seller verified successfully
 *       404:
 *         description: Seller not found
 *       500:
 *         description: "Internal server error:<error-message>"
 */
adminRouter.patch('/verify-seller/:sellerId', authenticateAdmin, verifySeller);

/**
 * @swagger
 * /api/v1/verify-admin/{token}:
 *   get:
 *     summary: Verify admin email via token
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token sent via email
 *     responses:
 *       200:
 *         description: Account verified successfully
 *       400:
 *         description: Already verified or link expired
 *       404:
 *         description: Admin not found
 *       500:
 *         description: "Internal server error: <error-message>"
 */
adminRouter.get('/verify-admin/:token', verifyAdmin);

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
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
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: "Internal server error:<error-message>"
 */
adminRouter.post('/login', loginAdmin);

module.exports = adminRouter ;
