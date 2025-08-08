import React, { useState, useMemo } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const globalStyles = `
  .sortable-card {
    will-change: transform;
  }
  
  .dragging-overlay {
    cursor: grabbing !important;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = globalStyles;
  document.head.appendChild(styleSheet);
}

interface SummaryCardData {
  id: string;
  title: string;
  value: string;
  change: number;
  prefix?: string;
}

interface SummaryCardProps extends SummaryCardData {
  isDragging?: boolean;
}

interface DragHandleProps {
  ref: React.Ref<HTMLButtonElement>;
  [key: string]: unknown;
}

interface Transaction {
  date: string;
  remark: string;
  amount: number;
  currency: string;
  type: 'Credit' | 'Debit';
}

type SortColumn = 'date' | 'remark' | 'amount' | 'currency' | 'type';
type SortDirection = 'asc' | 'desc';

// Sortable Card Component
const SortableSummaryCard: React.FC<SummaryCardData> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({ 
    id: props.id,
    transition: {
      duration: 150,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
    animateLayoutChanges: () => true,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`sortable-card ${isDragging ? 'opacity-0' : ''}`}>
      <SummaryCard
        {...props}
        dragHandleProps={{
          ...attributes,
          ...listeners,
          ref: setActivatorNodeRef,
        }}
      />
    </div>
  );
};

const SummaryCard: React.FC<SummaryCardProps & { dragHandleProps?: DragHandleProps }> = ({ 
  title, 
  value, 
  change, 
  prefix = "$",
  isDragging,
  dragHandleProps
}) => {
  const isPositive = change >= 0;
  
  return (
    <div 
      className={`p-4 sm:p-6 bg-[#EAEFF0] rounded-2xl sm:rounded-3xl transition-all duration-200 ${
        isDragging ? 'shadow-2xl scale-110 rotate-2 ring-2 ring-gray-300 ring-opacity-50' : ''
      }`}
      style={isDragging ? { 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' 
      } : {}}
    >
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <h3 className="text-[#1B2528] text-[15px] sm:text-[17px] font-bold">{title}</h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              {...dragHandleProps}
              className="text-[#6D797C] hover:text-[#1B2528] transition-colors cursor-grab active:cursor-grabbing touch-none p-1"
            >
              <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Drag to move card</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="space-y-1">
        <p className="text-[24px] sm:text-[28px] md:text-[34px] font-bold text-[#1B2528]">
          {prefix}{value}
        </p>
        <p className={`text-sm font-medium ${isPositive ? 'text-[#3E7383]' : 'text-[#3E7383]'}`}>
          {isPositive ? '+' : ''}{change}%
        </p>
      </div>
    </div>
  );
};

// Move transactions outside the component to prevent recreation on each render
const TRANSACTIONS: Transaction[] = [
  { date: '2023-10-01', remark: 'Salary', amount: 3000, currency: 'USD', type: 'Credit' },
  { date: '2023-10-02', remark: 'Groceries', amount: -150, currency: 'USD', type: 'Debit' },
  { date: '2023-10-03', remark: 'Gym Membership', amount: -50, currency: 'USD', type: 'Debit' },
  { date: '2023-10-04', remark: 'Dinner', amount: -40, currency: 'USD', type: 'Debit' },
  { date: '2023-10-05', remark: 'Movie Tickets', amount: -30, currency: 'USD', type: 'Debit' },
  { date: '2023-10-06', remark: 'Rent', amount: -1200, currency: 'USD', type: 'Debit' },
  { date: '2023-10-07', remark: 'Utilities', amount: -100, currency: 'USD', type: 'Debit' },
  { date: '2023-10-08', remark: 'Car Payment', amount: -400, currency: 'USD', type: 'Debit' },
  { date: '2023-10-09', remark: 'Insurance', amount: -200, currency: 'USD', type: 'Debit' },
];

const TransactionTable: React.FC = () => {
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedTransactions = useMemo(() => {
    if (!sortColumn) return TRANSACTIONS;

    return [...TRANSACTIONS].sort((a, b) => {
      let aValue: string | number | Date = a[sortColumn];
      let bValue: string | number | Date = b[sortColumn];

      if (sortColumn === 'date') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (sortColumn === 'amount') {
        aValue = Math.abs(aValue as number);
        bValue = Math.abs(bValue as number);
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [sortColumn, sortDirection]);

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? 
        <AiFillCaretUp className="h-3 w-3 sm:h-4 sm:w-4" color='#6D797C' /> : 
        <AiFillCaretDown className="h-3 w-3 sm:h-4 sm:w-4" color='#6D797C' />;
    }
    return <AiFillCaretDown className="h-3 w-3 sm:h-4 sm:w-4" color='#6D797C' />;
  };

  return (
    <div className="mt-6 sm:mt-8">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="border-separate table-fixed w-full min-w-[640px]" style={{ borderSpacing: '0 0' }}>
          <thead>
            <tr className="hover:bg-transparent">
              <th className="text-[#6D797C] font-medium h-12 bg-white border-b-0 w-[55%] text-left">
                <div 
                  className="flex items-center gap-1 cursor-pointer hover:text-[#1B2528] transition-colors"
                  onClick={() => handleSort('date')}
                >
                  Date
                  {getSortIcon('date')}
                </div>
              </th>
              <th className="bg-transparent w-4 border-b-0"></th>
              <th className="text-[#6D797C] font-medium bg-white border-b-0 w-[11.25%] text-left">
                <div 
                  className="flex items-center gap-1 cursor-pointer hover:text-[#1B2528] transition-colors"
                  onClick={() => handleSort('remark')}
                >
                  Remark
                  {getSortIcon('remark')}
                </div>
              </th>
              <th className="bg-transparent w-4 border-b-0"></th>
              <th className="text-[#6D797C] font-medium bg-white border-b-0 w-[11.25%] text-left">
                <div 
                  className="flex items-center gap-1 cursor-pointer hover:text-[#1B2528] transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  Amount
                  {getSortIcon('amount')}
                </div>
              </th>
              <th className="bg-transparent w-4 border-b-0"></th>
              <th className="text-[#6D797C] font-medium bg-white border-b-0 w-[11.25%] text-left">
                <div 
                  className="flex items-center gap-1 cursor-pointer hover:text-[#1B2528] transition-colors"
                  onClick={() => handleSort('currency')}
                >
                  Currency
                  {getSortIcon('currency')}
                </div>
              </th>
              <th className="bg-transparent w-4 border-b-0"></th>
              <th className="text-[#6D797C] font-medium bg-white border-b-0 w-[11.25%] text-left">
                <div 
                  className="flex items-center gap-1 cursor-pointer hover:text-[#1B2528] transition-colors"
                  onClick={() => handleSort('type')}
                >
                  Type
                  {getSortIcon('type')}
                </div>
              </th>
            </tr>
            <tr>
              <td className="p-0 w-[55%]">
                <div className="h-[2px] bg-gray-200 mb-2"></div>
              </td>
              <td className="p-0 w-4"></td>
              <td className="p-0 w-[11.25%]">
                <div className="h-[2px] bg-gray-200 mb-2"></div>
              </td>
              <td className="p-0 w-4"></td>
              <td className="p-0 w-[11.25%]">
                <div className="h-[2px] bg-gray-200 mb-2"></div>
              </td>
              <td className="p-0 w-4"></td>
              <td className="p-0 w-[11.25%]">
                <div className="h-[2px] bg-gray-200 mb-2"></div>
              </td>
              <td className="p-0 w-4"></td>
              <td className="p-0 w-[11.25%]">
                <div className="h-[2px] bg-gray-200 mb-2"></div>
              </td>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction, index) => (
              <React.Fragment key={index}>
                <tr className="border-0 group">
                  <td className="font-medium text-[#1B2528] py-4 border-0 w-[55%] bg-white group-hover:bg-gray-50 transition-colors">
                    {transaction.date}
                  </td>
                  <td className="bg-transparent w-4 border-0"></td>
                  <td className="text-[#1B2528] border-0 w-[11.25%] bg-white group-hover:bg-gray-50 transition-colors">
                    {transaction.remark}
                  </td>
                  <td className="bg-transparent w-4 border-0"></td>
                  <td className="text-[#1B2528] border-0 w-[11.25%] bg-white group-hover:bg-gray-50 transition-colors">
                    {transaction.type === 'Credit' ? '$' : '-$'}{Math.abs(transaction.amount).toLocaleString()}
                  </td>
                  <td className="bg-transparent w-4 border-0"></td>
                  <td className="text-[#1B2528] border-0 w-[11.25%] bg-white group-hover:bg-gray-50 transition-colors">
                    {transaction.currency}
                  </td>
                  <td className="bg-transparent w-4 border-0"></td>
                  <td className="border-0 w-[11.25%] bg-white group-hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2 bg-[#EAEFF0] px-3 py-1 rounded-3xl w-fit">
                      <div className={`w-2 h-2 rounded-full ${
                        transaction.type === 'Credit' ? 'bg-[#087A2E]' : 'bg-[#E53E3E]'
                      }`} />
                      <span className="text-[#1B2528]">{transaction.type}</span>
                    </div>
                  </td>
                </tr>
                {index < sortedTransactions.length - 1 && (
                  <tr>
                    <td className="p-0 w-[55%]">
                      <div className="h-[2px] bg-gray-200"></div>
                    </td>
                    <td className="p-0 w-4"></td>
                    <td className="p-0 w-[11.25%]">
                      <div className="h-[2px] bg-gray-200"></div>
                    </td>
                    <td className="p-0 w-4"></td>
                    <td className="p-0 w-[11.25%]">
                      <div className="h-[2px] bg-gray-200"></div>
                    </td>
                    <td className="p-0 w-4"></td>
                    <td className="p-0 w-[11.25%]">
                      <div className="h-[2px] bg-gray-200"></div>
                    </td>
                    <td className="p-0 w-4"></td>
                    <td className="p-0 w-[11.25%]">
                      <div className="h-[2px] bg-gray-200"></div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {/* Mobile Sort Controls */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-[#6D797C]">Sort by:</span>
          <select 
            className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#4B8B9F]"
            onChange={(e) => handleSort(e.target.value as SortColumn)}
            value={sortColumn || ''}
          >
            <option value="">Default</option>
            <option value="date">Date</option>
            <option value="remark">Remark</option>
            <option value="amount">Amount</option>
            <option value="type">Type</option>
          </select>
        </div>

        {/* Transaction Cards */}
        {sortedTransactions.map((transaction, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-[#1B2528]">{transaction.date}</span>
              <div className="flex items-center gap-2 bg-[#EAEFF0] px-3 py-1 rounded-3xl">
                <div className={`w-2 h-2 rounded-full ${
                  transaction.type === 'Credit' ? 'bg-[#087A2E]' : 'bg-[#E53E3E]'
                }`} />
                <span className="text-sm">{transaction.type}</span>
              </div>
            </div>
            <p className="text-[#1B2528] mb-2">{transaction.remark}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">
                {transaction.type === 'Credit' ? '$' : '-$'}{Math.abs(transaction.amount).toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">{transaction.currency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Component with DnD Context
export const OverviewContent: React.FC = () => {
  const [summaryCards, setSummaryCards] = useState<SummaryCardData[]>([
    { id: 'balance', title: 'Total Balance', value: '12,345', change: 5 },
    { id: 'credits', title: 'Total Credits', value: '7,890', change: 3 },
    { id: 'debits', title: 'Total Debits', value: '4,455', change: -2 },
    { id: 'transactions', title: 'Transactions', value: '150', change: 10, prefix: '' },
  ]);

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSummaryCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const activeCard = summaryCards.find((card) => card.id === activeId);

  return (
    <TooltipProvider>
      <div>
        <div className="mt-6 sm:mt-8 mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-[#1B2528]">Summary</h1>
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={summaryCards.map(card => card.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-9">
              {summaryCards.map((card) => (
                <SortableSummaryCard key={card.id} {...card} />
              ))}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={{
            duration: 200,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}>
            {activeId && activeCard ? (
              <div className="dragging-overlay">
                <SummaryCard {...activeCard} isDragging={true} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <TransactionTable />
      </div>
    </TooltipProvider>
  );
};