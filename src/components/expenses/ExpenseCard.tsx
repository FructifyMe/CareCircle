import React from 'react';
import { DollarSign, Calendar, User } from 'lucide-react';
import { Button } from '../common/Button';
import type { Expense } from '../../types/care';
import { format } from 'date-fns';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit }) => {
  const categoryIcons = {
    medical: '🏥',
    supplies: '🛍️',
    food: '🍽️',
    transportation: '🚗',
    other: '📝'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{categoryIcons[expense.category]}</span>
          <span className="font-medium text-secondary-900 capitalize">
            {expense.category}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={() => onEdit(expense)}>
          Edit
        </Button>
      </div>

      <p className="text-lg font-semibold text-secondary-900">
        ${expense.amount.toFixed(2)}
      </p>
      <p className="text-sm text-secondary-600 mt-1">{expense.description}</p>

      <div className="flex items-center gap-4 mt-4 text-sm text-secondary-600">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>Paid by: {expense.paidBy}</span>
        </div>
      </div>

      {expense.receipt && (
        <a
          href={expense.receipt}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          <DollarSign className="w-4 h-4" />
          View Receipt
        </a>
      )}
    </div>
  );
};