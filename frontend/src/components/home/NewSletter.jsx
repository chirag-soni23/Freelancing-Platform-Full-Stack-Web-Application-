import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter = () => {
  return (
    <section className="py-20 bg-background transition-theme">
      <div className="max-w-3xl mx-auto px-6 text-center">
        
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Newsletter Subscription
        </h2>

        <p className="mt-4 text-muted-foreground">
          Subscribe to our newsletter to get new freelance work and projects
        </p>

        {/* Input Box */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          
          <Input
            type="email"
            placeholder="Enter your email address"
            className="w-full sm:w-[400px] h-12 bg-card border-border text-foreground placeholder:text-muted-foreground rounded-lg shadow-sm focus:ring-2 focus:ring-ring"
          />

          <Button className="h-12 px-8 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
            Subscribe
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;