"use client";

import React, { useState } from 'react';
import { Menu, Home, FileText, BarChart3, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: Home, href: '/' },
    { name: 'Transactions', icon: FileText, href: '/transactions' },
    { name: 'Reports', icon: BarChart3, href: '/reports' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLinkClick = () => {
    // Close mobile sidebar on link click
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <div
      className={cn(
        "h-screen bg-white transition-all duration-300 ease-in-out border-gray-200",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header with hamburger and logo */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden lg:block cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" style={{ color: '#1B2528' }} />
          </button>
          {!isCollapsed && (
            <div className="ml-3 lg:ml-3 flex items-center cursor-pointer">
              <Image
                src="/logo.svg"
                alt="Fintrack logo"
                width={100}
                height={38}
                priority
              />
            </div>
          )}
        </div>
        
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" style={{ color: '#1B2528' }} />
        </button>
      </div>

      {/* Navigation items */}
      <nav className="mt-5 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "w-full flex items-center px-3 py-2 mb-1 rounded-3xl transition-all duration-200 group",
                isActive
                  ? "bg-[#DDE5E7] text-[#3A6C7B]"
                  : "text-[#1B2528] hover:bg-gray-100",
                isCollapsed && "justify-center"
              )}
            >
              {/* Only show icon when sidebar is collapsed */}
              {isCollapsed && (
                <Icon 
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    isActive 
                      ? "text-[#3A6C7B]" 
                      : "text-[#1B2528] group-hover:text-[#3A6C7B]"
                  )}
                />
              )}
              {/* Only show text when sidebar is not collapsed */}
              {!isCollapsed && (
                <span 
                  className={cn(
                    "font-medium transition-colors",
                    isActive 
                      ? "text-[#3A6C7B]" 
                      : "text-[#1B2528] group-hover:text-[#3A6C7B]"
                  )}
                  style={{ 
                    fontSize: '15px'
                  }}
                >
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;