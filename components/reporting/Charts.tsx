import React from 'react';

interface ChartDataItem {
    name: string;
    value: number;
    color: string;
}

export const DonutChart: React.FC<{ data: ChartDataItem[] }> = ({ data }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    if (total === 0) {
        return <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">No data available.</div>;
    }
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
        <div className="flex items-center justify-center gap-8">
            <svg width="150" height="150" viewBox="0 0 120 120" className="transform -rotate-90">
                {data.map((item, index) => {
                    const dasharray = (item.value / total) * circumference;
                    const slice = (
                        <circle
                            key={index}
                            r={radius}
                            cx="60"
                            cy="60"
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth="20"
                            strokeDasharray={`${dasharray} ${circumference}`}
                            strokeDashoffset={-offset}
                        />
                    );
                    offset += dasharray;
                    return slice;
                })}
            </svg>
            <div className="text-sm space-y-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                        <span className="font-semibold text-slate-800 dark:text-white">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const BarChart: React.FC<{ data: ChartDataItem[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    
    return (
        <div className="flex items-end h-32 gap-4">
            {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-lg font-bold text-slate-800 dark:text-white">{item.value}</div>
                    <div
                        className="w-full rounded-t-md"
                        style={{
                            height: `${(item.value / maxValue) * 100}%`,
                            backgroundColor: item.color
                        }}
                    ></div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{item.name}</div>
                </div>
            ))}
        </div>
    );
};
