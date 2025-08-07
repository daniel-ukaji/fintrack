"use client";

import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { AiFillCaretDown } from "react-icons/ai";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AvatarGroup } from "@/components/AvatarGroup";
import { DashboardTabs } from "@/components/DashboardTabs";
import { OverviewContent } from "@/components/OverviewContent";
import { TransactionsContent } from "@/components/TransactionsContent";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <div className="w-full">
      <DashboardHeader />
      
      <div className="mt-5">
        <AvatarGroup />
        
        <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab}>
          {activeTab === "overview" && <OverviewContent />}
          {activeTab === "transactions" && <TransactionsContent />}
        </DashboardTabs>
      </div>
    </div>
  );
}