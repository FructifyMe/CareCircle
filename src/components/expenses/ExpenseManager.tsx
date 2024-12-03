import React, { useState } from 'react';
import { Plus, Filter, DollarSign, TrendingUp } from 'lucide-react';
import { Button } from '../common/Button';
import { ExpenseList } from './ExpenseList';
import { useCareStore } from '../../store/careStore';

export const ExpenseManager: React.FC = () => {
  const { expenses, updateExpense } = useCareStore();
  const currentPatient = useCareStore(state => state.currentPatient);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const handleEdit = (expense: Expense) => {
    // TODO: Implement expense edit modal
    console.log('Edit expense:', expense);
  };

  const filteredExpenses = expenses.filter(expense => {
    if (expense.patientId !== currentPatient?.id) return false;
    if (categoryFilter !== 'all' && expense.category !== categoryFilter) return false;
    return true;
  });

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const expensesByCategory = filteredExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-secondary-900">Expenses</h2>
          <p className="text-secondary-600">Track and manage care-related expenses</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-primary-600" />
            </div>
            <span className="text-secondary-600">Total Expenses</span>
          </div>
          <p className="text-2xl font-semibold text-secondary-900">
            ${totalExpenses.toFixed(2)}
          </p>
          <p className="text-sm text-secondary-500 mt-1">All time</p>
        </div>

        {Object.entries(expensesByCategory).slice(0, 3).map(([category, amount]) => (
          <div key={category} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-secondary-600 capitalize">{category}</span>
            </div>
            <p className="text-2xl font-semibold text-secondary-900">
              ${amount.toFixed(2)}
            </p>
            <p className="text-sm text-secondary-500 mt-1">Total {category}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex gap-4 mb-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-secondary-900"
          >
            <option value="all">All Categories</option>
            <option value="medical">Medical</option>
            <option value="supplies">Supplies</option>
            <option value="food">Food</option>
            <option value="transportation">Transportation</option>
            <option value="other">Other</option>
          </select>
        </div>

        <ExpenseList
          expenses={filteredExpenses}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
};