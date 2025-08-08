"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, FileText, Settings, ScrollText, Images } from "lucide-react";
import { AiFillCaretDown } from "react-icons/ai";
import { StatusBadge } from './StatusBadge';

export const DashboardHeader: React.FC = () => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleDownloadPDF = () => {
    console.log("Downloading as PDF...");
    setShareDialogOpen(false);
  };

  const handleDownloadJPG = () => {
    console.log("Downloading as JPG...");
    setShareDialogOpen(false);
  };

  const handleSettings = () => {
    console.log("Opening settings...");
  };

  const handleLog = () => {
    console.log("Opening log...");
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-3">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <h1 
            className="text-2xl sm:text-3xl md:text-4xl font-bold"
            style={{ color: '#1B2528' }}
          >
            Wallet Ledger
          </h1>
          <div className="hidden sm:block">
            <AiFillCaretDown />
          </div>
          <StatusBadge status="Active" />
        </div>
        <div className="flex items-center space-x-3 sm:space-x-5">
          <Button 
            className="bg-[#4B8B9F] text-[#020303] rounded-3xl cursor-pointer px-4 sm:px-6 py-4 sm:py-5 text-sm sm:text-base hover:bg-[#4B8B9F]/90 transition-colors"
            onClick={() => setShareDialogOpen(true)}
          >
            Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="border p-2 rounded-full border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white">
                <Ellipsis className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-40 bg-white border border-gray-200 shadow-lg z-50"
              sideOffset={5}
              forceMount
            >
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 text-gray-900" 
                onClick={handleSettings}
              >
                <Settings className="mr-2 h-4 w-4 text-gray-600" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 text-gray-900" 
                onClick={handleLog}
              >
                <ScrollText className="mr-2 h-4 w-4 text-gray-600" />
                <span>Log</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-[calc(100vw-2rem)] max-w-[425px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-lg font-semibold">Download Transactions</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-3 w-full p-4 text-left cursor-pointer rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <span className="text-gray-900 font-medium">Download Transactions as PDF</span>
            </button>
            <button
              onClick={handleDownloadJPG}
              className="flex items-center gap-3 w-full p-4 text-left cursor-pointer rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              <Images className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <span className="text-gray-900 font-medium">Download Transactions as JPG</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};