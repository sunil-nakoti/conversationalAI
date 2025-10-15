// FIX: Corrected import path for types.ts
import { VoiceLibraryEntry, VoiceStatus } from '../types';

// Mock database table for VoiceLibrary
let mockVoiceLibrary: VoiceLibraryEntry[] = [
    {
        id: 'voice1',
        voiceName: 'Matthew - US Standard',
        voiceProvider: 'Google TTS',
        voiceId: 'en-US-Wavenet-D',
        languageTag: 'en-US',
        accent: 'Standard',
        status: 'active',
    },
    {
        id: 'voice2',
        voiceName: 'Olivia - US Southern',
        voiceProvider: 'Google TTS',
        voiceId: 'en-US-Wavenet-F',
        languageTag: 'en-US',
        accent: 'Southern',
        status: 'active',
    },
    {
        id: 'voice3',
        voiceName: 'Penelope - UK Standard',
        voiceProvider: 'Google TTS',
        voiceId: 'en-GB-Wavenet-A',
        languageTag: 'en-GB',
        accent: 'British',
        status: 'inactive',
    },
    {
        id: 'voice4',
        voiceName: 'Santiago - US Spanish',
        voiceProvider: 'Google TTS',
        voiceId: 'es-US-Wavenet-A',
        languageTag: 'es-US',
        accent: 'Standard',
        status: 'active',
    },
];

// --- Mock Service Functions ---

/**
 * Simulates fetching the entire voice library from the database.
 */
export const fetchVoiceLibrary = (): Promise<VoiceLibraryEntry[]> => {
    console.log("Mock Service: Fetching voice library...");
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(mockVoiceLibrary))); // Deep copy to prevent direct state mutation
        }, 800);
    });
};

/**
 * Simulates saving a new voice entry or updating an existing one.
 */
export const saveVoiceEntry = (voiceData: Omit<VoiceLibraryEntry, 'id' | 'status'> & { id?: string }): Promise<VoiceLibraryEntry> => {
    console.log("Mock Service: Saving voice entry...", voiceData);
    return new Promise(resolve => {
        setTimeout(() => {
            if (voiceData.id) {
                // Update existing
                let updatedEntry: VoiceLibraryEntry | undefined;
                mockVoiceLibrary = mockVoiceLibrary.map(v => {
                    if (v.id === voiceData.id) {
                        updatedEntry = { ...v, ...voiceData };
                        return updatedEntry;
                    }
                    return v;
                });
                resolve(updatedEntry!);
            } else {
                // Create new
                const newEntry: VoiceLibraryEntry = {
                    ...voiceData,
                    id: `voice_${Date.now()}`,
                    status: 'active', // Default to active
                };
                mockVoiceLibrary.push(newEntry);
                resolve(newEntry);
            }
        }, 500);
    });
};

/**
 * Simulates updating the status of a voice entry.
 */
export const updateVoiceStatus = (voiceId: string, status: VoiceStatus): Promise<VoiceLibraryEntry> => {
    console.log(`Mock Service: Updating status for ${voiceId} to ${status}`);
     return new Promise(resolve => {
        setTimeout(() => {
            let updatedEntry: VoiceLibraryEntry | undefined;
            mockVoiceLibrary = mockVoiceLibrary.map(v => {
                if (v.id === voiceId) {
                    updatedEntry = { ...v, status };
                    return updatedEntry;
                }
                return v;
            });
            resolve(updatedEntry!);
        }, 300);
    });
};

/**
 * Simulates deleting a voice entry from the database.
 */
export const deleteVoiceEntry = (voiceId: string): Promise<{ success: true }> => {
    console.log(`Mock Service: Deleting voice ${voiceId}`);
    return new Promise(resolve => {
        setTimeout(() => {
            mockVoiceLibrary = mockVoiceLibrary.filter(v => v.id !== voiceId);
            resolve({ success: true });
        }, 500);
    });
};