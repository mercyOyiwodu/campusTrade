const { createBuyers } = require('../controller/buyerController');

const router = require('express').Router();

router.post('/buyer', createBuyers);

module.exports = router;