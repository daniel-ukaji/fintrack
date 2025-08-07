"use client";

import React from 'react';
import { Search, LayoutGrid, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="w-full h-14 sm:h-16 bg-white  border-gray-200 px-3 sm:px-4 md:px-6">
      <div className="h-full flex items-center justify-between">
        {/* Left side - Mobile menu button (hidden on desktop) */}
        <div className="flex items-center">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" style={{ color: '#1B2528' }} />
            </button>
          )}
          {/* Empty div for desktop to maintain layout */}
          <div className="hidden lg:block" />
        </div>
        
        {/* Right side*/}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          <button 
            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#1B2528' }} />
          </button>
          
          <button 
            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#1B2528' }} />
          </button>
          
          <Avatar className="h-7 w-7 sm:h-8 sm:w-8 cursor-pointer">
            <AvatarImage src="./image/avatar.png" alt="User avatar" />
            <AvatarFallback style={{ backgroundColor: '#3A6C7B', color: 'white' }}>
              JD
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;