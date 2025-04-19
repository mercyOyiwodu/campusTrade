const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, approveProduct, getApprovedProducts, getPendingProducts, rejectProduct } = require('../controller/product');
const { authenticate } = require('../middlewares/authentication');
const upload = require('../utils/multer');
const router = require('express').Router();

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Endpoints related to product operations
 */

/**
 * @swagger
 * /products/{categoryId}/{subCategoryId}:
 *   post:
 *     summary: Create a product
 *     description: This endpoint allows a seller to create a new product post in a specific category and subcategory. It also handles media file uploads to Cloudinary and validates the seller's KYC and existence.
 *     tags:
 *       - Product
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         description: The category ID where the product will be posted.
 *         required: true
 *         type: string
 *         format: uuid
 *       - name: subCategoryId
 *         in: path
 *         description: The subcategory ID where the product will be posted.
 *         required: true
 *         type: string
 *         format: uuid
 *       - name: Authorization
 *         in: header
 *         description: JWT token for seller authentication.
 *         required: true
 *         type: string
 *       - name: media
 *         in: formData
 *         description: Media files to be uploaded with the product.
 *         required: false
 *         type: file
 *         collectionFormat: multi
 *         maxItems: 5
 *     responses:
 *       201:
 *         description: Product created successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Post created successfully"
 *             data:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "d4e5f6b7-8a9c-4d3e-bbc9-201b3c10d20f"
 *                 productName:
 *                   type: string
 *                   example: "Product A"
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 100.50
 *                 condition:
 *                   type: string
 *                   example: "New"
 *                 school:
 *                   type: string
 *                   example: "University A"
 *                 description:
 *                   type: string
 *                   example: "This is a description of the product."
 *                 media:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: uri
 *                     example: "https://res.cloudinary.com/.../image.jpg"
 *                 sellerId:
 *                   type: string
 *                   format: uuid
 *                   example: "e7f6b9d1-3c9f-4d01-9b8e-9a4b1a70b507"
 *                 subCategoryId:
 *                   type: string
 *                   format: uuid
 *                   example: "12c8b9b1-3a92-4cd7-9d65-f9a83970d472"
 *                 timeCreated:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-19T12:00:00Z"
 *                 status:
 *                   type: string
 *                   example: "pending"
 *       400:
 *         description: Bad request, missing required fields.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Please complete your profile before proceeding"
 *       404:
 *         description: Seller or Seller KYC not found.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Seller not found"
 *       500:
 *         description: Server error.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Internal server error"
 */
router.post('/products/:categoryId/:subCategoryId', authenticate,upload.array('media', 5), createProduct);


/**
 * @swagger
 * paths:
 *   /api/v1/products:
 *     get:
 *       summary: Get all products
 *       description: Retrieves a list of all products with their associated seller information.
 *       tags:
 *         - Product
 *       responses:
 *         "200":
 *           description: Products retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Products retrieved successfully"
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "60d0fe4f5311236168a109ca"
 *                         productName:
 *                           type: string
 *                           example: "Mathematics Textbook"
 *                         price:
 *                           type: number
 *                           example: 3000
 *                         condition:
 *                           type: string
 *                           example: "New"
 *                         school:
 *                           type: string
 *                           example: "University of Lagos"
 *                         description:
 *                           type: string
 *                           example: "This textbook covers fundamental mathematics topics."
 *                         media:
 *                           type: array
 *                           items:
 *                             type: string
 *                             example: "https://res.cloudinary.com/yourcloud/image/upload/v123456/product.jpg"
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Error retrieving products: <error-message>"
 */
router.get('/products', getAllProducts);

