"use client";

import React from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface AvatarData {
  src: string;
  fallback: string;
}

interface AvatarGroupProps {
  avatars?: AvatarData[];
  description?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ 
  avatars = [
    { src: "./image/avatar.png", fallback: "CN" },
    { src: "./image/avatar-2.png", fallback: "CN" },
    { src: "./image/avatar-3.png", fallback: "LR" },
    { src: "./image/avatar-4.png", fallback: "ER" },
  ],
  description = "Ava, Liam, Noah +12 others"
}) => {
  return (
    <div className="flex items-center space-x-3 sm:space-x-4">
      <div className="flex -space-x-2 sm:-space-x-3">
        {avatars.map((avatar, index) => (
          <Avatar 
            key={index}
            className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-white relative"
            style={{ zIndex: 4 - index }}
          >
            <AvatarImage src={avatar.src} alt={`User ${index + 1}`} />
            <AvatarFallback className="text-xs sm:text-sm">{avatar.fallback}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div>
        <h1 className="text-[#6D797C] text-[13px] sm:text-[15px]">{description}</h1>
      </div>
    </div>
  );
};