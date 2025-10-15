const { GoogleGenAI, Type } = require('@google/genai');
const JurisdictionRule = require('../models/JurisdictionRule');
const BrandingProfile = require('../models/BrandingProfile');
const ProposedRuleUpdate = require('../models/ProposedRuleUpdate');
const PhoneNumber = require('../models/PhoneNumber');

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Simulates a Google search for a phone number to gather reputation data.
 */
const getMockSearchResults = (phoneNumber) => {
    const mockResults = [
        { title: `Who Called Me from ${phoneNumber}? - Caller ID`, snippet: `Reports for ${phoneNumber}. Some users report this as a marketing call, others as a potential scam. Exercise caution.` },
        { title: `${phoneNumber} Reverse Lookup`, snippet: `Find out who owns the phone number ${phoneNumber}. Associated with multiple spam reports in the last 30 days.` },
        { title: `Legitimate Business Call from ${phoneNumber}`, snippet: `This number is listed on the official contact page for 'Springfield Flowers Delivery Service'.` },
        { title: `FTC Complaints for ${phoneNumber}`, snippet: `Several complaints have been filed against callers from ${phoneNumber} regarding aggressive tactics and potential FDCPA violations.` },
        { title: `Is ${phoneNumber} a scam? - Reddit`, snippet: `A Reddit thread where users discuss unsolicited calls from this number. Opinions are mixed, but some mention a debt collection scam.` },
    ];
    return mockResults.map(r => `Title: ${r.title}\nSnippet: ${r.snippet}`).join('\n\n---\n\n');
};

async function researchComplianceUpdateInternal(jurisdiction) {
    console.log(`Researching compliance updates for ${jurisdiction.state}...`);
    // Step 1: Use Google Search
    const searchResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Recent changes to debt collection laws in ${jurisdiction.state} regarding call frequency, calling times, or required disclosures. Focus on official government or legal publications from the last 12 months.`,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const groundingChunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (!groundingChunks || groundingChunks.length === 0) {
        console.log(`No relevant search results found for ${jurisdiction.state}.`);
        return null;
    }

    const searchSnippets = groundingChunks.map((chunk) => `Source: ${chunk.web.title} (${chunk.web.uri})\nContent: ${chunk.web.snippet}`).join('\n\n---\n\n');
    const primarySource = groundingChunks[0].web;

    // Step 2: Analyze
    const analysisPrompt = `
        You are an expert compliance analyst specializing in US debt collection regulations. Your task is to analyze web search results and determine if they indicate a change to a specific state's laws compared to the current rules stored in our system.

        Current Rule for ${jurisdiction.state}:
        - Max Calls: ${jurisdiction.callFrequencyLimit}
        - Time Period (Days): ${jurisdiction.callFrequencyDays}
        - Allowed Calling Start Time: ${jurisdiction.timeOfDayStart}
        - Allowed Calling End Time: ${jurisdiction.timeOfDayEnd}
        
        Web Search Snippets (most relevant first):
        ---
        ${searchSnippets}
        ---
        
        Instructions:
        1.  Carefully read the provided snippets.
        2.  Compare the information in the snippets to the "Current Rule".
        3.  Identify any specific, quantifiable changes to call frequency limits, time periods, or allowed calling hours.
        4.  If a change is identified, formulate a concise reasoning statement explaining the change and referencing the source.
        5.  Assess your confidence in this change on a scale of 0.0 to 1.0. High confidence (>=0.9) should be reserved for official legislative or legal analysis sites. Lower confidence for news articles or forum discussions.
        6.  If no specific, quantifiable change is found, set "proposed_changes" to null.
        7.  Return your findings as a JSON object matching the provided schema. Do not include fields in 'proposed_changes' if they have not changed.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: analysisPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    proposed_changes: { type: Type.OBJECT, nullable: true, properties: { callFrequencyLimit: { type: Type.NUMBER, nullable: true }, callFrequencyDays: { type: Type.NUMBER, nullable: true }, timeOfDayStart: { type: Type.STRING, nullable: true }, timeOfDayEnd: { type: Type.STRING, nullable: true } } },
                    reasoning: { type: Type.STRING },
                    confidence: { type: Type.NUMBER }
                },
                required: ["proposed_changes", "reasoning", "confidence"]
            }
        }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (!result.proposed_changes || Object.keys(result.proposed_changes).length === 0) {
        console.log(`No actionable changes found for ${jurisdiction.state}.`);
        return null;
    }
    
    const cleanedChanges = Object.entries(result.proposed_changes).reduce((acc, [key, value]) => {
        if (value !== null) acc[key] = value;
        return acc;
    }, {});
    
    if (Object.keys(cleanedChanges).length === 0) return null;

    const { id, state, isActive, __v, ...currentRule } = jurisdiction.toObject();

    return {
        id: `prop_${jurisdiction.state}_${Date.now()}`,
        jurisdictionCode: jurisdiction.state,
        currentRule,
        proposedChanges: cleanedChanges,
        reasoning: result.reasoning,
        sourceUrl: primarySource.uri,
        sourceTitle: primarySource.title,
        confidence: result.confidence,
        status: 'pending'
    };
}


