import { cn } from '@/root/src/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

const contentVariants = cva(
  'py-4 md:py-6 px-4 md:px-10 max-w-6xl mx-auto space-y-2 w-full min-w-0 max-w-full text-muted-foreground leading-relaxed transition-colors',
  {
    variants: {
      size: {
        xs: 'text-xs sm:text-sm',
        sm: 'text-sm sm:text-base',
        default: 'text-base sm:text-lg',
        lg: 'text-lg sm:text-xl',
        xl: 'text-xl sm:text-2xl',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export type ContentProps = React.HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof contentVariants> & {
    /** Overrides the rendered HTML tag (defaults to <p>). */
    as?: 'p' | 'div' | 'span' | 'article' | 'section' | 'main';
    children?: React.ReactNode;
  };

/**
 * Content — reusable typography component for body text and paragraphs.
 * Supports size options and consumer class overrides via className.
 */
export const Content = ({
  className,
  size = 'default',
  as: Tag = 'main',
  children,
  ...props
}: ContentProps) => {
  return (
    <Tag className={cn(contentVariants({ size }), className)} {...props}>
      {children}
    </Tag>
  );
};
