"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useBranding } from "@/components/branding/BrandingProvider";
import { NAV_ROUTES } from "@/lib/routes";
import { NavIcon } from "./NavIcon";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { branding } = useBranding();
  const [collapsed, setCollapsed] = useState(false);

  const mainRoutes = NAV_ROUTES.filter((r) => r.section === "main");
  const toolRoutes = NAV_ROUTES.filter((r) => r.section === "tools");
  const configRoutes = NAV_ROUTES.filter((r) => r.section === "config");

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  function navLink(item: (typeof NAV_ROUTES)[0]) {
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        title={collapsed ? item.label : undefined}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          active
            ? "text-white"
            : "text-white/60 hover:text-white hover:bg-white/10"
        }`}
        style={active ? { backgroundColor: "rgba(255,255,255,0.15)" } : undefined}
      >
        <NavIcon name={item.icon} className="w-4 h-4 shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: branding.colors.surface }}>
      {/* Sidebar */}
      <aside
        className={`flex flex-col shrink-0 border-r transition-all duration-200 ${
          collapsed ? "w-14" : "w-52"
        }`}
        style={{ backgroundColor: branding.colors.primary, borderColor: "rgba(255,255,255,0.1)" }}
      >
        {/* Logo */}
        <div className="px-3 py-4 flex items-center gap-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          {branding.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={branding.logoUrl}
              alt={branding.appName || "Logo"}
              className="h-6 w-auto shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
              {branding.appName.charAt(0) || "A"}
            </div>
          )}
          {!collapsed && (
            <span className="font-semibold text-white text-sm truncate">{branding.appName}</span>
          )}
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {!collapsed && (
            <div className="text-[10px] uppercase tracking-wider text-white/30 px-3 mb-1">Product</div>
          )}
          {mainRoutes.map(navLink)}

          <div className="pt-3">
            {!collapsed && (
              <div className="text-[10px] uppercase tracking-wider text-white/30 px-3 mb-1">Tools</div>
            )}
            {toolRoutes.map(navLink)}
          </div>
        </nav>

        {/* Config Nav + Collapse */}
        <div className="px-2 py-3 border-t space-y-0.5" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          {!collapsed && (
            <div className="text-[10px] uppercase tracking-wider text-white/30 px-3 mb-1">Config</div>
          )}
          {configRoutes.map(navLink)}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 w-full transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
              {collapsed
                ? <path d="M9 18l6-6-6-6" />
                : <path d="M15 18l-6-6 6-6" />
              }
            </svg>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>

        {/* Company */}
        {!collapsed && (
          <div className="px-3 pb-3 text-[10px] text-white/25 truncate">
            {branding.companyName}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
