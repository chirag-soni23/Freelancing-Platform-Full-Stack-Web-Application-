import {
  Menu,
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

export function TopNavbar({ isSidebarOpen, onToggleSidebar }) {
  const { theme, toggle } = useTheme();

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm shrink-0">
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

      <div className="flex items-center gap-1">
        <button
          onClick={toggle}
          className="p-2 rounded-lg dark:text-white text-muted-foreground hover:bg-secondary transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
        <Link to={"/"}
          className="p-2 rounded-lg dark:text-white text-muted-foreground hover:bg-secondary transition-colors"
        >
         <Home className="w-4 h-4"/>
        </Link>
        <button className="p-2 dark:text-white rounded-lg text-muted-foreground hover:bg-secondary transition-colors relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
        </button>
        <button className="p-2 dark:text-white rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
          <Settings className="h-4 w-4" />
        </button>
        <div className="ml-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
          A
        </div>
      </div>
    </header>
  );
}
