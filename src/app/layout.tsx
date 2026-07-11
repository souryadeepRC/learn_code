import '@/app/globals.css';
import { AppShell } from '@/components/common/AppShell';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppProviders } from '@/providers/AppProviders';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Skill Track AI',
  description: 'Advanced Tech Learning & Practice Portal with Skill Track AI',
  icons: {
    icon: '/appLogo.png',
    shortcut: '/appLogo.png',
    apple: '/appLogo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} h-full antialiased`}
    >
      <body>
        <AppProviders>
          <ThemeProvider>
            <AppShell>{children}</AppShell>
          </ThemeProvider>
        </AppProviders>
      </body>
    </html>
  );
};
export default RootLayout;
