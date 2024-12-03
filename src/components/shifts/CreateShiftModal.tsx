import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { TextArea } from '../common/TextArea';
import type { CareShift } from '../../types/care';
import { format } from 'date-fns';

interface CreateShiftModalProps {
  onClose: () => void;
  onSubmit: (shift: Omit<CareShift, 'id'>) => void;
  selectedDate: Date;
}

export const CreateShiftModal: React.FC<CreateShiftModalProps> = ({
  onClose,
  onSubmit,
  selectedDate
}) => {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      patientId: '1', // This will be replaced with actual patient ID
      caregiverId: null,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime,
      endTime,
      status: 'open',
      notes
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-secondary-900">Create New Shift</h2>
          <button onClick={onClose} className="text-secondary-400 hover:text-secondary-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <Input
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <Input
              label="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <TextArea
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any special instructions or requirements for this shift"
            rows={4}
          />

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Shift
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};