// @desc    Get all compliance data
// @route   GET /api/compliance
// @access  Private
exports.getComplianceData = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };
    
    const [jurisdictionRules, brandingProfiles, phonePool] = await Promise.all([
        JurisdictionRule.find({}), // Rules are global
        BrandingProfile.find(query),
        PhoneNumber.find(query)
    ]);
    
    // In a real app, numberPools, emergingRisks, etc. would come from their own models
    const mockData = {
        numberPools: [{id: 'pool1', name: 'Primary Pool', brandingProfileId: brandingProfiles[0]?.id}],
        emergingRisks: [
            {
                id: 'er1',
                title: 'Mentions of "Student Loan Forgiveness"',
                detectedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                summary: 'An increasing number of debtors are mentioning federal student loan forgiveness programs as a reason for not paying other consumer debts. This suggests a potential misunderstanding of how these programs work.',
                keywords: ['student loan', 'forgiveness', 'Biden', 'erased'],
            },
            {
                id: 'er2',
                title: 'Disputes based on "Credit Repair" company advice',
                detectedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                summary: 'Debtors are citing advice from third-party credit repair companies to dispute valid debts. Agents should be prepared to explain the debt validation process clearly.',
                keywords: ['credit repair', 'disputing this', 'told me not to pay', '609 letter'],
            }
        ],
        scrubLog: [],
        conversationalAudit: [
            {
                id: 'ca1',
                callId: 'call_abc_123',
                debtorName: 'Michael Chen',
                agentName: 'Zephyr',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                riskType: 'Emotional Escalation',
                riskScore: 88,
                summary: 'Agent Zephyr continued to press for payment after the debtor mentioned a recent death in the family. The debtor became audibly upset, and their sentiment dropped sharply. This could be perceived as harassment.',
                flaggedTranscriptSnippet: 'Debtor: "...my mother just passed away last week." Agent: "I understand, but we still need to resolve this balance of $850."',
                sentimentTrend: [0.7, 0.6, 0.2, 0.1],
            },
            {
                id: 'ca2',
                callId: 'call_def_456',
                debtorName: 'Sarah Johnson',
                agentName: 'Kore',
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                riskType: 'Pressure Tactics',
                riskScore: 75,
                summary: 'Agent Kore used language implying that immediate payment was the only way to avoid negative consequences, which could be interpreted as a pressure tactic. The agent mentioned "We need to solve this today."',
                flaggedTranscriptSnippet: 'Agent: "If you can\'t make a payment today, we won\'t be able to offer this settlement again."',
                sentimentTrend: [0.5, 0.4, 0.3, 0.3],
            },
            {
                id: 'ca3',
                callId: 'call_ghi_789',
                debtorName: 'David Miller',
                agentName: 'Zephyr',
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                riskType: 'Potential Confusion',
                riskScore: 62,
                summary: 'The agent explained the payment plan options, but the debtor repeatedly expressed confusion about the total amount and due dates. The agent did not adequately clarify, leading to potential misunderstanding of the terms.',
                flaggedTranscriptSnippet: 'Debtor: "So is it $50 now and then... wait, I thought you said the total was $300?"',
                sentimentTrend: [0.6, 0.5, 0.4, 0.5],
            }
        ],
    };

    res.status(200).json({
      success: true,
      data: {
        jurisdictionRules,
        phonePool,
        brandingProfiles,
        ...mockData
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

// @desc    Get all branding profiles
// @route   GET /api/compliance/branding-profiles
// @access  Private
exports.getBrandingProfiles = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };
    const brandingProfiles = await BrandingProfile.find(query);
    res.status(200).json({ success: true, data: brandingProfiles });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

// @desc    Check phone number reputation
// @route   POST /api/compliance/check-reputation
// @access  Private
exports.checkReputation = async (req, res, next) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        return res.status(400).json({ success: false, msg: 'Phone number is required.' });
    }
    
    try {
        const searchSnippets = getMockSearchResults(phoneNumber);
        const prompt = `
            You are a highly skilled Risk Analyst specializing in telephony and web reputation for a compliance department.
            Your task is to analyze web search snippets related to a specific phone number and determine its risk level for being associated with spam, scams, or negative reputation.

            Phone Number Under Investigation: ${phoneNumber}

            Web Search Snippets:
            ---
            ${searchSnippets}
            ---

            Based *only* on the provided snippets, perform the following actions:
            1.  Assess the risk level associated with the phone number. The risk must be one of three categories: "High", "Medium", or "Safe".
            2.  Provide a concise, 1-2 sentence natural language summary explaining your reasoning for the assigned risk level. This summary should be clear and directly reference the information in the snippets.

            Return your analysis in a structured JSON format.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    description: "A JSON object containing the risk analysis of a phone number.",
                    properties: {
                        risk_level: { type: Type.STRING, enum: ["High", "Medium", "Safe"] },
                        summary_insight: { type: Type.STRING }
                    },
                    required: ["risk_level", "summary_insight"],
                }
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error in checkReputation:", error);
        res.status(500).json({ success: false, msg: 'Failed to analyze phone number reputation.' });
    }
};

// @desc    Research compliance updates for a jurisdiction
// @route   POST /api/compliance/research-updates
// @access  Private
exports.researchUpdates = async (req, res, next) => {
    const { jurisdiction } = req.body;
    if (!jurisdiction) {
        return res.status(400).json({ success: false, msg: 'Jurisdiction is required.' });
    }

    try {
        const ruleFromDb = await JurisdictionRule.findOne({ state: jurisdiction.state });
        if (!ruleFromDb) {
            return res.status(404).json({ success: false, msg: 'Jurisdiction rule not found.' });
        }

        const proposal = await researchComplianceUpdateInternal(ruleFromDb);
        if (proposal) {
            const existing = await ProposedRuleUpdate.findOne({ jurisdictionCode: proposal.jurisdictionCode, status: 'pending' });
            if (!existing) {
                await ProposedRuleUpdate.create(proposal);
            }
        }
        res.status(200).json({ success: true, data: proposal });
    } catch (error) {
        console.error(`Error in researchUpdates for ${jurisdiction.state}:`, error);
        res.status(500).json({ success: false, msg: `Failed to analyze compliance data for ${jurisdiction.state}.` });
    }
};
