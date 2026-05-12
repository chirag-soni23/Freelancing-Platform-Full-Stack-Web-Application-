import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchX } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-theme px-4">
      
      <Card className="w-full max-w-md border border-border shadow-xl rounded-2xl">
        <CardContent className="flex flex-col items-center text-center p-8">

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
            <SearchX className="text-destructive" size={32} />
          </div>

          {/* Title */}
          <h1 className="text-5xl font-black tracking-tight mb-2">
            404
          </h1>

          <h2 className="text-lg font-bold mb-2">
            Page Not Found
          </h2>

          <p className="text-sm text-muted-foreground mb-6">
            The page you're looking for doesn’t exist or has been moved.
          </p>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <Button
              onClick={() => navigate("/")}
              className="flex-1 rounded-xl h-11 font-bold"
            >
              Go Home
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              className="flex-1 rounded-xl h-11 font-bold"
            >
              Go Back
            </Button>
          </div>

        </CardContent>
      </Card>

    </div>
  );
};

export default NotFound;