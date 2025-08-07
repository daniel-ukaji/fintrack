import React from 'react';

interface StatusBadgeProps {
  status: string;
  color?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  color = "#087A2E" 
}) => {
  return (
    <div className="px-4 py-1 rounded-3xl bg-[#EAEFF0] ml-4 flex items-center">
      <div 
        className="w-2 h-2 rounded-full mr-2" 
        style={{ backgroundColor: color }}
      />
      <h1 className="text-[#1B2528]">{status}</h1>
    </div>
  );
};