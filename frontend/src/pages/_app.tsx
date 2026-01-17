import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Initialize NProgress
NProgress.configure({ showSpinner: false });

// Initialize Inter font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Layout component
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} font-sans min-h-screen flex flex-col`}>
      <main className="flex-grow">{children}</main>
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Handle route change events for NProgress
  useEffect(() => {
    const handleStart = () => NProgress.start();
    const handleComplete = () => NProgress.done();

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router.events]);

  // Only render the app when mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render the app until mounted
  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <SocketProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                  },
                }}
              />
            </SocketProvider>
          </AuthProvider>
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          )}
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
