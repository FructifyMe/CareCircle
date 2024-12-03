import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';

interface PhotoUploadProps {
  onPhotoSelect: (file: File) => void;
  currentPhoto?: string;
  onPhotoClear?: () => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotoSelect,
  currentPhoto,
  onPhotoClear
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onPhotoSelect(acceptedFiles[0]);
    }
  }, [onPhotoSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    multiple: false
  });

  if (currentPhoto) {
    return (
      <div className="relative inline-block">
        <img
          src={typeof currentPhoto === 'string' ? currentPhoto : URL.createObjectURL(currentPhoto)}
          alt="Patient"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
        />
        {onPhotoClear && (
          <button
            onClick={onPhotoClear}
            className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-secondary-600" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        w-32 h-32 rounded-full border-2 border-dashed
        flex items-center justify-center cursor-pointer
        transition-colors
        ${isDragActive 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-gray-300 hover:border-primary-500 hover:bg-gray-50'}
      `}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <Upload className="w-6 h-6 text-secondary-400 mx-auto mb-2" />
        <p className="text-xs text-secondary-600">
          {isDragActive ? 'Drop photo here' : 'Upload photo'}
        </p>
      </div>
    </div>
  );
};