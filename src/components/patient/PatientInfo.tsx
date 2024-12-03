import React from 'react';
import { Phone, Mail, MapPin, AlertCircle } from 'lucide-react';
import { useCareStore } from '../../store/careStore';
import { Button } from '../common/Button';

export const PatientInfo: React.FC = () => {
  const currentPatient = useCareStore(state => state.currentPatient);
  const currentCaregiver = useCareStore(state => state.currentCaregiver);

  if (!currentPatient) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-amber-700">
          <AlertCircle className="w-5 h-5" />
          <p>No patient selected. Please contact your administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-start gap-4">
        <img
          src={currentPatient.photo}
          alt={currentPatient.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">
                {currentPatient.name}
              </h2>
              <p className="text-secondary-600">
                {currentPatient.age} years • {currentPatient.condition}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm border ${
                currentPatient.status === 'Stable'
                  ? 'bg-green-50 text-green-700 border-green-100'
                  : currentPatient.status === 'Critical'
                  ? 'bg-red-50 text-red-700 border-red-100'
                  : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}>
                {currentPatient.status}
              </span>
              
              {currentCaregiver?.role === 'admin' && (
                <Button variant="outline" size="sm">
                  Edit Info
                </Button>
              )}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm text-secondary-600">
              <MapPin className="w-4 h-4" />
              <span>{currentPatient.address}</span>
            </div>
            
            {currentPatient.emergencyContacts.length > 0 && (
              <>
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <Phone className="w-4 h-4" />
                  <span>
                    Emergency: {currentPatient.emergencyContacts[0].name} ({currentPatient.emergencyContacts[0].phone})
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <Mail className="w-4 h-4" />
                  <span>Contact Relationship: {currentPatient.emergencyContacts[0].relationship}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};