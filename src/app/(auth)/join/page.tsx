import { AuthTabs } from '@/components/features/auth/AuthTabs';
import Link from 'next/link';

const JoinPage = () => {
  return (
    <main className="flex-1 flex flex-col md:flex-row w-full bg-background text-foreground transition-colors duration-300">
      <section className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        {/* Auth Form Container */}
        <div className="w-full max-w-md my-auto py-6">
          <Link href="/">Go Back</Link>
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome</h2>
            <p className="text-muted-foreground">
              Log in to your account or create a new one.
            </p>
          </div>

          <AuthTabs />
        </div>
      </section>
    </main>
  );
};

export default JoinPage;
