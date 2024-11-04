"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

export function LogoutDropdownItem() {
  async function logout() {
    await signOut({
      redirect: false,
    });

    window.location.href = "/";
  }
  return (
    <DropdownMenuItem className="cursor-pointer" onClick={logout}>
      Sair
    </DropdownMenuItem>
  );
}
