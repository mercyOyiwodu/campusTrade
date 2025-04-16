const express = require('express');
const { createSubCategory, getAllSubCategories, getSubCategoryById, deleteSubCategory, updateSubCategory } = require('../controller/subCategory');
const router = express.Router()
/**
 * @swagger
 * tags:
 *   name: SubCategory
 *   description: Endpoints for managing subcategories
 */

/**
 * @swagger
 * /api/v1/create-subcategory:
 *   post:
 *     summary: Create a new subcategory
 *     tags: [SubCategory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 *       400:
 *         description: Subcategory or category already exists
 *       500:
 *         description: Internal server error
 */
router.get('create-subcategory',createSubCategory)
/**
 * @swagger
 * /api/v1/all-subcategory:
 *   get:
 *     summary: Get all subcategories
 *     tags: [SubCategory]
 *     responses:
 *       200:
 *         description: List of all subcategories
 *       500:
 *         description: Internal server error
 */

router.get('/all-subcategory', getAllSubCategories);
/**
 * @swagger
 * /api/v1/one-subcategory/{id}:
 *   get:
 *     summary: Get a subcategory by ID
 *     tags: [SubCategory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Subcategory ID
 *     responses:
 *       200:
 *         description: Subcategory fetched successfully
 *       404:
 *         description: Subcategory not found
 *       500:
 *         description: Internal server error
 */

router.get('/one-subcategory/:id', getSubCategoryById);
/**
 * @swagger
 * /api/v1/update-subcategory/{id}:
 *   put:
 *     summary: Update a subcategory by ID
 *     tags: [SubCategory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Subcategory ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 *       400:
 *         description: Category not found
 *       404:
 *         description: Subcategory not found
 *       500:
 *         description: Internal server error
 */

router.put('/update-subcategory/:id', updateSubCategory);
/**
 * @swagger
 * /api/v1/delete-subcategory/{id}:
 *   delete:
 *     summary: Delete a subcategory by ID
 *     tags: [SubCategory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Subcategory ID
 *     responses:
 *       200:
 *         description: Subcategory deleted successfully
 *       404:
 *         description: Subcategory not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete-subcategory/:id', deleteSubCategory);


module.exports = router
