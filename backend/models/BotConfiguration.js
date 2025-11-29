const mongoose = require('mongoose');

const BotConfigurationSchema = new mongoose.Schema({
  personaName: {
    type: String,
    required: [true, 'Please provide a name for your receptionist persona'],
    default: 'Riya',
  },
  systemInstruction: {
    type: String,
    required: [true, 'Please provide a system instruction for the bot'],
    default: `You are Riya, the smart receptionist for City Gym. Your goal is to get the user to book a Free Trial Session.
- Keep answers SHORT (under 40 words).
- Be polite and enthusiastic.
- If asked for price: ₹1500/month.
- If asked for timings: 6 AM to 10 PM.
- If they agree to a trial, ask for a time to visit.`,
  },
  welcomeMessage: {
    type: String,
    default: 'Hello! How can I help you today?',
  },
  geminiApiKey: {
    type: String,
    select: false, // Do not return the API key by default
  },
});

module.exports = BotConfigurationSchema;
