const { initializePayment, verifyPayment } = require('../controller/transactionController');

const router = require('express').Router();

router.post('/initialize', initializePayment);
router.get('/verify', verifyPayment)

module.exports = router;