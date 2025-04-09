const { profileDetails } = require('../controller/kycController');

const kycRouter = require('express').Router();

kycRouter.patch('/profile/:id', profileDetails);
module.exports =kycRouter;