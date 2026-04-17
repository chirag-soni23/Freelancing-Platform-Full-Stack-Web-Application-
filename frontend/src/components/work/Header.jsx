import React from "react";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <div className="max-w-7xl mx-auto mb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            240 New Jobs Added Today
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
            Dream <span className="text-primary">Projects.</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl font-medium">
            Join a community of elite freelancers working on world-class
            products.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="font-bold hover:bg-transparent hover:text-primary"
          >
            Save Project
          </Button>
          <Button className="rounded-xl px-8 py-6 text-md font-bold shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform">
            Post a Job
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
