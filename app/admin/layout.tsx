"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Layers,
  Briefcase,
  FolderKanban,
  Award,
  Calendar,
  LayoutDashboard,
  LogOut,
  ArrowLeft,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/skills", label: "Skills", icon: Layers },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/certifications", label: "Certs", icon: Award },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/blog", label: "Blog", icon: FileText },
];

import { FloatingDock } from "@/components/ui/floating-dock";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const dockItems = navItems.map((item) => ({
    title: item.label,
    icon: <item.icon className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
    href: item.href,
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar — desktop only */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden md:flex h-screen sticky top-0 border-r border-border/50 flex flex-col overflow-hidden shrink-0"
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50 flex items-center gap-3 min-h-[60px]">
          <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center text-xs font-bold shrink-0">
            CA
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <p className="font-roashe text-sm">Admin</p>
                <p className="text-[10px] font-mono text-muted-foreground">CMS</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                } ${collapsed ? "justify-center px-0" : ""}`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-2 border-t border-border/50 space-y-0.5">
          <Link
            href="/"
            title={collapsed ? "View Site" : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors ${collapsed ? "justify-center px-0" : ""}`}
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {!collapsed && <span>View Site</span>}
          </Link>
          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full ${collapsed ? "justify-center px-0" : ""}`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full ${collapsed ? "justify-center px-0" : ""}`}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4 shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto pb-24 md:pb-8 relative">
        {children}

        {/* Floating Dock for Mobile */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
          <FloatingDock items={dockItems} />
        </div>
      </main>
    </div>
  );
}
