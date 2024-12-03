import React from 'react';
import { TaskCard } from './TaskCard';
import type { CareTask } from '../../types/care';

interface TaskListProps {
  tasks: CareTask[];
  onComplete: (taskId: string) => void;
  onViewDetails: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onComplete,
  onViewDetails
}) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by priority first
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    // Then by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onComplete}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};