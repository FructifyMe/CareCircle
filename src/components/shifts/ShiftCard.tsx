import React from 'react';
import { Clock, Calendar, User } from 'lucide-react';
import { Button } from '../common/Button';
import type { CareShift } from '../../types/care';
import { format } from 'date-fns';

interface ShiftCardProps {
  shift: CareShift;
  onSignUp?: (shiftId: string) => void;
  onViewDetails?: (shiftId: string) => void;
}

export const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  onSignUp,
  onViewDetails
}) => {
  const statusColors = {
    open: 'bg-green-50 text-green-700 border-green-100',
    assigned: 'bg-blue-50 text-blue-700 border-blue-100',
    completed: 'bg-gray-50 text-gray-700 border-gray-100'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-sm border ${statusColors[shift.status]}`}>
          {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails?.(shift.id)}
        >
          View Details
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-secondary-600">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(shift.date), 'MMMM d, yyyy')}</span>
        </div>

        <div className="flex items-center gap-2 text-secondary-600">
          <Clock className="w-4 h-4" />
          <span>{shift.startTime} - {shift.endTime}</span>
        </div>

        {shift.caregiverId && (
          <div className="flex items-center gap-2 text-secondary-600">
            <User className="w-4 h-4" />
            <span>Assigned to: {shift.caregiverId}</span>
          </div>
        )}

        {shift.notes && (
          <p className="text-sm text-secondary-600 border-t border-gray-100 pt-2">
            {shift.notes}
          </p>
        )}

        {shift.status === 'open' && (
          <Button
            variant="primary"
            className="w-full mt-4"
            onClick={() => onSignUp?.(shift.id)}
          >
            Sign Up for Shift
          </Button>
        )}
      </div>
    </div>
  );
};