const express = require('express');
const router = express.Router();
const { createPaymentIntent, handlePaymentSuccess } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/create-payment-intent').post(protect, createPaymentIntent);
router.route('/success').post(protect, handlePaymentSuccess);

module.exports = router;
