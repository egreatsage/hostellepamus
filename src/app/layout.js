'use client';

import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
         <Toaster position='top-center' />
        <SessionProvider>
          <Navbar/>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}