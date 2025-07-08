"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import LoginForm from "@/components/LoginForm";
import useAuthStore from "@/store/useAuthStore";

export default function AdminLoginPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

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
    } else {
      // Fetch session from cookies
      const userCookie = Cookies.get("next-auth.session-token") || Cookies.get("__Secure-next-auth.session-token");
      if (userCookie) {
        // Decode cookie to get user info (simplified, in real app use JWT decode)
        // For now, fetch session from API
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        if (sessionData?.user) {
          setUser(sessionData.user);
          if (sessionData.user.role === "admin") {
            router.push("/admin/dashboard");
          } else if (sessionData.user.role === "student") {
            router.push("/profile");
          } else {
            router.push("/");
          }
        } else {
          setErrorMessage("Failed to get user session");
        }
      } else {
        setErrorMessage("No session cookie found");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm onSubmit={onSubmit} isLoading={isLoading} errorMessage={errorMessage} />
    </div>
  );
}
