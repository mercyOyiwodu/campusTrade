const express = require('express');
const { profileDetails } = require('../controller/kycController');
const { registerValidation } = require('../middlewares/validator');
const upload = require('../utils/multer');
const kycRouter = express.Router();

/**
 * @swagger
 * /api/v1/kyc/profile/{id}:
 *   patch:
 *     summary: Complete seller KYC profile
 *     description: Allows a seller to upload their profile picture and complete profile details.
 *     tags:
 *       - KYC
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the seller.
 *         example: 23
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
 *                 description: Profile image (JPEG, PNG, or video formats).
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               jambRegNo:
 *                 type: string
 *                 example: 12345678AB
 *               description:
 *                 type: string
 *                 example: Tech enthusiast with a passion for trade.
 *               school:
 *                 type: string
 *                 example: University of Lagos
 *               location:
 *                 type: string
 *                 example: Yaba, Lagos
 *               connectLink:
 *                 type: string
 *                 example: https://t.me/johndoe
 *               phoneNumber:
 *                 type: string
 *                 example: 08123456789
 *     responses:
 *       "201":
 *         description: Successfully completed profile update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully completed your profile update
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     jambRegNo:
 *                       type: string
 *                     description:
 *                       type: string
 *                     school:
 *                       type: string
 *                     location:
 *                       type: string
 *                     connectLink:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     profilePic:
 *                       type: string
 *                       example: https://res.cloudinary.com/yourapp/image/upload/v123456789/profile.jpg
 *       "400":
 *         description: Profile image is required or bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile image is required
 *       "404":
 *         description: Seller not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Seller not found
 *       "500":
 *         description: Failed to update profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to update profile
 */
kycRouter.patch('/profile/:id', upload.single('profilePic'), registerValidation, profileDetails);



module.exports = kycRouter;