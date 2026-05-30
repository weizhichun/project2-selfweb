"use client";

import { useAuth } from "@/hooks/use-auth";
import { LoginModal } from "./LoginModal";
import { SetPasswordModal } from "./SetPasswordModal";
import { Loader2 } from "lucide-react";

interface ProtectedPageProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ProtectedPage({
  children,
  requireAuth = true,
}: ProtectedPageProps) {
  const { isAuthenticated, hasPassword, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!requireAuth) {
    return <>{children}</>;
  }

  if (!hasPassword) {
    return <SetPasswordModal />;
  }

  if (!isAuthenticated) {
    return <LoginModal />;
  }

  return <>{children}</>;
}
