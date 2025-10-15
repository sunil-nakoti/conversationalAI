
import { GoogleGenAI, Type } from "@google/genai";
// FIX: Corrected import path for types.ts
import { CsvHeaderMapping, ReputationCheckResult, AIAgentProfile, Mission, MissionGoalType, JurisdictionRule, ProposedRuleUpdate } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

/**
 * Simulates a Google search for a phone number to gather reputation data.
 * In a real application, this would be a call to an actual search API.
 * @param phoneNumber The phone number to search for.
 * @returns A string of concatenated search result snippets.
 */
const getMockSearchResults = (phoneNumber: string): string => {
    // These results are designed to test the AI's analytical ability.
    const mockResults = [
        { title: `Who Called Me from ${phoneNumber}? - Caller ID`, snippet: `Reports for ${phoneNumber}. Some users report this as a marketing call, others as a potential scam. Exercise caution.` },
        { title: `${phoneNumber} Reverse Lookup`, snippet: `Find out who owns the phone number ${phoneNumber}. Associated with multiple spam reports in the last 30 days.` },
        { title: `Legitimate Business Call from ${phoneNumber}`, snippet: `This number is listed on the official contact page for 'Springfield Flowers Delivery Service'.` },
        { title: `FTC Complaints for ${phoneNumber}`, snippet: `Several complaints have been filed against callers from ${phoneNumber} regarding aggressive tactics and potential FDCPA violations.` },
        { title: `Is ${phoneNumber} a scam? - Reddit`, snippet: `A Reddit thread where users discuss unsolicited calls from this number. Opinions are mixed, but some mention a debt collection scam.` },
    ];

    return mockResults.map(r => `Title: ${r.title}\nSnippet: ${r.snippet}`).join('\n\n---\n\n');
};


export const checkPhoneNumberReputation = async (phoneNumber: string): Promise<ReputationCheckResult> => {
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

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    description: "A JSON object containing the risk analysis of a phone number.",
                    properties: {
                        risk_level: {
                            type: Type.STRING,
                            description: "The assessed risk level.",
                            // FIX: Corrected enum definition to use 'enum' property instead of a separate array.
                            enum: ["High", "Medium", "Safe"],
                        },
                        summary_insight: {
                            type: Type.STRING,
                            description: "A concise summary of the reasoning for the risk assessment.",
                        }
                    },
                    required: ["risk_level", "summary_insight"],
                }
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result as ReputationCheckResult;
    } catch (error) {
        console.error("Error checking phone number reputation with Gemini API:", error);
        throw new Error("Failed to analyze phone number reputation. The AI model may be temporarily unavailable.");
    }
};


export const mapCsvHeaders = async (headers: string[], requiredFields: string[]): Promise<CsvHeaderMapping> => {
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
    
    try {
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
                    }, {} as any)
                }
            }
        });

        const jsonString = response.text.trim();
        const mapping = JSON.parse(jsonString);
        return mapping as CsvHeaderMapping;
    } catch (error) {
        console.error("Error mapping CSV headers with Gemini API:", error);
        throw new Error("Failed to map CSV headers. Please check the file and try again.");
    }
};

export const suggestMission = async (agents: AIAgentProfile[], missions: Mission[]): Promise<Partial<Mission>> => {
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

    try {
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
        return result as Partial<Mission>;
    } catch (error) {
        console.error("Error suggesting mission with Gemini API:", error);
        throw new Error("Failed to generate a mission suggestion. The AI model may be temporarily unavailable.");
    }
};

export const researchComplianceUpdates = async (jurisdiction: JurisdictionRule): Promise<ProposedRuleUpdate | null> => {
    console.log(`Researching compliance updates for ${jurisdiction.state}...`);
    // Step 1: Use Google Search to find relevant, recent information.
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

    const searchSnippets = groundingChunks.map((chunk: any) => `Source: ${chunk.web.title} (${chunk.web.uri})\nContent: ${chunk.web.snippet}`).join('\n\n---\n\n');
    const primarySource = groundingChunks[0].web;

    // Step 2: Analyze the search results against the current rule.
    const analysisPrompt = `
        You are an expert compliance analyst for a debt collection agency. Your task is to analyze legal and regulatory updates from web searches and determine if they require a change to our current, specific jurisdiction rule.

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
        1.  Carefully read the search snippets.
        2.  Compare the information to the "Current Rule" for ${jurisdiction.state}.
        3.  If a snippet describes a new, more restrictive regulation (e.g., fewer calls allowed, shorter calling window), identify the specific change.
        4.  If no change is needed, return 'null' for the 'proposed_changes' field.
        5.  Generate a concise, 1-2 sentence reason for the proposed change, citing the key information found.
        6.  Provide a confidence score from 0.0 to 1.0 on how certain you are that this is a valid, actionable change based on the provided text. A score of 0.95 or higher should be reserved for text that explicitly states a new law or regulation with specific numbers.

        Return your analysis in a structured JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: analysisPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        proposed_changes: {
                            type: Type.OBJECT,
                            nullable: true,
                            properties: {
                                callFrequencyLimit: { type: Type.NUMBER, nullable: true },
                                callFrequencyDays: { type: Type.NUMBER, nullable: true },
                                timeOfDayStart: { type: Type.STRING, nullable: true },
                                timeOfDayEnd: { type: Type.STRING, nullable: true },
                            }
                        },
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

        // Clean up any nulls from the proposed changes
        const cleanedChanges = Object.entries(result.proposed_changes).reduce((acc, [key, value]) => {
            if (value !== null) {
                // FIX: Correctly type the accumulator assignment to avoid 'never' type error.
                (acc as any)[key] = value;
            }
            return acc;
        }, {} as Partial<Omit<JurisdictionRule, 'id' | 'state' | 'isActive'>>);
        
        if (Object.keys(cleanedChanges).length === 0) {
             console.log(`No actionable changes found for ${jurisdiction.state} after cleanup.`);
             return null;
        }

        const { id, state, isActive, ...currentRule } = jurisdiction;

        const proposal: ProposedRuleUpdate = {
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

        console.log(`Generated a proposed update for ${jurisdiction.state}:`, proposal);
        return proposal;

    } catch (error) {
        console.error(`Error analyzing compliance data for ${jurisdiction.state}:`, error);
        throw new Error(`Failed to analyze compliance data for ${jurisdiction.state}.`);
    }
};