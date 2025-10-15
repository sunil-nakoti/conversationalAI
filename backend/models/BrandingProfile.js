const mongoose = require('mongoose');

const NotificationIntegrationSchema = new mongoose.Schema({
    id: String,
    platform: String,
    webhookUrl: String,
    events: [String],
}, { _id: false });

const BrandingProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id: { type: String, unique: true, required: true },
    companyName: String,
    logoUrl: String,
    brandColor: String,
    phoneNumber: String,
    emailAddress: String,
    websiteUrl: String,
    streetAddress: String,
    city: String,
    state: String,
    zipCode: String,
    paymentPortalIsEnabled: Boolean,
    acceptCreditCard: Boolean,
    acceptAch: Boolean,
    convenienceFeeType: String,
    convenienceFeeValue: Number,
    twilioSid: String,
    twilioAuthToken: String,
    paymentGatewayApiKey: String,
    paymentGatewaySecretKey: String,
    clientApiKey: String,
    rateLimit: Number,
    webhookUrl: String,
    webhookEvents: [String],
    notificationIntegrations: [NotificationIntegrationSchema],
});

module.exports = mongoose.model('BrandingProfile', BrandingProfileSchema);
