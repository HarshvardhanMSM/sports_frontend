"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import OtpVerificationForm from "@/components/auth/OtpVerificationForm";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const handleSuccess = () => {
    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  const handleBack = () => {
    router.push("/forgot-password");
  };

  if (!email) {
    router.push("/forgot-password");
    return null;
  }

  return (
    <AuthLayout
      title="Check your email"
      subtitle="Enter the 6-digit code sent to your email."
    >
      <OtpVerificationForm
        email={email}
        onSuccess={handleSuccess}
        onBack={handleBack}
      />
    </AuthLayout>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpContent />
    </Suspense>
  );
}
