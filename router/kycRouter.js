const express = require('express');
const { profileDetails } = require('../controller/kycController');

const kycRouter = express.Router();


kycRouter.patch('/profile/:id', profileDetails);

module.exports = kycRouter;
