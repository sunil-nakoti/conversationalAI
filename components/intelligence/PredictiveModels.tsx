
import React from 'react';
// FIX: Corrected import paths for child components.
import ChannelAffinityModel from './ChannelAffinityModel';
import OptimalPathSimulator from './OptimalPathSimulator';
// FIX: Corrected import path for JurisdictionManager
import JurisdictionManager from './JurisdictionManager';

const PredictiveModels: React.FC = () => {
    return (
        <div className="space-y-6">
            <ChannelAffinityModel />
            <OptimalPathSimulator />
        </div>
    );
};

export default PredictiveModels;