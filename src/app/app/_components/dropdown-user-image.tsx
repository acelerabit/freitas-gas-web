"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/user-context";

export function DropdownUserImage() {
  const { user } = useUser();

  return (
    <>
      <Avatar>
        <AvatarImage className="cursor-pointer" src={user?.avatarUrl} />
        <AvatarFallback className="cursor-pointer uppercase hover:bg-slate-200">{user?.name.substring(0, 2)}</AvatarFallback>
      </Avatar>
    </>
  );
}
