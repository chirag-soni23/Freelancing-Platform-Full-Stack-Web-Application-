import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  Star,
  ShieldCheck,
  Zap,
  Globe,
  LogIn
} from "lucide-react";

const Login = () => {
  return (
    <div className="h-screen flex flex-col lg:flex-row bg-background overflow-hidden">
      
      {/* 🎨 Left Side: Branding (Consistent with Signup) */}
      <div className="hidden lg:flex flex-col justify-between p-16 relative w-[40%] h-full overflow-hidden shrink-0">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80')" 
          }}
        />
        <div className="absolute inset-0 z-10 bg-primary/90 mix-blend-multiply" />
        <div className="absolute inset-0 z-20 bg-gradient-to-tr from-black/80 via-transparent to-primary/20 backdrop-blur-[1px]" />

        {/* Logo */}
        <div className="relative z-30 flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-2xl">
            <span className="text-primary font-black text-xl italic text-black">P.</span>
          </div>
          <span className="text-white font-black text-2xl tracking-tighter uppercase italic">
            ProMarket
          </span>
        </div>

        {/* Content */}
        <div className="relative z-30 space-y-8">
           <div className="space-y-4">
             <Badge className="bg-white/20 text-white border-none px-4 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                Welcome Back
             </Badge>
             <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tighter">
               Resume your <br /> 
               <span className="text-emerald-400 italic underline decoration-wavy decoration-1 underline-offset-8">Growth</span> <br /> 
               journey.
             </h2>
          </div>
          
          <div className="space-y-6 max-w-sm">
            {[
              { icon: <ShieldCheck size={20} className="text-emerald-400" />, title: "Secure Authentication" },
              { icon: <Zap size={20} className="text-emerald-400" />, title: "Instant Access" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                   {item.icon}
                </div>
                <span className="text-white/90 font-bold text-sm tracking-wide">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-30 bg-black/20 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 max-w-sm">
            <p className="text-white/80 text-xs font-medium italic leading-relaxed">
              "Access the world's best talent and projects with just one click."
            </p>
        </div>
      </div>

      {/* 📝 Right Side: Login Form */}
      <div className="flex-1 h-full overflow-y-auto bg-[#fcfdfe] dark:bg-[#020617] scrollbar-hide">
        <div className="min-h-full flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md space-y-10">
            
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.3em]">
                <LogIn size={24} strokeWidth={2.5} />
                Secure Login
              </div>
              <h1 className="text-4xl font-black tracking-tighter leading-tight">Welcome back.</h1>
              <p className="text-muted-foreground font-medium italic">Please enter your details to access your account.</p>
            </div>

            {/* Form */}
            <form className="space-y-6">
              <div className="space-y-6">
                
                {/* Email Field */}
                <div className="space-y-2 group">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input 
                      type="email" 
                      placeholder="name@company.com" 
                      className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12" 
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2 group">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                      Password
                    </Label>
                    <span className="text-[10px] font-black uppercase text-primary hover:underline cursor-pointer">
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-1">
                <Checkbox id="remember" className="rounded-md border-muted-foreground/30 shadow-none data-[state=checked]:bg-primary" />
                <label htmlFor="remember" className="text-[11px] font-semibold text-muted-foreground italic">
                  Keep me logged in for 30 days
                </label>
              </div>

              <Button className="w-full h-16 rounded-3xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all group overflow-hidden">
                Sign In <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            {/* Footer */}
            <div className="border-t border-border/50 pt-8">
              <p className="text-center text-sm font-bold text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/client-signup">
                  <span className="text-primary font-black hover:underline cursor-pointer">
                    Create Account
                  </span>
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;