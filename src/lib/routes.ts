export interface NavRoute {
  href: string;
  label: string;
  icon: string;
  section: "main" | "tools" | "config";
}

export const NAV_ROUTES: NavRoute[] = [
  // Main product surfaces
  { href: "/", label: "Dashboard", icon: "grid", section: "main" },
  { href: "/atlas", label: "Atlas", icon: "map", section: "main" },
  { href: "/projects", label: "Projects", icon: "folder", section: "main" },
  { href: "/details", label: "Details", icon: "layers", section: "main" },
  { href: "/shop-drawings", label: "Shop Drawings", icon: "blueprint", section: "main" },
  { href: "/manufacturers", label: "Manufacturers", icon: "factory", section: "main" },
  { href: "/observations", label: "Observations", icon: "eye", section: "main" },
  { href: "/artifacts", label: "Artifacts", icon: "file", section: "main" },

  // Tools
  { href: "/tools", label: "Tools", icon: "wrench", section: "tools" },
  { href: "/viewer", label: "Viewer", icon: "scan", section: "tools" },

  // Config
  { href: "/settings/ai", label: "AI Settings", icon: "cpu", section: "config" },
  { href: "/branding", label: "Branding", icon: "palette", section: "config" },
];
