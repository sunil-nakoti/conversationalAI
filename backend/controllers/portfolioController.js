const { GoogleGenAI, Type } = require('@google/genai');
const Portfolio = require('../models/Portfolio');
const BrandingProfile = require('../models/BrandingProfile');
const PhoneNumber = require('../models/PhoneNumber');

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Mock data as models for these are not created in this step
const playbooks = [
    { id: 'pb_empathy', name: 'Empathy First - Hardship v2' },
    { id: 'pb_assertive', name: 'Direct Assertive Follow-up v4' },
    { id: 'pb_settlement', name: 'Settlement Offer - 50%' },
];

const aiAgents = [
    { id: 'zephyr', name: 'Zephyr', description: 'Warm, Empathetic' },
    { id: 'kore', name: 'Kore', description: 'Professional, Clear' },
    { id: 'puck', name: 'Puck', description: 'Calm, Reassuring' },
    { id: 'charon', name: 'Charon', description: 'Deep, Authoritative' },
];

// @desc    Get all portfolios
// @route   GET /api/portfolios
// @access  Private
exports.getPortfolios = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };
    const portfolios = await Portfolio.find(query);
    res.status(200).json({ success: true, data: portfolios });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

// @desc    Update a portfolio
// @route   PUT /api/portfolios/:id
// @access  Private
exports.updatePortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!portfolio) {
      return res.status(404).json({ success: false, msg: 'Portfolio not found' });
    }
    res.status(200).json({ success: true, data: portfolio });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

// @desc    Get data needed for the launch campaign component
// @route   GET /api/portfolios/launch-config
// @access  Private
exports.getLaunchConfig = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };
    const [brandingProfiles, phoneNumbers] = await Promise.all([
        BrandingProfile.find(query),
        PhoneNumber.find({ ...query, status: 'active' })
    ]);

    const data = {
        playbooks, // still mock
        phoneNumbers,
        aiAgents, // still mock
        brandingProfiles
    };
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

// @desc    Map CSV headers
// @route   POST /api/portfolios/map-headers
// @access  Private
exports.mapHeaders = async (req, res, next) => {
    const { headers, requiredFields } = req.body;
    if (!headers || !requiredFields) {
        return res.status(400).json({ success: false, msg: 'Headers and required fields are required.' });
    }
    try {
        const prompt = `
            You are an intelligent data mapping assistant for a debt collection platform.
            Your task is to map the given CSV headers to a predefined set of database fields.
            The matching should be flexible and intelligent, ignoring case, spacing, and common variations.

            Here are the required database fields:
            ${requiredFields.join(', ')}

            Here are the headers from the uploaded CSV file:
            ${headers.join(', ')}

            Analyze the CSV headers and map each one to the corresponding database field.
            If a CSV header does not match any database field, map it to 'null'.
            If multiple CSV headers could map to the same database field, choose the best fit.
            Return the mapping as a JSON object where the keys are the original CSV headers and the values are the corresponding database fields (or null).
        `;
    
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    description: "A JSON object mapping CSV headers to database fields.",
                    properties: headers.reduce((acc, header) => {
                        acc[header] = { 
                            type: Type.STRING,
                            description: `The corresponding database field for the header '${header}'. Should be one of [${requiredFields.join(', ')}] or null.`,
                        };
                        return acc;
                    }, {})
                }
            }
        });

        const jsonString = response.text.trim();
        const mapping = JSON.parse(jsonString);
        res.status(200).json({ success: true, data: mapping });
    } catch (error) {
        console.error("Error in mapHeaders:", error);
        res.status(500).json({ success: false, msg: 'Failed to map CSV headers.' });
    }
};
