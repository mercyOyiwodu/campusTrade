const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controller/product');
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
 * paths:
 *   /api/v1/products/{categoryId}/{sellerId}:
 *     post:
 *       summary: Create a new product
 *       description: Creates a new product for the seller with product images uploaded to Cloudinary.
 *       tags:
 *         - Product
 *       parameters:
 *         - in: path
 *           name: categoryId
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the product category
 *           example: "1"
 *         - in: path
 *           name: sellerId
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the seller
 *           example: "60d0fe4f5311236168a109cb"
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               required:
 *                 - productName
 *                 - price
 *                 - condition
 *                 - school
 *                 - description
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
 *                   example: "This textbook covers fundamental mathematics topics."
 *                 media:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: binary
 *                   description: Images or media related to the product
 *       responses:
 *         "201":
 *           description: Product created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Product created successfully"
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
 *         "400":
 *           description: Bad Request - Missing or invalid fields
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Product name, price, condition, school, and description are required"
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Error creating product"
 */

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
 *                     example: "Error retrieving products"
 */

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
 *                     example: "Error retrieving product"
 */

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
 *                     example: "Error updating product"
 */

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
 *                     example: "Error deleting product"
 */


router.post('/products/:categoryId/:sellerId', upload.array('media', 5), createProduct);

router.get('/products', getAllProducts);

router.get('/oneproduct/:id', getProductById);

router.put('/update-product/:id', upload.array('media', 5), updateProduct);

router.delete('/delete-product/:id', deleteProduct);

module.exports = router;
