// src/app/page.js (Add this inside the return statement)
'use client'
import { useSession } from 'next-auth/react';
import React from 'react'
import { signOut } from 'next-auth/react';
import Link from 'next/link';

const HomePage = () => {

   const { data: session, status } = useSession();

   const handleSignOut = () => {
      signOut({ callbackUrl: '/' });
     alert("User signed out");
   };

  return (
    <div>
      <h1 className='text-2xl font-bold text-gray-800'>Welcome to Lepamus!</h1>
      <p className='text-gray-600 mt-4'>
        {status === 'authenticated' ? 
          `Hello, ${session.user.email || 'User'}!` : 
          'Please log in to access more features.'}
      </p>

     <p>
       {status === 'authenticated'?
           `You are logged in as an ${session.user.role || 'Role'}`:
           <Link href='/login' className='text-blue-500 hover:underline'>
             Log in
           </Link>
       }
     </p>
      <p className='text-gray-600 mt-2'>
        This is the home page of Lepamus, your go-to platform for managing your tasks efficiently.
      </p>
      
      {status === 'authenticated' && session.user.role === 'student' && (
        <Link href="/rooms">
            <button className='mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'>
                View Available Rooms
            </button>
        </Link>
      )}

      {status === 'authenticated' && (
        <button 
          onClick={handleSignOut} 
          className='mt-4 ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Sign Out
        </button>
      )}
    </div>
  )
}

export default HomePage