const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const User = require('./models/User');
const AIAgent = require('./models/AIAgent');
const Portfolio = require('./models/Portfolio');
const JurisdictionRule = require('./models/JurisdictionRule');
const BrandingProfile = require('./models/BrandingProfile');
const ProposedRuleUpdate = require('./models/ProposedRuleUpdate');
const Mission = require('./models/Mission');
const NegotiationModel = require('./models/NegotiationModel');
const PhoneNumber = require('./models/PhoneNumber');
const Payment = require('./models/Payment');
const ScheduledPayment = require('./models/ScheduledPayment');
const Notification = require('./models/Notification');
const Setting = require('./models/Setting');
const GoldenScript = require('./models/GoldenScript');
const Objection = require('./models/Objection');
const SmsTemplate = require('./models/SmsTemplate');
const CallReport = require('./models/CallReport');


// Load data
const users = require('./data/users');
const initialAgents = require('./data/agents');
const initialPortfolios = require('./data/portfolios');
const jurisdictionRules = require('./data/jurisdictionRules');
const initialBrandingProfiles = require('./data/brandingProfiles');
const initialMissions = require('./data/missions');
const initialNegotiationModels = require('./data/negotiationModels');
const initialPhoneNumbers = require('./data/phoneNumbers');
const initialPayments = require('./data/payments');
const initialScheduledPayments = require('./data/scheduledPayments');
const initialNotifications = require('./data/notifications');
const initialGoldenScripts = require('./data/goldenScripts');
const initialObjections = require('./data/objections');
const initialSmsTemplates = require('./data/smsTemplates');
const initialCallReports = require('./data/callReports');


// Connect to DB
connectDB();

const clearData = async () => {
    await User.deleteMany();
    await AIAgent.deleteMany();
    await Portfolio.deleteMany();
    await JurisdictionRule.deleteMany();
    await BrandingProfile.deleteMany();
    await ProposedRuleUpdate.deleteMany();
    await Mission.deleteMany();
    await NegotiationModel.deleteMany();
    await PhoneNumber.deleteMany();
    await Payment.deleteMany();
    await ScheduledPayment.deleteMany();
    await Notification.deleteMany();
    await Setting.deleteMany();
    await GoldenScript.deleteMany();
    await Objection.deleteMany();
    await SmsTemplate.deleteMany();
    await CallReport.deleteMany();
};

// Import into DB
const importData = async () => {
  try {
    await clearData();

    const createdUsers = await User.create(users);
    const adminUser = createdUsers.find(u => u.role === 'admin');
    const regularUser = createdUsers.find(u => u.role === 'user');

    if (!adminUser) {
        console.error('Admin user not found in data file!');
        process.exit(1);
    }
    
    const userId = adminUser._id;

    const userSpecificData = [
        { model: AIAgent, data: initialAgents },
        { model: Portfolio, data: initialPortfolios },
        { model: BrandingProfile, data: initialBrandingProfiles },
        { model: Mission, data: initialMissions },
        { model: NegotiationModel, data: initialNegotiationModels },
        { model: PhoneNumber, data: initialPhoneNumbers },
        { model: Payment, data: initialPayments },
        { model: ScheduledPayment, data: initialScheduledPayments },
        { model: Notification, data: initialNotifications },
        { model: GoldenScript, data: initialGoldenScripts },
        { model: Objection, data: initialObjections },
        { model: SmsTemplate, data: initialSmsTemplates },
        { model: CallReport, data: initialCallReports },
    ];

    for (const item of userSpecificData) {
        const dataWithUser = item.data.map(d => ({ ...d, user: userId }));
        await item.model.create(dataWithUser);
    }

    // Global data
    await JurisdictionRule.create(jurisdictionRules);
    
    // User settings
    await Setting.create({ user: userId });
    await Setting.create({ user: regularUser._id });


    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const destroyData = async () => {
  try {
    await clearData();
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  destroyData();
} else {
    console.log('Please use the -i flag to import data or -d to destroy data');
    process.exit();
}
