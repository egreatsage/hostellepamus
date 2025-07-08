"use client";

import useRequireAuth from "@/hooks/useRequireAuth";

export default function StudentProfilePage() {
  const { user, loading } = useRequireAuth("student");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Redirecting
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Student Profile</h1>
      <p>Welcome, {user.email}</p>
      {/* Add student profile content here */}
    </div>
  );
}
