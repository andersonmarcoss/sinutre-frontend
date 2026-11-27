import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  className?: string;
  error?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  className = '',
  error,
  children,
}: FormFieldProps) {
  return (
    <div className={`form-control ${className}`}>
      <label className="label" htmlFor={htmlFor}>
        <span className="label-text">{label}</span>
      </label>
      {children}
      {error && <span className="text-error text-xs mt-1">{error}</span>}
    </div>
  );
}