const router = require('express').Router();
const {payOrder, verifyPayment} = require('../controller/paymentController');

router.post('/payment/:id', payOrder)
router.get('/verify-payment', verifyPayment)

module.exports = router;