'use client';
import AdminNav from '@/components/AdminNav';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function RoomsLayout({ children }) {
   const router = useRouter();
  const { data: session, status } = useSession();
  
   useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role !== 'admin') {
        router.push('/');
      }
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, router]);
  if (status === 'loading' || !session) {
    return <div className="flex items-center justify-center h-screen"><LoadingSpinner /></div>;
  }
  if (session?.user?.role !== 'admin') {
    return null;
  }
  return (
    <>
    <AdminNav/>
      {children}
    </>
  );
}