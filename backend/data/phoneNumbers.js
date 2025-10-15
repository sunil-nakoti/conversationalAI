const initialPhoneNumbers = [
    { 
        id: 'pn1', 
        number: '+1 (415) 555-0100', 
        status: 'active', 
        healthScore: 92, 
        callsLastHour: 12, 
        lastUsedTimestamp: Date.now() - 300000, 
        poolId: 'pool1',
        voicemailDetection: true,
        attestationStatus: 'verified'
    },
    { 
        id: 'pn2', 
        number: '+1 (415) 555-0101', 
        status: 'active', 
        healthScore: 85, 
        callsLastHour: 8, 
        lastUsedTimestamp: Date.now() - 600000, 
        poolId: 'pool1',
        voicemailDetection: false,
        attestationStatus: 'verified'
    },
    { 
        id: 'pn3', 
        number: '+1 (415) 555-0102', 
        status: 'cooldown', 
        healthScore: 45, 
        callsLastHour: 25, 
        lastUsedTimestamp: Date.now() - 3700000, 
        poolId: 'pool1',
        voicemailDetection: true,
        attestationStatus: 'failed'
    },
    { 
        id: 'pn4', 
        number: '+1 (512) 555-0103', 
        status: 'incubating', 
        healthScore: 100, 
        callsLastHour: 0, 
        lastUsedTimestamp: Date.now() - 86400000,
        incubationStart: Date.now() - 3600000 * 12, // 12 hours ago
        voicemailDetection: true,
        attestationStatus: 'pending'
    },
    { 
        id: 'pn5', 
        number: '+1 (212) 555-0104', 
        status: 'active', 
        healthScore: 98, 
        callsLastHour: 2, 
        lastUsedTimestamp: Date.now() - 1200000,
        voicemailDetection: true,
        attestationStatus: 'verified'
    }
];

module.exports = initialPhoneNumbers;
