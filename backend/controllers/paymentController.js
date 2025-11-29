const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Business = require('../models/Business');
const Payment = require('../models/Payment');

// @desc    Create a Stripe payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
exports.createPaymentIntent = async (req, res, next) => {
  const { amount, currency } = req.body;

  try {
    const business = await Business.findOne({ owner: req.user.id });
    if (!business) {
      return res.status(404).json({ success: false, msg: 'Business not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { businessId: business._id.toString() },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// @desc    Handle successful payment
// @route   POST /api/payments/success
// @access  Private
exports.handlePaymentSuccess = async (req, res, next) => {
  const { paymentIntentId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const business = await Business.findById(paymentIntent.metadata.businessId);
    if (!business) {
      return res.status(404).json({ success: false, msg: 'Business not found' });
    }

    // Create a new payment record
    await Payment.create({
      user: business.owner,
      business: business._id,
      amount: paymentIntent.amount / 100, // convert from cents
      currency: paymentIntent.currency,
      status: 'succeeded',
      transactionId: paymentIntent.id,
      paymentMethod: 'stripe',
    });

    // Update the subscription status
    business.subscription.status = 'active';
    business.subscription.plan = 'premium'; // or whatever plan they paid for
    business.subscription.startDate = new Date();
    business.subscription.endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)); // 1 year subscription
    await business.save();

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};
