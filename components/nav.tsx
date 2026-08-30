"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/insights", label: "Insights" },
];

export default function Nav() {
  const pathname = usePathname();

  if (pathname.startsWith("/login")) return null;

  return (
    <nav className="fixed bottom-0 inset-x-0 border-t border-border bg-surface/95 backdrop-blur">
      <ul className="flex justify-between overflow-x-auto text-sm">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <li key={link.href} className="flex-1">
              <Link
                href={link.href}
                className={`flex flex-col items-center justify-center py-3 px-1 whitespace-nowrap ${
                  active ? "text-accent font-medium" : "text-ink-muted"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
