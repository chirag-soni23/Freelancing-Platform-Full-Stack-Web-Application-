import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { TopNavbar } from "./TopNavbar";

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex overflow-hidden">
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div
        className={`flex-1 min-w-0 flex flex-col transition-all duration-500 ease-in-out ${
          isSidebarOpen ? "md:ml-64" : "ml-0"
        }`}
      >
        <TopNavbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() =>
            setIsSidebarOpen((prev) => !prev)
          }
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}