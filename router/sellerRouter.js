const { createSellers } = require('../controller/sellerController');
const upload = require('../utils/multer');

const router = require('express').Router();

router.post('/seller', upload.single('profilePic'), createSellers);

module.exports = router;