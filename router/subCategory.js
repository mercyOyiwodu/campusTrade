const express = require('express');
const { createSubCategory, getAllSubCategories, getSubCategoryById, deleteSubCategory, updateSubCategory } = require('../controller/subCategory');
const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: SubCategory
 *   description: Subcategory management
 */

/**
 * @swagger
 * /create-subcategory:
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
 *                 example: Sneakers
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 *       400:
 *         description: Subcategory already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /all-subcategory:
 *   get:
 *     summary: Get all subcategories
 *     tags: [SubCategory]
 *     responses:
 *       200:
 *         description: List of all subcategories
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /one-subcategory/{id}:
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
 *         description: Server error
 */

/**
 * @swagger
 * /update-subcategory/{id}:
 *   put:
 *     summary: Update a subcategory
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
 *                 example: Heels
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 *       404:
 *         description: Subcategory not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /delete-subcategory/{id}:
 *   delete:
 *     summary: Delete a subcategory
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
 *         description: Subcategory (and its children) deleted successfully
 *       404:
 *         description: Subcategory not found
 *       500:
 *         description: Server error
 */

router.post('/create-subcategory', createSubCategory);
router.get('/all-subcategory', getAllSubCategories);
router.get('/one-subcategory/:id', getSubCategoryById);
router.put('/update-subcategory/:id', updateSubCategory);
router.delete('/delete-subcategory/:id', deleteSubCategory);


module.exports = router
