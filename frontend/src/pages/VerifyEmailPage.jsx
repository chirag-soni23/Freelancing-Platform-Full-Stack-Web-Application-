import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  MailSearch
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const { toast } = useToast();

  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [progress, setProgress] = useState(10);
  const calledRef = useRef(false);

  useEffect(() => {
    let interval;

    const performVerification = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      // Progress bar animation logic
      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 5 : prev));
      }, 200);

      try {
        await verifyEmail(token);
        handleSuccess(interval);
      } catch (err) {
        clearInterval(interval);
        const message = err?.response?.data?.message;

        if (message === "Email already verified") {
          handleSuccess();
        } else {
          setStatus("error");
          setProgress(0);
        }
      }
    };

    const handleSuccess = (intv) => {
      if (intv) clearInterval(intv);
      setProgress(100);
      setStatus("success");

      // Redirect after a short delay so user can see the success state
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    };

    if (!calledRef.current) {
      calledRef.current = true;
      performVerification();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [token, navigate, verifyEmail]);

  const handleResendInfo = () => {
    toast({
      title: "Verification Info",
      description: "A new link has been requested. Please check your inbox.",
    });
    // Yahan tum apna resend logic call kar sakte ho
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020817] px-6 relative overflow-hidden selection:bg-primary/30">
      
      {/* Background Ambient Glows */}
      <div className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[120px] transition-colors duration-1000 ${
        status === 'error' ? 'bg-red-500/10' : 'bg-primary/10'
      }`} />
      <div className={`absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-[120px] transition-colors duration-1000 ${
        status === 'success' ? 'bg-green-500/10' : 'bg-primary/20'
      }`} />

      <Card className="w-full max-w-md bg-[#0f172a]/80 border-white/5 text-center shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] backdrop-blur-2xl z-10">
        
        <CardHeader className="space-y-5 pt-12">
          <div className="flex justify-center">
            {status === "loading" && (
              <div className="p-5 bg-primary/10 rounded-3xl ring-1 ring-primary/20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            )}

            {status === "success" && (
              <div className="p-5 bg-green-500/10 rounded-3xl ring-1 ring-green-500/20 animate-in zoom-in duration-500">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            )}

            {status === "error" && (
              <div className="p-5 bg-red-500/10 rounded-3xl ring-1 ring-red-500/20 animate-in zoom-in duration-500">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Badge variant="outline" className="bg-white/5 text-primary border-primary/20 px-3 py-1 uppercase tracking-widest text-[10px]">
              Secure Verification
            </Badge>

            <CardTitle className="text-3xl font-bold tracking-tight text-white">
              {status === "loading" && "Confirming Email"}
              {status === "success" && "Success!"}
              {status === "error" && "Link Expired"}
            </CardTitle>

            <CardDescription className="text-slate-400 text-sm px-6 leading-relaxed">
              {status === "loading" && "Checking our records to secure your account access."}
              {status === "success" && "Your email has been verified. Redirecting you now..."}
              {status === "error" && "The link you clicked is either invalid or has timed out for security reasons."}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-10 py-4">
          {status === "loading" && (
            <div className="space-y-4">
              <Progress value={progress} className="h-1.5 bg-white/5 transition-all duration-500" />
              <p className="text-[10px] text-slate-500 flex justify-center gap-2 items-center uppercase tracking-tighter">
                <ShieldCheck size={12} className="text-primary" /> Encrypted Handshake
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="h-1.5 w-full bg-green-500/20 rounded-full overflow-hidden">
               <div className="h-full bg-green-500 animate-progress-grow" style={{ width: '100%' }} />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 px-10 pb-12">
          {status === "error" ? (
            <>
              <Button
                className="w-full bg-white text-black hover:bg-slate-200 font-bold h-12 rounded-2xl transition-all active:scale-[0.98]"
                onClick={handleResendInfo}
              >
                <MailSearch className="mr-2 h-4 w-4" /> Request New Link
              </Button>

              <Button
                variant="ghost"
                className="w-full h-12 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl"
                onClick={() => navigate("/profile")}
              >
                <ArrowLeft size={16} className="mr-2" />
                Return to Profile
              </Button>
            </>
          ) : (
            <div className="text-[10px] text-slate-600 font-medium uppercase tracking-[0.2em] pt-4">
              Authorized Access Only
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;