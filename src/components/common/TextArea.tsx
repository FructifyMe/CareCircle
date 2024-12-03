import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          {label}
        </label>
        <textarea
          ref={ref}
          className={`w-full px-3 py-2 rounded-lg border border-gray-200 
            focus:outline-none focus:ring-2 focus:ring-primary-500 
            ${error ? 'border-red-300' : ''} 
            ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';