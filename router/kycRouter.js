const express = require('express');
const { profileDetails } = require('../controller/kycController');
const { registerValidation } = require('../middlewares/validator');
const upload = require('../utils/multer');
const kycRouter = express.Router();

/**
 * @swagger
 * /api/v1/kyc/profile/{id}:
 *   patch:
 *     summary: Update seller profile with KYC information
 *     description: Allows a seller to complete their profile by submitting KYC details including an image or video.
 *     tags:
 *       - Seller KYC
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The seller ID
 *         example: "f78c8e4f-bb1c-442e-93b9-3cce27681b3a"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profilePic
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Jane Doe"
 *               jambRegNo:
 *                 type: string
 *                 example: "12345678AB"
 *               description:
 *                 type: string
 *                 example: "Student entrepreneur and product reseller."
 *               school:
 *                 type: string
 *                 example: "University of Lagos"
 *               gender:
 *                 type: string
 *                 example: "Female"
 *               whatsappLink:
 *                 type: string
 *                 example: "https://wa.me/2348012345678"
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348012345678"
 *               profilePic:
 *                 type: string
 *                 format: binary
 *                 description: "Image or video file"
 *     responses:
 *       "201":
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully completed your profile update"
 *                 data:
 *                   $ref: "#/components/schemas/SellerKYC"
 *       "400":
 *         description: Validation or upload error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile image is required"
 *       "404":
 *         description: Seller not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Seller not found"
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
kycRouter.patch('/profile/:id', upload.single('profilePic'), profileDetails);



module.exports = kycRouter;