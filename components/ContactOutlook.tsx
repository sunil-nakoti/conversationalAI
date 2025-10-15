import React from 'react';
import { Debtor } from '../types';
import { Icon } from './Icon';

interface ContactOutlookProps {
    outlook: NonNullable<Debtor['contactOutlook']>;
}

const ContactOutlook: React.FC<ContactOutlookProps> = ({ outlook }) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const timeSlots = ['Morning', 'Afternoon', 'Evening'];
    
    const getColor = (value: number) => {
        const opacity = Math.max(0.1, value); // Ensure some visibility
        return `rgba(34, 197, 94, ${opacity})`; // Green with variable opacity
    };

    return (
        <div>
            <h3 className="text-md font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">Contact Outlook</h3>
            <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-x-2 gap-y-1 text-xs items-center">
                {/* Header Row */}
                <div />
                {timeSlots.map(slot => <div key={slot} className="font-bold text-center text-slate-500 dark:text-slate-400">{slot}</div>)}

                {/* Heatmap Rows */}
                {days.map((day, dayIndex) => (
                    <React.Fragment key={day}>
                        <div className="font-bold text-right text-slate-500 dark:text-slate-400">{day}</div>
                        {timeSlots.map((_, slotIndex) => (
                            <div 
                                key={slotIndex} 
                                className="h-6 rounded"
                                style={{ backgroundColor: getColor(outlook.heatmap[dayIndex][slotIndex]) }}
                                title={`Propensity: ${(outlook.heatmap[dayIndex][slotIndex] * 100).toFixed(0)}%`}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </div>
            <div className="mt-4 flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                <Icon name="star" className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    Optimal Channel Recommendation: <span className="text-brand-accent">{outlook.optimalChannel}</span>
                </p>
            </div>
        </div>
    );
};

export default ContactOutlook;
