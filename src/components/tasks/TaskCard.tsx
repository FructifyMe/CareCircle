import React from 'react';
import { Clock, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import type { CareTask } from '../../types/care';
import { format } from 'date-fns';

interface TaskCardProps {
  task: CareTask;
  onComplete: (taskId: string) => void;
  onViewDetails: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onComplete,
  onViewDetails
}) => {
  const statusColors = {
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
    'in-progress': 'bg-blue-50 text-blue-700 border-blue-100',
    completed: 'bg-green-50 text-green-700 border-green-100'
  };

  const priorityColors = {
    low: 'text-green-600',
    medium: 'text-amber-600',
    high: 'text-red-600'
  };

  const categoryIcons = {
    medication: '💊',
    meals: '🍽️',
    hygiene: '🚿',
    exercise: '🏃‍♂️',
    social: '👥',
    other: '📝'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-sm border ${statusColors[task.status]}`}>
          {task.status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </span>
        <span className={`flex items-center gap-1 text-sm ${priorityColors[task.priority]}`}>
          <AlertCircle className="w-4 h-4" />
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{categoryIcons[task.category]}</span>
          <div>
            <h3 className="font-medium text-secondary-900">{task.title}</h3>
            <p className="text-sm text-secondary-600">{task.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-secondary-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{format(new Date(task.dueDate), 'h:mm a')}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {task.status !== 'completed' && (
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => onComplete(task.id)}
            >
              Complete Task
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails(task.id)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};