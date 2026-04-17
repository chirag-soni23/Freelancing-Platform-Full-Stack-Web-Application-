import { useState } from "react";
// NavLink ko import karein
import { Link, useNavigate, NavLink } from "react-router-dom"; 
import { Sun, Moon, Menu, X, Briefcase } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Find Work", href: "/find-work" },
  { label: "Find Freelancers", href: "/find-freelancers" },
];

const Navbar = () => {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

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

            {/* Desktop Nav - ✨ Active/Inactive Logic Added */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((l) => (
                <NavLink
                  key={l.label}
                  to={l.href}
                  className={({ isActive }) =>
                    `text-sm font-bold transition-all duration-200 relative py-2 ${
                      isActive
                        ? "text-primary" // Active Style
                        : "text-muted-foreground hover:text-foreground" // Inactive Style
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      {/* Active Underline Indicator */}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in zoom-in duration-300" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggle} className="rounded-xl">
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>

              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-bold"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>

                <Button
                  size="sm"
                  className="rounded-xl gradient-primary border-0 font-bold shadow-lg shadow-primary/20"
                  onClick={() => navigate("/login")}
                >
                  Post Project
                </Button>
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

      {/* Mobile Sidebar - ✨ Active/Inactive Logic Added */}
      <div className={`fixed inset-0 z-50 md:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />

        <div className={`absolute top-0 left-0 h-full w-72 bg-card border-r border-border shadow-lg transform transition-transform duration-300 p-6 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between mb-8">
            <span className="font-black text-xl italic text-primary">MENU.</span>
            <X className="h-6 w-6 cursor-pointer text-muted-foreground" onClick={() => setMobileOpen(false)} />
          </div>

          <div className="space-y-4">
            {navLinks.map((l) => (
              <NavLink
                key={l.label}
                to={l.href}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block p-3 rounded-xl text-base font-bold transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary" // Mobile Active
                      : "text-muted-foreground hover:bg-secondary" // Mobile Inactive
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
          
          {/* Mobile Footer Buttons */}
          <div className="absolute bottom-8 left-6 right-6 space-y-3">
             <Button className="w-full rounded-xl font-bold" variant="outline" onClick={() => navigate("/login")}>Login</Button>
             <Button className="w-full rounded-xl font-bold gradient-primary border-0 shadow-lg" onClick={() => navigate("/signup")}>Sign Up</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;