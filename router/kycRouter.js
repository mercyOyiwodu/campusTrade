const express = require('express');
const { profileDetails } = require('../controller/kycController');

const kycRouter = express.Router();

/**
 * @swagger
 * /api/v1/profile/{id}:
 *   patch:
 *     summary: Update seller profile details
 *     description: Allows sellers to update their profile information, including KYC details.
 *     operationId: updateSellerProfile
 *     tags:
 *       - Seller Profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the seller to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Seller profile details to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               school:
 *                 type: string
 *                 example: "University of Lagos"
 *               jambRegNo:
 *                 type: string
 *                 example: "1234567890"
 *               location:
 *                 type: string
 *                 example: "Lagos, Nigeria"
 *               description:
 *                 type: string
 *                 example: "Experienced seller of electronic gadgets."
 *               connectLink:
 *                 type: string
 *                 example: "https://www.linkedin.com/in/johndoe"
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348012345678"
 *     responses:
 *       201:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully completed your profile update"
 *                 data:
 *                   $ref: '#/components/schemas/SellerKYC'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Seller not found
 *       500:
 *         description: Internal server error
 * components:
 *   schemas:
 *     SellerKYC:
 *       type: object
 *       properties:
 *         school:
 *           type: string
 *         jambRegNo:
 *           type: string
 *         location:
 *           type: string
 *         description:
 *           type: string
 *         connectLink:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         id:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

kycRouter.patch('/profile/:id', profileDetails);

module.exports = kycRouter;
