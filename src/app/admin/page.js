'use client'
import { useSession } from 'next-auth/react'
import React from 'react'

const AdminPage = () => {

   const { data: session, status } = useSession();
  return (
    <div className='text-gray-800 '>
        Welcome {''} {session?.data?.user?.email || 'Admin'}!
    </div>
  )
}

export default AdminPage