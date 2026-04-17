import React, { useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Hero = () => {
  return (
    <section className="relative w-full lg:mt-0 md:mt-0 mt-10 overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-background -z-10"></div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="flex flex-col justify-center space-y-6 text-center md:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-6xl font-bold tracking-tighter leading-[1.1] text-foreground">
                Are you looking for <br className="hidden md:block" />
                <span className="text-primary">Freelancers?</span>
              </h1>
              <p className="mx-auto md:mx-0 max-w-[500px] text-muted-foreground text-lg md:text-xl">
                Hire great freelancers, fast. Find top talent in minutes and get
                your work done efficiently.
              </p>
            </div>

            {/* CTA + SEARCH */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg mx-auto md:mx-0">
              <Button className="gradient-primary text-white rounded-xl px-8 py-3 h-auto text-base w-full sm:w-auto">
                Hire a freelancer
              </Button>

              <div className="flex items-center w-full bg-card border rounded-xl pl-3 pr-1.5 py-1.5 shadow-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <Input
                  placeholder="Search freelance work"
                  className="!bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-9 py-4"
                />
                <Button
                  size="icon"
                  className="shrink-0 bg-primary text-primary-foreground rounded-lg h-9 w-9"
                >
                  <Search size={18} />
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center items-center lg:justify-end">
            <div className="relative w-full max-w-[450px] lg:max-w-none">
              <img
                src="./hero.png"
                alt="freelancer illustration"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 1440 200"
          className="w-full h-[120px] md:h-[180px]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C300,200 700,0 1440,100 L1440,200 L0,200 Z"
            className="fill-primary/15 dark:fill-primary/15"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
