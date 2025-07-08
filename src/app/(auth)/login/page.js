"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import LoginForm from "@/components/LoginForm";
import useAuthStore from "@/store/useAuthStore";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser(session.user);
      if (session.user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (session.user.role === "student") {
        router.push("/profile");
      } else {
        router.push("/");
      }
    }
  }, [status, session, router, setUser]);

  async function onSubmit(data) {
    setIsLoading(true);
    setErrorMessage("");

    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    setIsLoading(false);

    if (res?.error) {
      setErrorMessage(res.error);
      toast.error(res.error, {
        style: {
          background: '#272727',
          color: '#EFD09E',
          border: '1px solid #ef4444',
        },
      });
    } else {
      toast.success("Login successful!", {
        style: {
          background: '#272727',
          color: '#EFD09E',
          border: '1px solid #D4AA7D',
        },
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster position="top-center" />
      <LoginForm onSubmit={onSubmit} isLoading={isLoading} errorMessage={errorMessage} />
    </div>
  );
}
