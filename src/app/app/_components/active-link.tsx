import Link from "next/link";
import { ReactNode } from "react";

interface ActiveLinkProps {
  title: string;
  icon: ReactNode;
  href: string;
}

export function ActiveLink({
  title,
  icon,
  href
}: ActiveLinkProps) {
  return (
    <Link
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      href={href}
    >
      {icon}
      {title}
    </Link>
  );
}
