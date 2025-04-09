const express = require('express');
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../controller/category');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Endpoints related to category operations
 */

/**
 * @swagger
 * paths:
 *   /api/v1/create-categories:
 *     post:
 *       summary: Create a new category
 *       description: Creates a new category with an optional parent category.
 *       tags:
 *         - Category
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Electronics"
 *                 parentCategoryId:
 *                   type: string
 *                   format: uuid
 *                   example: null
 *       responses:
 *         "201":
 *           description: Category created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Category created successfully"
 *                   data:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "60d0fe4f5311236168a109ca"
 *                       name:
 *                         type: string
 *                         example: "Electronics"
 *                       parentCategoryId:
 *                         type: string
 *                         format: uuid
 *                         example: null
 *         "400":
 *           description: Category already exists
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Category already exists"
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Internal Server Error"
 */

/**
 * @swagger
 * paths:
 *   /api/v1/all-categories:
 *     get:
 *       summary: Get all categories
 *       description: Retrieves all top-level categories and their subcategories.
 *       tags:
 *         - Category
 *       responses:
 *         "200":
 *           description: Categories retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Categories retrieved successfully"
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: "60d0fe4f5311236168a109ca"
 *                         name:
 *                           type: string
 *                           example: "Electronics"
 *                         subCategories:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 format: uuid
 *                                 example: "60d0fe4f5311236168a109cb"
 *                               name:
 *                                 type: string
 *                                 example: "Mobile Phones"
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Internal Server Error"
 */

/**
 * @swagger
 * paths:
 *   /api/v1/one-categories/{id}:
 *     get:
 *       summary: Get a category by ID
 *       description: Retrieves a category by its ID along with its subcategories.
 *       tags:
 *         - Category
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *           description: ID of the category to retrieve
 *           example: "60d0fe4f5311236168a109ca"
 *       responses:
 *         "200":
 *           description: Category retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Category retrieved successfully"
 *                   data:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "60d0fe4f5311236168a109ca"
 *                       name:
 *                         type: string
 *                         example: "Electronics"
 *                       subCategories:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                               example: "60d0fe4f5311236168a109cb"
 *                             name:
 *                               type: string
 *                               example: "Mobile Phones"
 *         "404":
 *           description: Category not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Category not found"
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Internal Server Error"
 */

/**
 * @swagger
 * paths:
 *   /api/v1/update-categories/{id}:
 *     put:
 *       summary: Update a category
 *       description: Updates an existing category's details, including its name and parent category.
 *       tags:
 *         - Category
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *           description: ID of the category to update
 *           example: "60d0fe4f5311236168a109ca"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Electronics"
 *                 parentCategoryId:
 *                   type: string
 *                   format: uuid
 *                   example: null
 *       responses:
 *         "200":
 *           description: Category updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Category updated successfully"
 *                   data:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "60d0fe4f5311236168a109ca"
 *                       name:
 *                         type: string
 *                         example: "Electronics"
 *                       parentCategoryId:
 *                         type: string
 *                         format: uuid
 *                         example: null
 *         "404":
 *           description: Category not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Category not found"
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Internal Server Error"
 */

/**
 * @swagger
 * paths:
 *   /api/v1/delete-categories/{id}:
 *     delete:
 *       summary: Delete a category
 *       description: Deletes a category by its ID, including its subcategories.
 *       tags:
 *         - Category
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *           description: ID of the category to delete
 *           example: "60d0fe4f5311236168a109ca"
 *       responses:
 *         "200":
 *           description: Category deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Category deleted successfully"
 *         "404":
 *           description: Category not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Category not found"
 *         "500":
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Internal Server Error"
 */


router.post('/create-categories', createCategory);

router.get('/all-categories', getAllCategories);

router.get('/one-categories/:id', getCategoryById);

router.put('/update-categories/:id', updateCategory);

router.delete('/delete-categories/:id', deleteCategory);

module.exports = router;
