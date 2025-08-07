"use client";

import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
  tabs?: Tab[];
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  children,
  tabs = [
    { id: "overview", label: "Overview" },
    { id: "transactions", label: "Transactions" },
  ]
}) => {
  return (
    <div className="mt-6 sm:mt-8">
      <div className="relative">
        <div className="flex space-x-4 sm:space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 sm:px-7 text-[14px] sm:text-[15px] transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-[#4B8B9F]"
                  : "text-[#6D797C] hover:text-[#1B2528]"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4B8B9F]" />
              )}
            </button>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200 -z-10" />
      </div>

      {/* Tab Content */}
      <div className="mt-4 sm:mt-6">
        {children}
      </div>
    </div>
  );
};