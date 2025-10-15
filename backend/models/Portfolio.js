const mongoose = require('mongoose');

const DebtorSchema = new mongoose.Schema({
    id: String,
    fullname: String,
    accountnumber: String,
    originalcreditor: String,
    currentbalance: Number,
    status: String,
    phone1: String, phone2: String, phone3: String, phone4: String, phone5: String, phone6: String, phone7: String, phone8: String, phone9: String, phone10: String,
    email: String,
    address: String, city: String, state: String, zip: String,
    callHistory: [mongoose.Schema.Types.Mixed],
    propensityScore: Number,
    contactOutlook: {
        heatmap: [[Number]],
        optimalChannel: String,
    },
});

const PortfolioSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    name: String,
    debtors: [DebtorSchema],
    numberOfAccounts: Number,
    averageBalance: Number,
    contactAttempts: Number,
    settlementFee: Number,
    status: String,
    averagePropensityScore: Number,
    settlementOfferPercentage: Number,
    brandingProfileId: String,
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
