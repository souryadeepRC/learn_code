import { cn } from '@/root/src/utils';
import Link from 'next/link';

type Props = {
  className?: string;
};

/**
 * AppHeaderLogo — "Learn**Code**" wordmark linked to the home page.
 * The second word uses the primary brand colour for instant recognition.
 */
export const AppHeaderLogo = ({ className }: Props) => {
  return (
    <Link
      href="/"
      aria-label="LearnCode — go to home page"
      className={cn(
        'flex items-center gap-2 select-none outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md',
        className
      )}
    >
      {/* Icon mark */}
      <span
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black',
          'bg-gradient-to-br from-primary to-secondary text-primary-foreground',
          'shadow-lg shadow-primary/20'
        )}
        aria-hidden="true"
      >
        LC
      </span>

      {/* Word mark */}
      <span className="text-lg font-bold tracking-tight text-foreground">
        Learn
        <span className="text-primary">Code</span>
      </span>
    </Link>
  );
};
