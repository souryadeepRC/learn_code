import { AuthTabs } from '@/components/features/auth/AuthTabs';

const JoinPage = () => {
  return (
    <main className="flex-1 flex flex-col md:flex-row w-full bg-background text-foreground transition-colors duration-300">
      {/* ── Left Side Banner (Image) ── */}
      <section className="relative hidden md:flex flex-col flex-1 bg-muted overflow-hidden">
        {/* Placeholder for API image */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20" />

        {/* Mock background pattern / image placeholder */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop")',
          }}
        />

        <div className="relative z-10 flex flex-col p-12 mt-auto text-primary drop-shadow-md">
          <h1 className="text-4xl font-bold mb-4">Start Your Journey</h1>
          <p className="text-lg opacity-90 max-w-md">
            Join thousands of developers leveling up their skills with
            AI-powered learning paths.
          </p>
        </div>
      </section>

      {/* ── Right Side Form Area ── */}
      <section className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        {/* Auth Form Container */}
        <div className="w-full max-w-md my-auto py-6">
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
