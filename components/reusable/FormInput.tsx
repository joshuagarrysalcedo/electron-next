import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';

/**
 * FormInput - A styled input component with label and error handling
 * 
 * @author Joshua Salcedo
 */
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
}

export function FormInput({
  label,
  error,
  description,
  className,
  id,
  ...props
}: FormInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label
          htmlFor={inputId}
          className={cn(error ? 'text-destructive' : '')}
        >
          {label}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Input
        id={inputId}
        className={cn(
          error ? 'border-destructive focus-visible:ring-destructive' : '',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}