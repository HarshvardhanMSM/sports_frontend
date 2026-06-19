"use client";

import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const handleSuccess = (email: string) => {
    router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
  };

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="No worries, we'll send you a reset code."
    >
      <ForgotPasswordForm onSuccess={handleSuccess} />
    </AuthLayout>
  );
}
