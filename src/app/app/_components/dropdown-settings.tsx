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
          className="ml-auto rounded-full w-8 h-8"
          size="icon"
          variant="ghost"
        >
          <DropdownUserImage />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/app/profile">Configurações</Link>
        </DropdownMenuItem>
        <LogoutDropdownItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
