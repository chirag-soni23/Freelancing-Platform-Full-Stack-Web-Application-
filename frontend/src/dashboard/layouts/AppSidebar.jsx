import {
  LayoutDashboard,
  BarChart3,
  CreditCard,
  Settings,
  SettingsIcon,
  User,
  LogOut,
  Users,
  Building2,
  Package,
  Tag,
  Gift,
  Heart,
  Calendar,
  HelpCircle,
  Globe,
  Lock,
  UserCheck2Icon,
  Calendar1,
  QrCode,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { NavLink, useLocation, useNavigate } from "react-router-dom";

const BASE = "/dashboard";

const adminItems = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: `${BASE}`,
      },
      {
        label: "Visitors",
        icon: Users,
        path: `${BASE}/visitors`,
      },
      {
        label: "Check-in",
        icon: UserCheck2Icon,
        path: `${BASE}/check-in`,
      },
      {
        label: "Pre-registration",
        icon: Calendar1,
        path: `${BASE}/pre-registration`,
      },
      {
        label: "QR Scanner",
        icon: QrCode,
        path: `${BASE}/qr-scanner`,
      },
    ],
  },
];

export function AppSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

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
          {/* Logo */}
          <div className="flex border-b items-center gap-2 h-14 px-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              P
            </div>
            <div>
              <h1 className="font-bold text-lg">
                Visitor Hub
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase">
              Smart Management
              </p>
            </div>
          </div>

          <nav className="flex-1 pb-3 px-3 mt-2 space-y-2 overflow-y-auto">
            {adminItems.map((section, index) => (
              <div key={index}>
                <p className="px-3 mt-4 mb-2 text-xs font-semibold text-muted-foreground uppercase">
                  {section.title}
                </p>

                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;

                  return (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      className={`w-full mt-1 dark:text-white flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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
            ))}
          </nav>

          <div className="border-t border-border px-3 py-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer hover:bg-secondary p-2 rounded-lg transition">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-medium">Admin</p>
                    <p className="text-xs text-muted-foreground">
                      admin@pogo.io
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
