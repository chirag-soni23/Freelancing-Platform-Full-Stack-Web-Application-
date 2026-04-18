import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  ShieldCheck,
  Zap,
  ArrowRight,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { resetPasswordWithTokenSchema } from "@/validations/auth.validator";

const ResetPassword = () => {
  const { resetPasswordWithToken, isResetting } = useAuth();
  const [errors, setErrors] = useState({});
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = resetPasswordWithTokenSchema.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      const newErrors = {};
      error.details.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});

    resetPasswordWithToken(
      {
        token,
        data: {
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
      },
      {
        onSuccess: () => {
          setFormData({
            password: "",
            confirmPassword: "",
          });
          navigate("/login");
        },
      },
    );
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-background overflow-hidden">
      <div className="flex-1 h-full overflow-y-auto bg-[#fcfdfe] dark:bg-[#020617] scrollbar-hide">
        <div className="min-h-full flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md space-y-10">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.3em]">
                <KeyRound size={24} strokeWidth={2.5} />
                Reset Password
              </div>
              <h1 className="text-4xl font-black tracking-tighter leading-tight">
                Create new password.
              </h1>
              <p className="text-muted-foreground font-medium italic">
                Enter your new password below to regain access.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                {/* New Password */}
                <div className="space-y-2 group">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12"
                      required
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2 group">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground group-focus-within:text-primary transition-colors">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="h-14 rounded-2xl bg-secondary/40 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-12"
                      required
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isResetting}
                className="w-full h-16 rounded-3xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all group overflow-hidden"
              >
                {isResetting ? "Updating..." : "Update Password"}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            {/* Footer */}
            <div className="pt-8 text-center">
              <p
                onClick={() => navigate("/login")}
                className="text-sm font-black text-primary uppercase tracking-widest hover:underline cursor-pointer"
              >
                Back to Login
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
