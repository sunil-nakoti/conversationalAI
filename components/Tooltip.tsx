import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'bottom' | 'top' | 'left' | 'right';
  disabled?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'bottom', disabled = false }) => {
  const positionClasses = {
    bottom: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    top: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div className="group relative flex items-center justify-center">
      {children}
      <div className={`absolute ${positionClasses[position]} w-56 bg-white dark:bg-slate-900 text-slate-700 dark:text-white text-xs rounded-lg py-2 px-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 border border-slate-200 dark:border-slate-700 shadow-lg`}>
        {content}
      </div>
    </div>
  );
};

export default Tooltip;