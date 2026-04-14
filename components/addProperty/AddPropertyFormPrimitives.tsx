import React from 'react';

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value?: unknown;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  children?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
  value,
  onChange,
  children
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children ? (
      children
    ) : (
      <input
        type={type}
        name={name}
        id={name}
        required={required}
        placeholder={placeholder}
        value={value ?? ''}
        onChange={onChange}
        className="mt-1 block w-full input-style"
      />
    )}
  </div>
);
