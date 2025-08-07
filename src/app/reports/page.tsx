"use client";

import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="rounded-full bg-gray-100 p-6 mb-6">
          <BarChart3 className="h-12 w-12 text-gray-400" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          No reports available
        </h1>
        <p className="text-gray-500 max-w-md">
          Reports and analytics will be generated as you add more financial data.
        </p>
      </div>
    </div>
  );
}