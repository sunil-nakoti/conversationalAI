const { GoogleGenAI, Type } = require('@google/genai');
const AIAgent = require('../models/AIAgent');
const Mission = require('../models/Mission');

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


// @desc    Get all AI agents for a user
// @route   GET /api/agents
// @access  Private
exports.getAgents = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };
    const agents = await AIAgent.find(query);
    res.status(200).json({ success: true, data: agents });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

// @desc    Create a new AI agent
// @route   POST /api/agents
// @access  Private
exports.createAgent = async (req, res, next) => {
    try {
        const agentData = { ...req.body, user: req.user.id, id: `agent_${Date.now()}` };
        const agent = await AIAgent.create(agentData);
        res.status(201).json({ success: true, data: agent });
    } catch (err) {
        console.error('Error creating agent:', err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Update an AI agent
// @route   PUT /api/agents/:id
// @access  Private
exports.updateAgent = async (req, res, next) => {
    try {
        const agentId = req.params.id;
        let agent = await AIAgent.findOne({ id: agentId });

        if (!agent) {
            return res.status(404).json({ success: false, msg: 'Agent not found' });
        }

        if (agent.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, msg: 'Not authorized' });
        }

        // Ensure the unique 'id' field is not overwritten with null or a different value
        const updateData = { ...req.body };
        delete updateData.id; // Prevent changing the custom ID
        delete updateData._id; // Prevent attempting to change the immutable _id

        agent = await AIAgent.findOneAndUpdate({ id: agentId }, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: agent });
    } catch (err) {
        console.error('Error updating agent:', err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Delete an AI agent
// @route   DELETE /api/agents/:id
// @access  Private
exports.deleteAgent = async (req, res, next) => {
    try {
        const agentId = req.params.id;
        const agent = await AIAgent.findOne({ id: agentId });

        if (!agent) {
            return res.status(404).json({ success: false, msg: 'Agent not found' });
        }

        if (agent.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, msg: 'Not authorized' });
        }

        await agent.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error('Error deleting agent:', err);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Get all missions for a user
// @route   GET /api/agents/missions
// @access  Private
exports.getMissions = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };
    const missions = await Mission.find(query);
    res.status(200).json({ success: true, data: missions });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

// @desc    Suggest a new mission
// @route   POST /api/agents/suggest-mission
// @access  Private
exports.suggestMission = async (req, res, next) => {
    const { agents, missions } = req.body;
    if (!agents || !missions) {
        return res.status(400).json({ success: false, msg: 'Agent and mission data is required.' });
    }

    try {
        const prompt = `
            You are a Performance Analyst for an AI agent workforce in a call center.
            Your task is to analyze the current performance of the AI agents and the active missions to suggest a new, impactful mission.
            The goal is to create missions that either address a weakness, capitalize on a strength, or encourage a specific behavior to improve overall campaign effectiveness (A/B testing).

            Current Agent Performance Data:
            ${JSON.stringify(agents, null, 2)}

            Current Active Missions:
            ${JSON.stringify(missions, null, 2)}

            Analysis Instructions:
            1.  Review the agent performance data. Identify a key metric (like ptpRate, rpcRate, optInRate, complianceScore) where there's a significant opportunity for improvement OR a metric where agents are excelling that could be further incentivized.
            2.  Consider the existing missions. Avoid creating a mission that is too similar to an active one.
            3.  Based on your analysis, formulate a new mission. The mission should be specific, measurable, achievable, relevant, and time-bound (SMART).
            4.  Provide a creative and motivational mission title and a clear description.
            5.  Determine a logical goal type and a challenging but realistic goal value based on the agent data.

            Return your suggestion as a structured JSON object.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        goalType: { 
                            type: Type.STRING,
                            enum: ['Attempts Made', 'RPCs', 'Opt-Ins', 'PTPs', 'Payments Made', 'Opt-Outs'],
                        },
                        goal: { type: Type.NUMBER },
                    },
                    required: ["title", "description", "goalType", "goal"],
                }
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error in suggestMission:", error);
        res.status(500).json({ success: false, msg: 'Failed to generate mission suggestion.' });
    }
};

// @desc    Create or update a mission
// @route   POST /api/agents/missions, PUT /api/agents/missions/:id
// @access  Private
exports.saveMission = async (req, res, next) => {
    try {
        const missionData = { ...req.body, user: req.user.id };
        let mission;
        if (req.params.id) {
            mission = await Mission.findOneAndUpdate({ id: req.params.id, user: req.user.id }, missionData, { new: true, runValidators: true });
            if (!mission) return res.status(404).json({ success: false, msg: 'Mission not found' });
        } else {
            missionData.id = `mission_${Date.now()}`;
            missionData.progress = 0;
            mission = await Mission.create(missionData);
        }
        res.status(200).json({ success: true, data: mission });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

// @desc    Delete a mission
// @route   DELETE /api/agents/missions/:id
// @access  Private
exports.deleteMission = async (req, res, next) => {
    try {
        const mission = await Mission.findOne({ id: req.params.id, user: req.user.id });
        if (!mission) return res.status(404).json({ success: false, msg: 'Mission not found' });
        await mission.deleteOne(); // Mongoose 7+
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};
