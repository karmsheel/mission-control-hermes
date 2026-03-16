"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme, cn } from "@/lib/DesignSystem";
import { 
  Terminal, 
  LayoutDashboard, 
  Activity, 
  Settings,
  GitBranch,
  PenTool,
  Calendar,
  Zap,
  Brain,
  Users
} from "lucide-react";

const navItems = [
  { href: "/", label: "Tasks", icon: LayoutDashboard, description: "Task Board" },
  { href: "/team", label: "Team", icon: Users, description: "Agent Team" },
  { href: "/content", label: "Content", icon: PenTool, description: "Content Pipeline" },
  { href: "/calendar", label: "Calendar", icon: Calendar, description: "Schedule" },
  { href: "/memories", label: "Memories", icon: Brain, description: "Agent Memories" },
  { href: "/metrics", label: "Metrics", icon: Activity, description: "Agent Health" },
  { href: "/logs", label: "Logs", icon: Terminal, description: "System Logs" },
  { href: "/connections", label: "Connections", icon: GitBranch, description: "Integrations" },
  { href: "/settings", label: "Settings", icon: Settings, description: "Configuration" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { colors, cn } = useTheme();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen w-16 flex flex-col items-center py-4 z-40",
        "border-r"
      )}
      style={{ 
        backgroundColor: colors.backgroundAlt,
        borderColor: colors.border,
      }}
    >
      {/* Logo */}
      <div className="mb-6">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center border overflow-hidden"
          style={{ 
            backgroundColor: `${colors.primary}20`,
            borderColor: `${colors.primary}50`,
          }}
        >
          <Image 
            src="/sky-blue-logo.png" 
            alt="Sky Blue" 
            width={36} 
            height={36}
            className="object-cover"
          />
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center justify-center w-12 h-12 rounded-lg",
                "transition-all duration-200"
              )}
              style={isActive ? {
                backgroundColor: `${colors.primary}20`,
                borderColor: colors.primary,
                color: colors.primary,
              } : {
                color: "#71717a",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  Object.assign(e.currentTarget.style, {
                    color: colors.primary,
                    borderColor: `${colors.primary}50`,
                  });
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  Object.assign(e.currentTarget.style, {
                    color: "#71717a",
                    borderColor: "transparent",
                  });
                }
              }}
            >
              <Icon className="w-5 h-5" />
              
              {/* Tooltip */}
              <div 
                className="absolute left-full ml-2 px-2 py-1 border rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                style={{ 
                  backgroundColor: colors.backgroundAlt,
                  borderColor: `${colors.primary}30`,
                  color: colors.primary,
                }}
              >
                {item.label}
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r" 
                  style={{ backgroundColor: colors.primary }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Status indicator */}
      <div className="mt-auto">
        <div 
          className="flex items-center gap-1 text-xs"
          style={{ color: colors.primary }}
        >
          <span 
            className="w-2 h-2 rounded-full animate-pulse" 
            style={{ backgroundColor: colors.primary }}
          />
          <span>ONLINE</span>
        </div>
      </div>
    </aside>
  );
}
