const express = require('express');
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../controller/category');
const router = express.Router();

router.post('/create-categories', createCategory);

router.get('/all-categories', getAllCategories);

router.get('/one-categories/:id', getCategoryById);

router.put('/update-categories/:id', updateCategory);

router.delete('/delete-categories/:id', deleteCategory);

module.exports = router;
