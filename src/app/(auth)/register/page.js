"use client";

import { useRouter } from "next/navigation";
import RegisterForm from "@/components/RegisterForm";
import useRegisterStore from "@/store/useRegisterStore";

export default function RegisterPage() {
  const router = useRouter();
  const isLoading = useRegisterStore((state) => state.isLoading);
  const errorMessage = useRegisterStore((state) => state.errorMessage);
  const setLoading = useRegisterStore((state) => state.setLoading);
  const setErrorMessage = useRegisterStore((state) => state.setErrorMessage);

  async function onSubmit(data) {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMessage(result.error || "Registration failed");
      } else {
        router.push("/login");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <RegisterForm onSubmit={onSubmit} isLoading={isLoading} errorMessage={errorMessage} />
    </div>
  );
}
