import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  Trash2,
  Clock,
  Inbox,
  Briefcase,
  CheckSquare,
  Search,
  X,
  SlidersHorizontal,
  Info,
  AlertCircle,
  ArrowRight,
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
    if (!name) return "SYS";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getTypeStyles = (type) => {
    switch (type?.toLowerCase()) {
      case "job":
        return {
          bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50",
          icon: Briefcase,
        };
      case "alert":
        return {
          bg: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/50",
          icon: AlertCircle,
        };
      default:
        return {
          bg: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/50",
          icon: Info,
        };
    }
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
      <div className="h-[calc(100vh-140px)] w-full rounded-2xl border border-border/80 bg-gradient-to-b from-card to-card/95 flex flex-col shadow-xl shadow-foreground/[0.02] overflow-hidden backdrop-blur-md antialiased transition-all duration-300">
        {/* PREMIUM UPPER HEADER */}
        <div className="px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/60 bg-background/40 backdrop-blur-md gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl border border-border bg-gradient-to-tr from-muted to-background flex items-center justify-center text-foreground/80 shadow-inner relative group-hover:scale-105 transition-transform duration-300">
              <Bell className="h-5 w-5 stroke-[1.5] text-primary" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary border-2 border-background"></span>
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Notification Hub
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 font-normal">
                Stay updated with automated alerts, system updates, and platform
                activity logs.
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-xs font-semibold h-9 border-primary/20 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary transition-all duration-300 flex items-center gap-2 px-4 rounded-xl shadow-sm"
            >
              <CheckSquare className="h-3.5 w-3.5" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* SUBBAR: CONTROLS & TABS */}
        <div className="px-8 py-4 flex flex-col lg:flex-row lg:items-center justify-between bg-muted/10 border-b border-border/40 gap-4 shrink-0">
          {/* MINIMALIST GLASS TAB CONTROL */}
          <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border border-border/40 w-fit">
            {[
              {
                id: "all",
                label: "All Activity",
                count: pagination?.totalItems || notifications.length,
              },
              { id: "unread", label: "Unread", count: unreadCount },
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
                    "px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all duration-300 flex items-center gap-2.5 relative",
                    isActive
                      ? "bg-background text-foreground shadow-sm border border-border/50 font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/30",
                  )}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold tracking-normal transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-foreground/5 text-muted-foreground",
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full lg:w-72 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search logs by name or text..."
                className="h-9.5 w-full pl-10 pr-9 rounded-xl bg-background border-border/60 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-xs transition-all shadow-2xs placeholder:text-muted-foreground/50"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground p-0.5 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-9.5 w-9.5 text-muted-foreground hover:text-foreground rounded-xl bg-background border-border/60 shadow-2xs shrink-0 hover:border-border transition-all hover:bg-muted/40"
            >
              <SlidersHorizontal className="h-4 w-4 stroke-[1.5]" />
            </Button>
          </div>
        </div>

        {/* FEED CONTENT CONTAINER */}
        <div className="flex-1 min-h-0 w-full relative">
          <ScrollArea className="h-full w-full bg-background/5">
            {isLoading ? (
              <div className="flex h-72 flex-col items-center justify-center gap-3">
                <div className="h-6 w-6 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <p className="text-xs font-semibold text-muted-foreground tracking-wide">
                  Syncing live logs...
                </p>
              </div>
            ) : filteredNotifications.length ? (
              <div className="divide-y divide-border/40 px-4">
                {filteredNotifications.map((item) => {
                  const typeStyle = getTypeStyles(item.type);
                  const IconComponent = typeStyle.icon;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={cn(
                        "group relative flex gap-4 my-2 py-4 px-5 rounded-xl transition-all duration-200 cursor-pointer items-start border border-transparent",
                        !item.isRead
                          ? "bg-gradient-to-r from-primary/[0.03] to-transparent border-l-4 border-l-primary shadow-sm shadow-primary/[0.01]"
                          : "hover:bg-muted/20 hover:shadow-xs",
                      )}
                    >
                      {/* STRUCTURAL AVATAR SYSTEM */}
                      <div
                        className="relative shrink-0 mt-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.client?.profilePic ? (
                          <div className="h-10 w-10 rounded-xl overflow-hidden border border-border/80 shadow-xs ring-2 ring-transparent group-hover:ring-primary/10 transition-all">
                            <img
                              src={item.client.profilePic}
                              alt={item.client.name}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/60 border border-border/40 text-foreground/70 font-bold text-xs shadow-xs tracking-wider group-hover:border-primary/20 transition-all">
                            {getInitials(item.client?.name)}
                          </div>
                        )}

                        {/* MINI FLOATING TYPE ICON */}
                        <div
                          className={cn(
                            "absolute -bottom-1 -right-1 rounded-md p-0.5 border text-[8px] shadow-xs",
                            typeStyle.bg,
                          )}
                        >
                          <IconComponent className="h-2.5 w-2.5 stroke-[2]" />
                        </div>
                      </div>

                      {/* NOTIFICATION TEXT CONTENT */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="text-xs leading-relaxed text-muted-foreground">
                          <span
                            className={cn(
                              "text-foreground font-semibold hover:text-primary transition-colors",
                              !item.isRead && "text-foreground font-bold",
                            )}
                          >
                            {item.client?.name || "System Core"}
                          </span>{" "}
                          <span
                            className={
                              !item.isRead
                                ? "text-foreground/90 font-medium"
                                : ""
                            }
                          >
                            {item.title === "New Job"
                              ? "published a new project catalog"
                              : item.message}
                          </span>{" "}
                          {item.type === "job" && (
                            <span className="inline-flex items-center font-mono font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10 text-[10px] ml-1">
                              #{item.jobId}
                            </span>
                          )}
                        </div>

                        {/* DURATION & BADGE INFO */}
                        <div className="mt-2 flex items-center gap-2.5 text-[11px] text-muted-foreground/70">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 opacity-50" />
                            <span
                              className={
                                !item.isRead ? "text-primary font-semibold" : ""
                              }
                            >
                              {formatTimeAgo(item.createdAt)}
                            </span>
                          </div>
                          <span>•</span>
                          <span
                            className={cn(
                              "text-[9px] font-bold px-2 py-0.5 rounded-md border tracking-wider uppercase font-mono scale-95 origin-left",
                              typeStyle.bg,
                            )}
                          >
                            {item.type || "System"}
                          </span>
                        </div>

                        {/* ENCLOSED LOG CONTENT BOX */}
                        {item.message && item.title === "New Job" && (
                          <div
                            className={cn(
                              "mt-3 text-xs border rounded-xl p-3 max-w-4xl line-clamp-2 leading-relaxed transition-all shadow-2xs",
                              !item.isRead
                                ? "text-foreground/80 border-primary/10 bg-primary/[0.01]"
                                : "text-muted-foreground/90 border-border/50 bg-muted/10",
                            )}
                          >
                            {item.message}
                          </div>
                        )}
                      </div>

                      {/* ACTION BUTTONS (VISIBLE HOVER SHIFT) */}
                      <div
                        className="flex items-center gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-200 shrink-0 self-center pl-4 translate-x-0 lg:translate-x-2 lg:group-hover:translate-x-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {!item.isRead && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => markRead(item.id)}
                            className="h-8 w-8 rounded-lg bg-background border border-border shadow-2xs hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 hover:border-emerald-200 transition-all duration-200"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4 stroke-[2.5]" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteTargetId(item.id)}
                          className="h-8 w-8 rounded-lg bg-background border border-border shadow-2xs hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 hover:border-rose-200 transition-all duration-200"
                          title="Delete entry"
                        >
                          <Trash2 className="h-4 w-4 stroke-[1.75]" />
                        </Button>

                        {item.jobId && (
                          <div className="hidden sm:flex items-center justify-center h-8 w-8 text-muted-foreground/40 group-hover:text-primary transition-colors pl-1">
                            <ArrowRight className="h-4 w-4 stroke-[2] transform group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* EMPTY LEDGER STATE */
              <div className="flex h-80 flex-col items-center justify-center text-center p-6 animate-fade-in">
                <div className="mb-4 rounded-2xl border border-border/60 bg-gradient-to-b from-muted/30 to-muted/10 p-4 text-primary/40 shadow-sm ring-4 ring-primary/[0.01]">
                  <Inbox className="h-6 w-6 stroke-[1.5] text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground tracking-tight">
                  {search ? "No records matched" : "All Caught Up!"}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-[320px] leading-relaxed">
                  {search
                    ? `We couldn't find any log results for "${search}". Try refining your keywords.`
                    : "Your system notifications are completely clean. New logs will stream in real-time."}
                </p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* PAGINATION SECTION */}
        {pagination?.totalPages > 1 && (
          <div className="p-4 border-t border-border/60 bg-muted/5 shrink-0 flex items-center justify-center">
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
        title="Delete Log Entry"
        description="This entry will be permanently dropped from your dashboard ledger view. You cannot undo this act."
        confirmText="Confirm"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default Notifications;
