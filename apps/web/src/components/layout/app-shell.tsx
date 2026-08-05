"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type LucideIcon, LogOut, Bell } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function AppShell({
  navItems,
  children,
  headerAction,
  notificationsHref = "/dashboard/notifications",
}: {
  navItems: NavItem[];
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  notificationsHref?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="flex min-h-svh bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface p-5 md:flex">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/helper" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-brand-500 text-white shadow-soft" : "text-muted hover:bg-surface-raised hover:text-foreground",
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex items-center gap-3 rounded-xl border border-border p-3">
          <Avatar src={user?.avatarUrl} name={user?.name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{user?.name ?? "Your account"}</p>
            <p className="truncate text-xs text-muted">{user?.phone}</p>
          </div>
          <button onClick={handleLogout} className="text-muted hover:text-danger" aria-label="Log out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <div className="md:hidden">
            <Logo iconOnly />
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-2">
            {headerAction}
            <Link href={notificationsHref} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground hover:bg-surface-raised" aria-label="Notifications">
              <Bell className="h-[18px] w-[18px]" />
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 md:pb-8 lg:px-8">{children}</main>

        <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-border bg-surface/95 py-2 backdrop-blur-md md:hidden">
          {navItems.slice(0, 5).map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/helper" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-medium", active ? "text-brand-500" : "text-muted")}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
