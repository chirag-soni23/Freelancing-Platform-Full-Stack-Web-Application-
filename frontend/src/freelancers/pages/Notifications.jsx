import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  Trash2,
  Clock,
  Inbox,
  Briefcase,
  Settings,
  CheckSquare,
  Sparkles,
  Search,
  X,
  SlidersHorizontal
} from "lucide-react";

import { useNotification } from "@/hooks/useNotification";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ConfirmDialog from "@/hoc/ConfirmDialog";
import WithPagination from "@/hoc/WithPagination";
import useDebounce from "@/hooks/useDebounce";

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const {
    notifications = [],
    unreadCount = 0,
    isLoading,
    markRead,
    deleteNotification,
    pagination,
  } = useNotification({ page, limit: 10, search: debouncedSearch });

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const now = new Date();
    const past = new Date(dateString);
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const elapsed = now - past;

    if (elapsed < msPerMinute) return "Just now";
    if (elapsed < msPerHour) return `${Math.round(elapsed / msPerMinute)}m ago`;
    if (elapsed < msPerDay) return `${Math.round(elapsed / msPerHour)}h ago`;
    return `${Math.round(elapsed / msPerDay)}d ago`;
  };

  const getInitials = (name) => {
    if (!name) return "AA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleMarkAllRead = () => {
    notifications.forEach((item) => {
      if (!item.isRead) markRead(item.id);
    });
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteNotification(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const handleNotificationClick = (item) => {
    if (!item.isRead) {
      markRead(item.id);
    }
    if (item.jobId) {
      navigate(`/job-details/${item.jobId}`);
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeTab === "unread") return !item.isRead;
      return true;
    });
  }, [notifications, activeTab]);

  return (
    <>
      <div className="h-[calc(100vh-140px)] w-full overflow-hidden rounded-2xl border border-muted bg-background flex flex-col shadow-xl">
        
        {/* PREMIUM UPPER HEADER */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-muted bg-card/40 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
              <Bell className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground/90">
                Notification Center
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage your real-time platform activities and webhooks.
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-xs font-medium border-muted bg-card hover:bg-accent rounded-xl px-4 py-2 shadow-sm transition-all flex items-center gap-2 text-foreground/80 hover:text-foreground"
            >
              <CheckSquare className="h-4 w-4 text-primary" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* SUBBAR: CONTROLS & TABS */}
        <div className="px-8 flex flex-col md:flex-row md:items-center justify-between bg-card/10 border-b border-muted gap-4 py-3">
          {/* MODERN TAB CONTROL */}
          <div className="flex bg-muted/60 p-1 rounded-xl w-fit border border-muted/50">
            {[
              { id: "all", label: "All Logs", count: pagination?.totalItems || notifications.length },
              { id: "unread", label: "Unread Only", count: unreadCount },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setPage(1);
                  }}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-2",
                    isActive
                      ? "bg-background text-foreground shadow-sm font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-muted-foreground/10 text-muted-foreground"
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* SEARCH & FILTER ENGINE */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Filter notification logs..."
                className="h-9 w-full pl-9 pr-8 rounded-xl bg-card border-muted hover:border-muted-foreground/30 focus-visible:ring-primary/20 text-xs transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-md hover:bg-muted transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-xl bg-card border-muted shadow-sm shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* FEED COMPONENT CONTAINER */}
        <ScrollArea className="flex-1 px-6 py-4 bg-gradient-to-b from-transparent to-card/5">
          {isLoading ? (
            <div className="flex h-[320px] flex-col items-center justify-center gap-4">
              <div className="relative flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border-2 border-primary/10 border-t-primary animate-spin" />
                <Sparkles className="absolute h-4 w-4 text-primary animate-pulse" />
              </div>
              <p className="text-xs font-medium text-muted-foreground tracking-wider">
                Re-indexing your notification matrix...
              </p>
            </div>
          ) : filteredNotifications.length ? (
            <div className="space-y-2 pb-4">
              {filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={cn(
                    "group relative flex gap-4 p-4 rounded-xl cursor-pointer border transition-all duration-200 bg-card",
                    !item.isRead
                      ? "border-primary/20 bg-gradient-to-r from-primary/[0.02] via-transparent to-transparent shadow-sm"
                      : "border-muted/60 hover:border-muted-foreground/20 hover:shadow-md hover:shadow-foreground/[0.01]"
                  )}
                >
                  {/* UNREAD VERTICAL EMBED STRIP */}
                  {!item.isRead && (
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-primary rounded-r-md" />
                  )}

                  {/* MINIMALIST SQUARE AVATAR SYSTEM */}
                  <div
                    className="relative shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.client?.profilePic ? (
                      <div className="h-10 w-10 rounded-xl overflow-hidden border border-muted shadow-sm group-hover:scale-105 transition-transform duration-200">
                        <img
                          src={item.client.profilePic}
                          alt={item.client.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary border border-muted text-secondary-foreground font-bold text-xs shadow-inner group-hover:scale-105 transition-transform duration-200">
                        {getInitials(item.client?.name)}
                      </div>
                    )}
                  </div>

                  {/* NOTIFICATION META GRID */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="text-sm text-foreground/80 leading-relaxed">
                      <span className="font-bold text-foreground hover:text-primary transition-colors">
                        {item.client?.name || "System Core"}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {item.title === "New Job"
                          ? "published a new high-tier project catalog"
                          : item.message}
                      </span>{" "}
                      {item.type === "job" && (
                        <span className="inline-flex items-center gap-1 font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-md text-[11px] ml-1 border border-primary/10">
                          <Briefcase className="h-3 w-3" /> #{item.jobId}
                        </span>
                      )}
                    </div>

                    {/* PILL FOOTER INFRASTRUCTURE */}
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground/80 font-medium">
                      <div className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md">
                        <Clock className="h-3 w-3 opacity-60" />
                        <span>{formatTimeAgo(item.createdAt)}</span>
                      </div>
                      <span>•</span>
                      <span className="uppercase text-[9px] font-extrabold text-muted-foreground tracking-widest bg-muted px-1.5 py-0.5 rounded">
                        {item.type || "System"}
                      </span>
                    </div>

                    {/* EXTENDED LOG SNIPPET */}
                    {item.message && item.title === "New Job" && (
                      <div className="mt-3 text-xs text-muted-foreground/90 border border-muted bg-muted/20 rounded-lg p-3 max-w-3xl line-clamp-2 leading-relaxed">
                        {item.message}
                      </div>
                    )}
                  </div>

                  {/* CONTEXT ACTIONS */}
                  <div
                    className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-200 self-center pl-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {!item.isRead && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => markRead(item.id)}
                        className="h-8 w-8 rounded-lg bg-background hover:bg-primary/10 text-muted-foreground hover:text-primary border border-muted shadow-sm transition-colors"
                      >
                        <Check className="h-4 w-4 stroke-[2.5]" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteTargetId(item.id)}
                      className="h-8 w-8 rounded-lg bg-background hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-muted shadow-sm transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[380px] flex-col items-center justify-center text-center p-6 bg-transparent">
              <div className="mb-4 rounded-2xl bg-gradient-to-b from-muted to-muted/20 p-4 text-muted-foreground/80 border border-muted shadow-sm">
                <Inbox className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-foreground/90">
                {search ? "No records matched" : "All caught up!"}
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground max-w-[280px] leading-relaxed">
                {search 
                  ? `We scanned the buffer but couldn't locate any logs matching "${search}".` 
                  : "Your notification index is completely clean. Fresh events will stream here live."}
              </p>
            </div>
          )}
        </ScrollArea>

        {/* PAGINATION SECTION */}
        {pagination?.totalPages > 1 && (
          <div className="p-4 border-t border-muted bg-card/20 backdrop-blur-md">
            <WithPagination
              page={page}
              totalPages={pagination?.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTargetId(null);
        }}
        title="Delete Notification Log"
        description="Are you absolutely sure you want to scrub this record? This action will permanently drop it from your dashboard index."
        confirmText="Confirm Delete"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default Notifications;