import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import GlobalSyncScreen from './components/GlobalSyncScreen'; // <-- 1. Import this

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SocialMetrics | Analytics Dashboard',
  description: 'Cross-channel social media performance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalSyncScreen> {/* <-- 2. Wrap the entire app */}
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="ml-64 flex flex-1 flex-col bg-[#f8f9fa]">
              <Topbar />
              <main className="flex-1 p-8">
                {children}
              </main>
            </div>
          </div>
        </GlobalSyncScreen>
      </body>
    </html>
  );
}