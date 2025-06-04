import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { MainNav } from "@/components/main-nav";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const navItems = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Features",
      href: "/features",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={navItems} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "neutral", size: "sm" }),
                "px-4"
              )}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ size: "sm" }),
                "px-4"
              )}
            >
              Sign Up
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}