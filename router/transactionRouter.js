const router = require('express').Router();
const  { initializePayment, verifyPayment } = require('../controller/transactionController');

router.post('/initialize', initializePayment);
router.get('/verify', verifyPayment);

module.exports = router;
