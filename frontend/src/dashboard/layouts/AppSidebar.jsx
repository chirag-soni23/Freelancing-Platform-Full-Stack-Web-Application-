import {
  SettingsIcon,
  User,
  LogOut,
  Coins,
  LayoutGrid,
  Briefcase,
  Search,
  FileText,
  MessageCircle,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const BASE = "/dashboard";

/* =========================
   CLIENT SIDEBAR ITEMS
========================= */

const clientItems = [
  {
    title: "Main",
    items: [
      {
        label: "Dashboard",
        icon: LayoutGrid,
        path: `${BASE}`,
      },
    ],
  },

  {
    title: "Management",
    items: [
      {
        label: "Category",
        icon: Coins,
        path: `${BASE}/category`,
      },

      {
        label: "Jobs",
        icon: Briefcase,
        path: `${BASE}/jobs`,
      },
    ],
  },

  {
    title: "Communication",
    items: [
      {
        label: "Chats",
        icon: MessageCircle,
        path: `${BASE}/chats`,
      },
    ],
  },
];

/* =========================
   FREELANCER SIDEBAR ITEMS
========================= */

const freelancerItems = [
  {
    title: "Main",
    items: [
      {
        label: "Dashboard",
        icon: LayoutGrid,
        path: `${BASE}`,
      },
    ],
  },

  {
    title: "Freelancer",
    items: [
      {
        label: "Find Jobs",
        icon: Search,
        path: `${BASE}/find-jobs`,
      },

      {
        label: "My Proposals",
        icon: FileText,
        path: `${BASE}/proposals`,
      },
    ],
  },

  {
    title: "Communication",
    items: [
      {
        label: "Chats",
        icon: MessageCircle,
        path: `${BASE}/chats`,
      },
    ],
  },
];

export function AppSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();

  /* =========================
     ROLE BASED SIDEBAR
  ========================= */

  const sidebarItems =
    user?.role === "client" ? clientItems : freelancerItems;

  const handleLogout = () => {
    localStorage.removeItem("activeApp");
    navigate("/login");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* LOGO */}

          <div className="flex border-b items-center gap-2 h-14 px-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              P
            </div>

            <div>
              <h1 className="font-bold text-lg">Visitor Hub</h1>

              <p className="text-[10px] text-muted-foreground uppercase">
                Smart Management
              </p>
            </div>
          </div>

          {/* NAVIGATION */}

          <nav className="flex-1 pb-3 px-3 mt-2 overflow-y-auto">
            {sidebarItems.map((section, index) => (
              <div key={index} className="mb-4">
                <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase">
                  {section.title}
                </p>

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                      <NavLink
                        key={item.label}
                        to={item.path}
                        className={`w-full dark:text-white flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-secondary"
                        }`}
                      >
                        <item.icon className="h-[18px] w-[18px]" />

                        <span className="truncate">{item.label}</span>

                        {item.badge && (
                          <span
                            className={`ml-auto flex items-center justify-center 
                            min-w-[20px] h-[20px] text-[10px] font-semibold 
                            rounded-full ${item.badgeColor}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* PROFILE */}
          <div className="border-t border-border px-3 py-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer hover:bg-secondary p-2 rounded-lg transition">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                    {user?.name?.charAt(0) || "U"}
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {user?.name || "User"}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {user?.email || "user@email.com"}
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48 ml-2 mb-2">
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </>
  );
}