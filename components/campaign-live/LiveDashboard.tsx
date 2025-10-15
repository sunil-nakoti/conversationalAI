import React from 'react';
import { LiveCall, LiveSms, LoginEvent } from '../../types';
import LiveKpiGrid from './LiveKpiGrid';
import LiveCallFeed from './LiveCallFeed';
import LiveSmsFeed from './LiveSmsFeed';
import SmartCoach from './SmartCoach';

interface LiveDashboardProps {
    calls: LiveCall[];
    sms: LiveSms[];
    paymentsMade: number;
    logins: number;
    loginEvents: LoginEvent[];
    coachedCallId: string | null;
    setCoachedCallId: (id: string | null) => void;
    coachedCall: LiveCall | null;
}

const LiveDashboard: React.FC<LiveDashboardProps> = (props) => {
    const { calls, sms, paymentsMade, logins, loginEvents, coachedCallId, setCoachedCallId, coachedCall } = props;
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            <div className="lg:col-span-1 flex flex-col gap-6">
                <LiveKpiGrid calls={calls} sms={sms} paymentsMade={paymentsMade} logins={logins} loginEvents={loginEvents} />
            </div>
            <div className="lg:col-span-2 h-full">
                <LiveCallFeed calls={calls} coachedCallId={coachedCallId} setCoachedCallId={setCoachedCallId} />
            </div>
            <div className="lg:col-span-1 h-full">
                <SmartCoach call={coachedCall} />
            </div>
        </div>
    );
};

export default LiveDashboard;