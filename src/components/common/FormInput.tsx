'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils';
import React from 'react';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: React.ReactNode;
  error?: string;
  description?: React.ReactNode;
  containerClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      label,
      required,
      error,
      description,
      className,
      containerClassName,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('space-y-1 md:space-y-1.5', containerClassName)}>
        {label && (
          <Label htmlFor={id} className="text-xs md:text-sm font-semibold">
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <Input
            ref={ref}
            id={id}
            required={required}
            className={cn(
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error &&
                'border-destructive focus:border-destructive focus-visible:border-destructive',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {description && !error && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {error && (
          <p className="text-xs font-medium text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
