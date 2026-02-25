"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
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
  Share2,
  Settings,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/skills", label: "Skills", icon: Layers },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/certifications", label: "Certs", icon: Award },
  { href: "/admin/socials", label: "Socials", icon: Share2 },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/config", label: "Config", icon: Settings },
];

function NavItem({ 
  item, 
  isActive, 
  isCollapsed 
}: { 
  item: typeof navItems[0]; 
  isActive: boolean; 
  isCollapsed: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  return (
    <div className="relative group">
      <Link
        href={item.href}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
          isActive
            ? "bg-foreground text-background font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-accent",
          isCollapsed && "justify-center px-0"
        )}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <AnimatePresence>
          {!isCollapsed && (
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

      {/* Tooltip */}
      <AnimatePresence>
        {isCollapsed && isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-[10px] rounded pointer-events-none z-50 whitespace-nowrap"
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // must match SSR (no window)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // immediately correct on client mount
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const collapsed = isMobile || isDesktopCollapsed;

  // Keep :root --sidebar-w in sync with the sidebar state so vaul drawer
  // portals (rendered at <body> level) can read the correct offset.
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-w",
      collapsed ? "64px" : "240px"
    );
    return () => {
      document.documentElement.style.removeProperty("--sidebar-w");
    };
  }, [collapsed]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div
      className="h-screen bg-background flex overflow-hidden"
    >
      {/* Sidebar — fixed height, independently scrollable, above drawer overlay (z-50) */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="h-screen flex flex-col overflow-hidden shrink-0 z-50 bg-background border-r border-border/50 relative"
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50 flex items-center gap-3 min-h-[60px] shrink-0">
          <Link href="/" className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center text-xs font-bold shrink-0">
            CA
          </Link>
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

        {/* Nav items — only the nav scrolls if too many items */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto min-h-0">
          {navItems.map((item) => (
            <NavItem 
              key={item.href} 
              item={item} 
              isActive={pathname === item.href} 
              isCollapsed={collapsed} 
            />
          ))}
        </nav>

        {/* Bottom actions — always pinned to bottom */}
        <div className="p-2 border-t border-border/50 space-y-0.5 relative shrink-0">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
              collapsed && "justify-center px-0"
            )}
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {!collapsed && <span>View Site</span>}
          </Link>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>

          {/* Collapse toggle (Desktop only) */}
          <button
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            className={cn(
              "hidden md:flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full",
              collapsed && "justify-center px-0"
            )}
          >
            {isDesktopCollapsed ? (
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

      {/* Main content — independently scrollable. Drawers portal to <body> so they're not clipped here */}
      <main className="flex-1 h-screen overflow-y-auto relative">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
