"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Dumbbell,
  Ticket,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/schedule", label: "Orarend", icon: Calendar },
  { href: "/admin/bookings", label: "Foglalasok", icon: BookOpen },
  { href: "/admin/class-types", label: "Oratipusok", icon: Dumbbell },
  { href: "/admin/passes", label: "Berletek", icon: Ticket },
  { href: "/admin/settings", label: "Beallitasok", icon: Settings },
];

interface AdminSidebarProps {
  instructorName: string;
}

export default function AdminSidebar({ instructorName }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-border">
        <h2 className="font-serif text-xl font-semibold text-foreground">
          Nagomi
        </h2>
        <p className="text-xs text-muted-foreground mt-1">Admin</p>
      </div>

      <div className="px-4 py-3 border-b border-border">
        <p className="text-sm font-medium text-foreground truncate">
          {instructorName}
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 w-full transition-colors"
        >
          <LogOut size={18} />
          Kijelentkezes
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          Nagomi Admin
        </h2>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md hover:bg-muted text-foreground"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-foreground/20"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`lg:hidden fixed top-[57px] left-0 bottom-0 z-30 w-64 bg-card border-r border-border flex flex-col transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>

      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border">
        {sidebarContent}
      </div>
    </>
  );
}