/**
 * @swagger
 * paths:
 *   /api/v1/oneproduct/{id}:
 *     get:
 *       summary: Get a product by ID
 *       description: Retrieves a specific product by its ID with the associated seller information.
 *       tags:
 *         - Product
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the product to retrieve
 *           example: "60d0fe4f5311236168a109ca"
 *       responses:
 *         "200":
 *           description: Product retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Product retrieved successfully"
 *                   data:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "60d0fe4f5311236168a109ca"
 *                       productName:
 *                         type: string
 *                         example: "Mathematics Textbook"
 *                       price:
 *                         type: number
 *                         example: 3000
 *                       condition:
 *                         type: string
 *                         example: "New"
 *                       school:
 *                         type: string
 *                         example: "University of Lagos"
 *                       description:
 *                         type: string
 *                         example: "This textbook covers fundamental mathematics topics."
 *                       media:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "https://res.cloudinary.com/yourcloud/image/upload/v123456/product.jpg"
 *         "404":
 *           description: Product not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Product not found"
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Error retrieving product: <error-message>"
 */
router.get('/oneproduct/:id', getProductById);

/**
 * @swagger
 * paths:
 *   /api/v1/update-product/{id}:
 *     put:
 *       summary: Update a product
 *       description: Updates an existing product's details and media.
 *       tags:
 *         - Product
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the product to update
 *           example: "60d0fe4f5311236168a109ca"
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 productName:
 *                   type: string
 *                   example: "Mathematics Textbook"
 *                 price:
 *                   type: number
 *                   example: 3000
 *                 condition:
 *                   type: string
 *                   example: "New"
 *                 school:
 *                   type: string
 *                   example: "University of Lagos"
 *                 description:
 *                   type: string
 *                   example: "Updated description"
 *                 media:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: binary
 *                   description: Optional media to upload
 *       responses:
 *         "200":
 *           description: Product updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Product updated successfully"
 *                   data:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "60d0fe4f5311236168a109ca"
 *                       productName:
 *                         type: string
 *                         example: "Mathematics Textbook"
 *                       price:
 *                         type: number
 *                         example: 3000
 *                       condition:
 *                         type: string
 *                         example: "New"
 *                       school:
 *                         type: string
 *                         example: "University of Lagos"
 *                       description:
 *                         type: string
 *                         example: "Updated description"
 *                       media:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "https://res.cloudinary.com/yourcloud/image/upload/v123456/product.jpg"
 *         "404":
 *           description: Product not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Product not found"
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Error updating product: <error-message>"
 */
router.put('/update-product/:id', upload.array('media', 5), updateProduct);

/**
 * @swagger
 * paths:
 *   /api/v1/delete-product/{id}:
 *     delete:
 *       summary: Delete a product
 *       description: Deletes a product by its ID.
 *       tags:
 *         - Product
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the product to delete
 *           example: "60d0fe4f5311236168a109ca"
 *       responses:
 *         "200":
 *           description: Product deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Product deleted successfully"
 *         "404":
 *           description: Product not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Product not found"
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Error deleting product: <error-message>"
 */


router.delete('/delete-product/:id', deleteProduct);
/**
 * @swagger
 * /api/v1/approve-product/{id}:
 *   patch:
 *     summary: Approve a product post
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to approve
 *     responses:
 *       200:
 *         description: Product approved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: "Server error:<error-message>"
 */
router.post('/approve-product/:id', approveProduct);

/**
 * @swagger
 * /api/v1/not-approve/{id}:
 *   post:
 *     summary: Reject a product post
 *     tags:
 *       - Product
 *     description: Sets the product status to `not_approved` for a specific product by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to reject
 *     responses:
 *       200:
 *         description: Product rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product rejected
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/not-approve/:id',rejectProduct)

/**
 * @swagger
 * /api/v1/all-approved-product:
 *   get:
 *     summary: Retrieve all approved products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: List of approved products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: "Server error:<error-message>"
 */
router.get('/all-approved-product', getApprovedProducts);

/**
 * @swagger
 * /api/v1/all-pending-product:
 *   get:
 *     summary: Retrieve all pending products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: List of pending products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: "Server error:<error-message>"
 */

router.get('/all-pending-product', getPendingProducts);

module.exports = router;
