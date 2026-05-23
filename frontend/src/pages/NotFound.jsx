import React from "react";
import { useNavigate } from "react-router-dom";
import { SearchX, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 px-4 transition-colors duration-300">
      <div className="w-full max-w-[400px] border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
        {/* STRUCTURAL CONTENT LAYOUT */}
        <div className="flex items-start gap-4">
          {/* SOPHISTICATED ICON BOX */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-neutral-50 border border-neutral-200 text-neutral-600 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400">
            <SearchX size={18} strokeWidth={2} />
          </div>

          {/* TEXT CONTENT */}
          <div className="space-y-1.5 flex-1 text-left">
            {/* यहाँ पर text-primary का उपयोग किया गया है */}
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Error 404
            </span>

            <h1 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              Page Not Found
            </h1>

            <p className="text-sm font-light leading-relaxed text-neutral-500 dark:text-neutral-400">
              The page you are looking for doesn’t exist, has been moved, or has
              been permanently removed.
            </p>
          </div>
        </div>

        {/* REFINED SYSTEM BUTTONS */}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2.5">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="h-9 rounded-none border-neutral-200 text-xs font-medium tracking-wide text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900 sm:px-4 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
          >
            <div className="flex items-center gap-1.5">
              <ArrowLeft size={13} />
              <span>Go Back</span>
            </div>
          </Button>

          {/* यहाँ पर bg-primary का उपयोग किया गया है */}
          <Button
            onClick={() => navigate("/")}
            className="h-9 rounded-none bg-primary text-xs font-medium tracking-wide text-primary-foreground transition-colors hover:opacity-90 sm:px-4"
          >
            <div className="flex items-center gap-1.5">
              <Home size={13} />
              <span>Go Home</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
