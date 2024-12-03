import React, { useState } from 'react';
import { Plus, Filter, ListFilter } from 'lucide-react';
import { Button } from '../common/Button';
import { TaskList } from './TaskList';
import { CreateTaskModal } from './CreateTaskModal';
import { useCareStore } from '../../store/careStore';
import type { CareTask } from '../../types/care';

export const TaskManager: React.FC = () => {
  const { tasks, addTask, completeTask } = useCareStore();
  const currentPatient = useCareStore(state => state.currentPatient);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleComplete = (taskId: string) => {
    completeTask(taskId);
  };

  const handleCreateTask = (taskData: Omit<CareTask, 'id'>) => {
    const newTask: CareTask = {
      ...taskData,
      id: Date.now().toString(),
    };
    addTask(newTask);
  };

  const handleViewDetails = (taskId: string) => {
    // TODO: Implement task details view
    console.log('View task details:', taskId);
  };

  const filteredTasks = tasks.filter(task => {
    if (task.patientId !== currentPatient?.id) return false;
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;
    return true;
  });

  const taskStats = {
    total: filteredTasks.length,
    pending: filteredTasks.filter(t => t.status === 'pending').length,
    inProgress: filteredTasks.filter(t => t.status === 'in-progress').length,
    completed: filteredTasks.filter(t => t.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-secondary-900">Care Tasks</h2>
          <p className="text-secondary-600">Manage daily care tasks and activities</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: taskStats.total },
          { label: 'Pending', value: taskStats.pending },
          { label: 'In Progress', value: taskStats.inProgress },
          { label: 'Completed', value: taskStats.completed }
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-secondary-600">{label}</p>
            <p className="text-2xl font-semibold text-secondary-900 mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex gap-4 mb-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-secondary-900"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-secondary-900"
          >
            <option value="all">All Categories</option>
            <option value="medication">Medication</option>
            <option value="meals">Meals</option>
            <option value="hygiene">Hygiene</option>
            <option value="exercise">Exercise</option>
            <option value="social">Social</option>
            <option value="other">Other</option>
          </select>
        </div>

        <TaskList
          tasks={filteredTasks}
          onComplete={handleComplete}
          onViewDetails={handleViewDetails}
        />
      </div>

      {isCreateModalOpen && (
        <CreateTaskModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </div>
  );
};