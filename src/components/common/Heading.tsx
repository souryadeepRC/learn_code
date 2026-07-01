import { cn } from '@/root/src/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

const headingVariants = cva(
  'font-heading font-bold tracking-tight text-primary transition-colors',
  {
    variants: {
      variant: {
        h1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight sm:leading-tight md:leading-tight lg:leading-tight',
        h2: 'text-2xl sm:text-3xl md:text-4xl leading-snug',
        h3: 'text-xl sm:text-2xl md:text-3xl leading-snug',
        h4: 'text-lg sm:text-xl md:text-2xl leading-normal',
        h5: 'text-base sm:text-lg md:text-xl leading-normal font-semibold',
        h6: 'text-sm sm:text-base md:text-lg leading-normal font-semibold',
      },
    },
    defaultVariants: {
      variant: 'h1',
    },
  }
);

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingVariants> & {
    /** Overrides the rendered HTML tag while retaining the visual variant styling. */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
    children?: React.ReactNode;
  };

/**
 * Heading — reusable typography component for h1–h6 headings.
 * Supports responsive font sizes and consumer class overrides via className.
 */
export const Heading = ({
  className,
  variant = 'h1',
  as,
  children,
  ...props
}: HeadingProps) => {
  const Tag = as || variant || 'h1';

  return (
    <Tag className={cn(headingVariants({ variant }), className)} {...props}>
      {children}
    </Tag>
  );
};
