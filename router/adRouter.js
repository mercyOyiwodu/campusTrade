const { createAd, getAllAds, getAdById, deleteAd} = require('../controller/ADcontroller')
const { authenticateAdmin } = require('../middlewares/adminAuth');
const adRouter = require('express').Router();
const upload = require('../utils/multer');


/**
 * @swagger
 * /api/v1/createAd:
 *   post:
 *     tags:
 *       - Advertisement
 *     summary: Create a new advertisement
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "iPhone 12 for sale"
 *               description:
 *                 type: string
 *                 example: "Slightly used iPhone 12 available for pickup"
 *               price:
 *                 type: number
 *                 example: 350000
 *               sellerId:
 *                 type: string
 *                 example: "3"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Advertisement created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Ad created successfully"
 *               data:
 *                 id: 1
 *                 title: "iPhone 12 for sale"
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             example:
 *               message: "Missing required fields"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Error creating ad: [Error message]"
 */

adRouter.post('/createAd', upload.single('image'), authenticateAdmin, createAd);

/**
 * @swagger
 * /api/v1/getAllAds:
 *   get:
 *     tags:
 *       - Advertisement
 *     summary: Get all advertisements
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all ads
 *         content:
 *           application/json:
 *             example:
 *               message: "All ads retrieved successfully"
 *               data:
 *                 - id: 1
 *                   title: "iPhone 12 for sale"
 *                   price: 350000
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error: [Error message]"
 */

adRouter.get('/getAllAds', authenticateAdmin, getAllAds);


/**
 * @swagger
 * /api/v1/getAdById/{id}:
 *   get:
 *     tags:
 *       - Advertisement
 *     summary: Get ad by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ad found
 *         content:
 *           application/json:
 *             example:
 *               message: "Ad found"
 *               data:
 *                 id: 1
 *                 title: "iPhone 12 for sale"
 *       404:
 *         description: Ad not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Ad with ID: 1 not found"
 */

adRouter.get('/getAdById/:id', authenticateAdmin, getAdById);

adRouter.delete('/deleteAd/:id',authenticateAdmin, deleteAd);

module.exports = adRouter