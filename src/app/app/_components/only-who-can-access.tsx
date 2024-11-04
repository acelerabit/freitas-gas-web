'use client'

import LoadingAnimation from "@/app/app/_components/loading-page";
import { useUser } from "@/contexts/user-context";
import { redirectToBase } from "@/utils/routes-after-login";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface OnlyAdminProps {
  children: ReactNode;
  rolesCanAccess: string[]
}

export function OnlyRolesCanAccess({ children, rolesCanAccess }: OnlyAdminProps) {
  const router = useRouter();
  const { user, loadingUser } = useUser();

  if (loadingUser && !user) {
    return <LoadingAnimation />;
  }

  if (user && !rolesCanAccess.includes(user.role)) {
    router.push(redirectToBase(user.role));
  }

  return <>{children}</>;
}
