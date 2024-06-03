import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { DropdownUserImage } from "./dropdown-user-image";
import { LogoutDropdownItem } from "./logout-dropdown-item";
import { Button } from "@/components/ui/button";

export function DropdownSettings() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
          size="icon"
          variant="ghost"
        >
          <DropdownUserImage />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/app/profile">Settings</Link>
        </DropdownMenuItem>
        <LogoutDropdownItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
