"use client";

import useRequireAuth from "@/hooks/useRequireAuth";

export default function AdminDashboardPage() {
  // const { user, loading } = useRequireAuth("admin");

  // // if (loading) {
  // //   return <div>Loading...</div>;
  // // }

  // if (!user) {
  //   return null; // Redirecting
  // }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {/* <p>Welcome, {user.email}</p> */}
      {/* Add admin dashboard content here */}
    </div>
  );
}
