import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export const useGlobalNotification = () => {
  const queryClient = useQueryClient();
  const audioRef = useRef(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.data?.role !== "freelancer") return;

    audioRef.current = new Audio("/notification.mpeg");

    const handleNotification = (data) => {
      console.log("GLOBAL:", data);

      // sound
      audioRef.current.currentTime = 0;

      audioRef.current?.play().catch((err) => console.log(err));

      // custom toast
      toast({
        title: data?.title || "🔔 New Notification",

        description: data?.message || "You received a new update",

        duration: 5000,
      });

      // refresh notifications
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    };

    socket.on("newNotification", handleNotification);

    return () => {
      socket.off("newNotification", handleNotification);
    };
  }, [queryClient, user]);
};
