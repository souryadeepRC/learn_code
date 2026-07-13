import { cn } from '@/root/src/utils';
import * as React from 'react';

type InputProps = React.ComponentProps<'input'> & {
  variant?: 'default' | 'underline';
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', required, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'text-xs md:text-sm p-4',
          'flex h-9 w-full rounded-md border-1 border-primary/10 bg-transparent px-3 py-1 text-primary transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus:border-foreground focus-visible:border-primary focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all',
          variant === 'underline' &&
            'rounded-none border-0 border-b border-primary/20 shadow-none focus-visible:border-ring focus-visible:ring-0 focus-visible:ring-offset-0',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
