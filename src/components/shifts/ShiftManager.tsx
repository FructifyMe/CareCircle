import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '../common/Button';
import { ShiftCalendar } from './ShiftCalendar';
import { ShiftList } from './ShiftList';
import { CreateShiftModal } from './CreateShiftModal';
import { useCareStore } from '../../store/careStore';
import type { CareShift } from '../../types/care';

export const ShiftManager: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { shifts, addShift, assignShift } = useCareStore();
  const currentPatient = useCareStore(state => state.currentPatient);
  const currentCaregiver = useCareStore(state => state.currentCaregiver);

  const handleCreateShift = (shiftData: Omit<CareShift, 'id'>) => {
    const newShift: CareShift = {
      ...shiftData,
      id: Date.now().toString(),
    };
    addShift(newShift);
  };

  const handleSignUp = (shiftId: string) => {
    if (currentCaregiver) {
      assignShift(shiftId, currentCaregiver.id);
    }
  };

  const handleViewDetails = (shiftId: string) => {
    // TODO: Implement shift details view
    console.log('View shift details:', shiftId);
  };

  const filteredShifts = shifts.filter(shift => 
    shift.patientId === currentPatient?.id
  );

  const isAdmin = currentCaregiver?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-secondary-900">Care Shifts</h2>
          <p className="text-secondary-600">Manage and sign up for care shifts</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          {isAdmin && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Shift
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ShiftCalendar
            shifts={filteredShifts}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        <div className="lg:col-span-3">
          <ShiftList
            shifts={filteredShifts}
            onSignUp={handleSignUp}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateShiftModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateShift}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};