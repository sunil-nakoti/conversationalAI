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

// Load data
const users = require('./data/users');
const agents = require('./data/agents');
const portfolios = require('./data/portfolios');
const jurisdictionRules = require('./data/jurisdictionRules');
const brandingProfiles = require('./data/brandingProfiles');

// Connect to DB
connectDB();

// Import into DB
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await AIAgent.deleteMany();
    await Portfolio.deleteMany();
    await JurisdictionRule.deleteMany();
    await BrandingProfile.deleteMany();

    // Insert new data
    await User.create(users);
    await AIAgent.create(agents);
    await Portfolio.create(portfolios);
    await JurisdictionRule.create(jurisdictionRules);
    await BrandingProfile.create(brandingProfiles);
    
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
    await User.deleteMany();
    await AIAgent.deleteMany();
    await Portfolio.deleteMany();
    await JurisdictionRule.deleteMany();
    await BrandingProfile.deleteMany();

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
