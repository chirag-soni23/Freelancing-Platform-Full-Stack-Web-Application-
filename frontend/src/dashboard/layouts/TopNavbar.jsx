import {
  Search,
  Bell,
  Settings,
  Moon,
  Sun,
  SidebarOpenIcon,
  SidebarCloseIcon,
  Home,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/useTheme";
import { Link } from "react-router-dom";

import { useEffect, useRef } from "react";

import { socket } from "@/lib/socket";

import { useNotification } from "@/hooks/useNotification";

import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

export function TopNavbar({ isSidebarOpen, onToggleSidebar }) {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const queryClient = useQueryClient();
  const { unreadCount } = useNotification();
  const audioRef = useRef(null);

  // realtime notification
  useEffect(() => {
    audioRef.current = new Audio("/notification.mpeg");

    socket.on(
      "newNotification",

      (data) => {
        console.log("Notification:", data);

        // play sound
        audioRef.current?.play().catch((err) => console.log(err));

        // refresh notification query
        queryClient.invalidateQueries({
          queryKey: ["notifications"],
        });
      },
    );

    return () => {
      socket.off("newNotification");
    };
  }, [queryClient]);

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm shrink-0">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 dark:text-white rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
        >
          {isSidebarOpen ? (
            <SidebarOpenIcon className="h-5 w-5" />
          ) : (
            <SidebarCloseIcon className="h-5 w-5" />
          )}
        </button>

        <div className="hidden dark:text-white sm:flex items-center relative w-[240px]">
          <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search anything..."
            className="pl-8 rounded-sm pr-10 h-9 bg-secondary border-border focus-visible:ring-1"
          />

          <kbd className="absolute right-2 text-[10px] bg-background/60 px-1.5 py-0.5 rounded font-mono border border-border">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-1.5 bg-background/50 backdrop-blur-md p-1.5 rounded-xl border border-border/40 shadow-sm">
        {/* Theme Toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg dark:text-zinc-200 text-zinc-600 hover:bg-secondary hover:text-foreground active:scale-95 transition-all duration-200"
          title={
            theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 stroke-[1.75]" />
          ) : (
            <Moon className="h-4 w-4 stroke-[1.75]" />
          )}
        </button>

        {/* Home */}
        <Link
          to="/"
          className="p-2 rounded-lg dark:text-zinc-200 text-zinc-600 hover:bg-secondary hover:text-foreground active:scale-95 transition-all duration-200"
        >
          <Home className="w-4 h-4 stroke-[1.75]" />
        </Link>

        {/* Notification */}
        {user?.data.role === "freelancer" && (
          <Link
            to={"/dashboard/notifications"}
            className="relative rounded-lg p-2 dark:text-zinc-200 text-zinc-600 hover:bg-secondary hover:text-foreground active:scale-95 transition-all duration-200"
          >
            <Bell className="h-4 w-4 stroke-[1.75] relative z-10" />

            {unreadCount > 0 && (
              <span
                className="
      absolute
      -top-1.5
      -right-1.5
      min-w-[18px]
      h-[18px]
      px-1
      rounded-full
      bg-red-500
      text-white
      text-[9px]
      font-semibold
      flex
      items-center
      justify-center
      ring-2
      ring-background
      shadow-sm
      z-20
      animate-pulse
    "
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
        )}
        {/* Settings */}
        <button className="p-2 dark:text-zinc-200 text-zinc-600 hover:bg-secondary rounded-lg hover:text-foreground active:scale-95 transition-all duration-200">
          <Settings className="h-4 w-4 stroke-[1.75]" />
        </button>

        {/* Divider */}
        <div className="h-4 w-[1px] bg-border/60 mx-1" />

        {/* Avatar Button */}
        <button className="relative ml-0.5 w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 text-primary border border-primary/20 flex items-center justify-center text-xs font-semibold tracking-wider transition-all duration-200 focus:ring-2 focus:ring-primary/40 active:scale-95">
          A
        </button>
      </div>
    </header>
  );
}
