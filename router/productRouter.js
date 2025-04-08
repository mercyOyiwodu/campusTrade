const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controller/product');
const upload = require('../utils/multer');
const router = require('express').Router();

router.post('/products/:categoryId/:sellerId', upload.array('media', 5), createProduct);

router.get('/products', getAllProducts);

router.get('/oneproduct/:id', getProductById);

router.put('/update-product/:id', upload.array('media', 5), updateProduct);

router.delete('/delete-product/:id', deleteProduct);

module.exports = router;
