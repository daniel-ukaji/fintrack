"use client";

import { FileText } from "lucide-react";

export default function TransactionsPage() {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="rounded-full bg-gray-100 p-6 mb-6">
          <FileText className="h-12 w-12 text-gray-400" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          No transactions yet
        </h1>
        <p className="text-gray-500 max-w-md">
          Your transaction history will appear here once you start tracking your finances.
        </p>
      </div>
    </div>
  );
}