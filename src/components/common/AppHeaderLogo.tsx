import { cn } from '@/root/src/utils';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  className?: string;
};

/**
 * AppHeaderLogo — "Skill Track **AI**" wordmark linked to the home page.
 * The second word uses the primary brand colour for instant recognition.
 */
export const AppHeaderLogo = ({ className }: Props) => {
  return (
    <Link
      href="/"
      aria-label="Skill Track AI — go to home page"
      className={cn(
        'flex items-center gap-2 select-none outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md',
        className
      )}
    >
      {/* Icon mark */}
      <Image
        src="/appLogo.png"
        alt="Skill Track AI Logo"
        width={60}
        height={60}
        className="h-20 w-20 object-contain shrink-0"
        //priority
      />

      {/* Word mark */}
      <span className="text-lg font-bold tracking-tight text-foreground">
        Skill Track <span className="text-primary">AI</span>
      </span>
    </Link>
  );
};
