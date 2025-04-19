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
 *           example: "e8c3bfa4-49d2-4c1f-95e5-b39e34f09d10"
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
 *                 description: Profile picture of the seller (image file)
 *                 example: "profile_pic.jpg"  # This is just a placeholder for the file name
 *               fullName:
 *                 type: string
 *                 example: "Jane Doe"
 *               jambRegNo:
 *                 type: string
 *                 example: "1234567890"
 *               school:
 *                 type: string
 *                 example: "University of Lagos"
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *                 example: "female"
 *               whatsappLink:
 *                 type: string
 *                 example: "https://wa.me/2348098765432"
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348098765432"
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
 *                   example: "Profile updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "e8c3bfa4-49d2-4c1f-95e5-b39e34f09d10"
 *                     fullName:
 *                       type: string
 *                       example: "Jane Doe"
 *                     jambRegNo:
 *                       type: string
 *                       example: "1234567890"
 *                     school:
 *                       type: string
 *                       example: "University of Lagos"
 *                     gender:
 *                       type: string
 *                       example: "female"
 *                     whatsappLink:
 *                       type: string
 *                       example: "https://wa.me/2348098765432"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+2348098765432"
 *                     profilePic:
 *                       type: string
 *                       format: binary
 *                       example: "profile_pic.jpg"
 *       400:
 *         description: Missing or invalid input
 *       404:
 *         description: Seller not found
 *       500:
 *         description: Internal server error
 */

kycRouter.get('/get-kyc-details/:id', getSellerKyc);

module.exports = kycRouter;