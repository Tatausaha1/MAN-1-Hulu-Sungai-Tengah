"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, LayoutDashboard, QrCode, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/students", label: "Students", icon: Users },
  { href: "/dashboard/attendance", label: "Attendance", icon: QrCode },
  { href: "/dashboard/analysis", label: "Analysis", icon: BrainCircuit },
];

export function SidebarNav({ isMobile = false, isCollapsed = false }) {
  const pathname = usePathname();

  const navContent = NAV_ITEMS.map(({ href, label, icon: Icon }) => {
    const isActive = pathname === href;
    const linkClasses = cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
      {
        "bg-muted text-primary": isActive,
        "justify-center": isCollapsed,
      }
    );

    const linkContent = (
      <>
        <Icon className="h-4 w-4" />
        {!isCollapsed && <span>{label}</span>}
      </>
    );

    if (isCollapsed && !isMobile) {
      return (
        <TooltipProvider key={href} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={href} className={linkClasses}>
                {linkContent}
                <span className="sr-only">{label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Link href={href} key={href} className={linkClasses}>
        {linkContent}
      </Link>
    );
  });

  if (isMobile) {
    return <>{navContent}</>;
  }

  return <nav className="grid items-start gap-1 px-2 text-sm font-medium">{navContent}</nav>;
}
