import { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Sun, Moon, Menu, X, Briefcase } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const getNavLinks = () => {
  return [
    { label: "Home", href: "/" },
    { label: "Find Work", href: "/find-work" },
    { label: "Find Freelancers", href: "/find-freelancers" },
    { label: "Contact", href: "/contact" },
  ];
};
const Navbar = () => {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const getDashboardRoute = () => {
    if (!user) return "/";

    if (user?.data.role === "client") return "/dashboard";
    if (user?.data.role === "freelancer") return "/dashboard";
    if (user?.data.role === "admin") return "/admin/dashboard";

    return "/";
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg hidden sm:block italic">
                ProMarket
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {getNavLinks(user).map((l) => (
                <NavLink
                  key={l.label}
                  to={l.href}
                  className={({ isActive }) =>
                    `text-sm font-bold transition-all duration-200 relative py-2 ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggle}
                className="rounded-xl"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>

              <div className="hidden md:flex items-center gap-2">
                {!user ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-bold rounded-xl"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </Button>

                    <Button
                      size="sm"
                      className="rounded-xl gradient-primary border-0 font-bold shadow-lg shadow-primary/20"
                      onClick={() => navigate("/client-signup")}
                    >
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-bold"
                      onClick={() => navigate("/profile")}
                    >
                      Profile
                    </Button>

                    <Button
                      size="sm"
                      className="rounded-xl gradient-primary border-0 font-bold shadow-lg shadow-primary/20"
                      onClick={() => navigate(getDashboardRoute())}
                    >
                      Dashboard
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-black/40 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={`absolute top-0 left-0 h-full w-72 bg-card border-r border-border shadow-lg p-6 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between mb-8">
            <span className="font-black text-xl italic text-primary">
              MENU.
            </span>
            <X
              className="h-6 w-6 cursor-pointer"
              onClick={() => setMobileOpen(false)}
            />
          </div>

          <div className="space-y-4">
            {getNavLinks(user).map((l) => (
              <NavLink
                key={l.label}
                to={l.href}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block p-3 rounded-xl font-bold ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="absolute bottom-8 left-6 right-6 space-y-3">
            {!user ? (
              <>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  className="w-full gradient-primary border-0"
                  onClick={() => navigate("/client-signup")}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </Button>
                <Button
                  size="sm"
                  className="rounded-xl gradient-primary border-0 font-bold shadow-lg shadow-primary/20"
                  onClick={() => navigate(getDashboardRoute())}
                >
                  Dashboard
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
