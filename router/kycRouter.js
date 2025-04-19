const express = require('express');
const { profileDetails } = require('../controller/kycController');
const { registerValidation } = require('../middlewares/validator');
const upload = require('../utils/multer');
const kycRouter = express.Router();

/**
 * @swagger
 * /api/kyc/profile/{id}:
 *   patch:
 *     summary: Complete seller profile details (KYC)
 *     tags:
 *       - Seller 
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



module.exports = kycRouter;