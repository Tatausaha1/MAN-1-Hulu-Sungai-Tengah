"use client";
import * as React from "react";
import Link from "next/link";
import { School, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSupabaseAuth } from "@/lib/hooks/use-supabase-auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  useSupabaseAuth();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex transition-all duration-300 ease-in-out",
          isCollapsed && "w-16"
        )}
      >
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <School className="h-5 w-5 transition-all group-hover:scale-110" />
            </div>
            {!isCollapsed && <span className="">MAN 1 Hulu Sungai Tengah</span>}
          </Link>
        </div>
        <div className="flex-1 mt-4">
          <SidebarNav isCollapsed={isCollapsed} />
        </div>
        <div className="mt-auto p-4">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="w-full" onClick={() => setIsCollapsed(!isCollapsed)}>
                  {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {isCollapsed ? "Expand" : "Collapse"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>
      <div
        className={cn(
          "flex flex-col sm:gap-4 sm:py-4 sm:pl-60 transition-all duration-300 ease-in-out",
          isCollapsed && "sm:pl-16"
        )}
      >
        <div className="px-4 sm:px-0 pt-4 sm:pt-0">
         <Header />
        </div>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
