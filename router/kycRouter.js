const express = require('express');
const { profileDetails, getSellerKyc } = require('../controller/kycController');
const { registerValidation } = require('../middlewares/validator');
const upload = require('../utils/multer');
const kycRouter = express.Router();

/**
 * @swagger
 * /api/v1/kyc/profile/{id}:
 *   patch:
 *     summary: Complete seller profile details (KYC)
 *     tags:
 *       - Seller KYC
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Seller ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profilePic
 *             properties:
 *               profilePic:
 *                 type: string
 *                 format: binary
 *               fullName:
 *                 type: string
 *               jambRegNo:
 *                 type: string
 *               school:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               whatsappLink:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully completed your profile update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     school:
 *                       type: string
 *                     jambRegNo:
 *                       type: string
 *                     whatsappLink:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     profilePic:
 *                       type: string
 *                     fullName:
 *                       type: string
 *       400:
 *         description: Missing or invalid input
 *       404:
 *         description: Seller not found
 *       500:
 *         description: Internal server error
 */

kycRouter.patch('/profile/:id', upload.single('profilePic'), profileDetails);

/**
 * @swagger
 * /api/v1/kyc/get-kyc-details/{id}:
 *   get:
 *     summary: Retrieve a seller's KYC details
 *     description: Fetches the seller information along with their KYC (Know Your Customer) details using the seller's unique ID.
 *     tags:
 *       - Seller KYC
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the seller
 *         schema:
 *           type: string
 *           example: "e8c3bfa4-49d2-4c1f-95e5-b39e34f09d10"
 *     responses:
 *       200:
 *         description: Seller and KYC details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Seller retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: e8c3bfa4-49d2-4c1f-95e5-b39e34f09d10
 *                     fullName:
 *                       type: string
 *                       example: Jane Doe
 *                     email:
 *                       type: string
 *                       example: janedoe@example.com
 *                     kycDetails:
 *                       type: object
 *                       properties:
 *                         bvn:
 *                           type: string
 *                           example: "2233445566"
 *                         nin:
 *                           type: string
 *                           example: "12345678901"
 *                         address:
 *                           type: string
 *                           example: "45 Banana Island Road, Ikoyi, Lagos"
 *                         documentType:
 *                           type: string
 *                           example: "National ID"
 *                         documentUrl:
 *                           type: string
 *                           example: "https://example.com/uploads/nin-card.jpg"
 *       404:
 *         description: Seller not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Seller not found
 *       500:
 *         description: Server error while fetching seller data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "There was an issue getting the user detail: Internal Server Error"
 */

kycRouter.get('/get-kyc-details/:id', getSellerKyc);

module.exports = kycRouter;