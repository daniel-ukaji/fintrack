import React from 'react';
import { Receipt } from 'lucide-react';

export const TransactionsContent: React.FC = () => {
  const transactions = []; // Empty transactions array

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Receipt className="w-12 h-12 text-gray-400 mb-4" strokeWidth={1.5} />
        <h3 className="text-gray-900 font-medium mb-1">No transactions</h3>
        <p className="text-gray-500 text-sm">Your transactions will appear here</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[#1B2528]">Transactions content</p>
      {/* Transaction list */}
    </div>
  );
};