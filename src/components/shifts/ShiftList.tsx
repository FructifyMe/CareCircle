import React from 'react';
import { ShiftCard } from './ShiftCard';
import type { CareShift } from '../../types/care';

interface ShiftListProps {
  shifts: CareShift[];
  onSignUp: (shiftId: string) => void;
  onViewDetails: (shiftId: string) => void;
}

export const ShiftList: React.FC<ShiftListProps> = ({
  shifts,
  onSignUp,
  onViewDetails
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {shifts.map((shift) => (
        <ShiftCard
          key={shift.id}
          shift={shift}
          onSignUp={onSignUp}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};