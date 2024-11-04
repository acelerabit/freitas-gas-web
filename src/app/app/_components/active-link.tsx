import { useNotification } from "@/contexts/notification-context";
import Link from "next/link";
import { ReactNode } from "react";

interface ActiveLinkProps {
  title: string;
  icon: ReactNode;
  href: string;
}

export function ActiveLink({ title, icon, href }: ActiveLinkProps) {
  const {messages} = useNotification()
  return (
    <Link
      className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      href={href}
    >
      <p className="flex gap-3">
        {icon}
        {title}
      </p>

     {href === '/app/notifications' && messages.length > 0 && <div className="h-2.5 w-2.5 rounded-full bg-red-600" />}
    </Link>
  );
}
