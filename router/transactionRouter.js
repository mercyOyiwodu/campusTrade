const { initializePayment, verifyPayment } = require('../controller/transactionController');

const router = require('express').Router();

/**
 * @swagger
 * paths:
 *   /api/v1/initialize:
 *     post:
 *       summary: Initialize a payment
 *       description: Starts a new payment process using customer information and returns a checkout URL.
 *       tags:
 *         - Payment
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *                 - amount
 *                 - name
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "user@example.com"
 *                 amount:
 *                   type: number
 *                   example: 5000
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *       responses:
 *         "200":
 *           description: Payment initialized successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Payment initialized successfully"
 *                   data:
 *                     type: object
 *                     properties:
 *                       reference:
 *                         type: string
 *                         example: "txn_1234567890"
 *                       checkout_url:
 *                         type: string
 *                         format: uri
 *                         example: "https://checkout.korapay.com/xyz"
 *         "400":
 *           description: Missing required fields
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Please input all fields"
 *         "500":
 *           description: Error initializing payment
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Error initializing payment"
 */

router.post('/initialize', initializePayment);


/**
 * @swagger
 * paths:
 *   /api/v1/verify:
 *     get:
 *       summary: Verify a payment
 *       description: Verifies the status of a payment using a reference from the query parameter and updates the transaction record accordingly.
 *       tags:
 *         - Payment
 *       parameters:
 *         - in: query
 *           name: reference
 *           required: true
 *           schema:
 *             type: string
 *           description: The reference of the payment to verify
 *           example: "txn_1234567890"
 *       responses:
 *         "200":
 *           description: Payment verification result
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Payment verified successfully"
 *                   data:
 *                     type: object
 *                     description: Transaction data if successful
 *                     example:
 *                       _id: "60c72b2f9b1d8e3a4c8e4d9b"
 *                       name: "John Doe"
 *                       email: "john@example.com"
 *                       amount: 5000
 *                       reference: "txn_1234567890"
 *                       status: "Success"
 *         "400":
 *           description: Missing reference in query
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Reference is required"
 *         "500":
 *           description: Error verifying payment
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Error initializing payment"
 */

router.get('/verify', verifyPayment)

module.exports = router;