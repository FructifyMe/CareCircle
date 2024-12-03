import React from 'react';
import { ExpenseCard } from './ExpenseCard';
import type { Expense } from '../../types/care';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit }) => {
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedExpenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};