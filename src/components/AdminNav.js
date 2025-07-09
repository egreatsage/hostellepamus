// src/components/AdminNav.js
import Link from 'next/link'
import React from 'react'

const AdminNav = () => {
  return (
    <div className='bg-white flex justify-evenly items-center p-4 '>
        <Link href="/admin/dashboard" className='text-white bg-green-600 hover:bg-green-800 px-7 py-1 rounded-2xl transition-colors'>Dashboard</Link>
        <Link href="/admin//bookings" className='text-white bg-green-600 hover:bg-green-800 px-7 py-1 rounded-2xl transition-colors'>Bookings</Link>
        <Link href="/admin/rooms" className='text-white bg-green-600 hover:bg-green-800 px-7 py-1 rounded-2xl transition-colors'>Rooms</Link>
    </div>
  )
}

export default AdminNav