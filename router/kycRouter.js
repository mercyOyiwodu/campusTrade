const express = require('express');
const { profileDetails } = require('../controller/kycController');
const { registerValidation } = require('../middlewares/validator');
const upload = require('../utils/multer');
const kycRouter = express.Router();


kycRouter.patch('/profile/:id', upload.single('profilePic'), registerValidation, profileDetails);



module.exports = kycRouter;