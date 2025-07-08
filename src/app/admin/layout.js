import AdminNav from '@/components/AdminNav';
import React from 'react';

export default function RoomsLayout({ children }) {
  return (
    <>
    <AdminNav/>
      {children}
    </>
  );
}