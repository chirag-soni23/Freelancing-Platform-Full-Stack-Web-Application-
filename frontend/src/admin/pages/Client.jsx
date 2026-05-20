import React, { useState } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import WithPagination from "@/hoc/WithPagination";
import useDebounce from "@/hooks/useDebounce";
import { Mail, Phone, Calendar, Search, X, User, Loader2 } from "lucide-react";

const Client = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const debouncedSearch = useDebounce(searchInput, 500);

  const {
    clients = [],
    isLoading,
    isFetching,
    clientsPagination: pagination,
  } = useDashboard("admin", {
    page,
    limit: 10,
    search: debouncedSearch,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading && !clients.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium">
          Loading clients analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 min-h-screen transition-colors duration-500">
      <div className="max-w-8xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">
            Clients Directory
          </h1>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
            Overview and manage all active client profiles.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (page !== 1) {
                setPage(1);
              }
            }}
            placeholder="Search clients by name or email..."
            className="h-12 w-full pl-11 pr-11 rounded-full bg-card border-border/60 shadow-soft"
          />

          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                setPage(1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Main Content Area */}
        {clients.length > 0 ? (
          <div className={isFetching ? "opacity-70 transition-all" : "transition-all"}>
            
            {/* 1. Mobile view: Grid layout with individual premium cards (Hidden on desktop) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="glass rounded-2xl border border-border/40 p-5 space-y-4 shadow-card group"
                >
                  {/* Identity Header */}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl overflow-hidden bg-secondary border border-border/50 shadow-soft min-w-[48px]">
                      {client.profilePic ? (
                        <img
                          src={client.profilePic}
                          alt={client.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-base">
                          {client.name?.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="font-bold block text-foreground tracking-tight">
                        {client.name}
                      </span>
                      {/* <span className="text-xs text-muted-foreground">
                        {freelancer.title || "Talent Core"}
                      </span> */}
                    </div>
                  </div>

                  <hr className="border-border/40" />

                  {/* Contact Info Items */}
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <Mail size={14} className="text-muted-foreground/70" />
                      <span className="truncate">{client.email}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <Phone size={14} className="text-muted-foreground/70" />
                      <span>{client.phone || "—"}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <Calendar size={14} className="text-muted-foreground/70" />
                      <span className="text-xs">
                        Joined {formatDate(client.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Desktop/Tablet view: Professional shadcn/ui Table (Hidden on mobile) */}
            <div className="hidden md:block glass rounded-[2rem] overflow-hidden border border-border/40 shadow-card">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="py-5 px-6 font-bold">Client</TableHead>
                    <TableHead className="font-bold">Email Address</TableHead>
                    <TableHead className="font-bold">Phone Number</TableHead>
                    <TableHead className="py-5 px-6 font-bold">Joined Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id} className="group border-border/40 hover:bg-primary/[0.01] transition-smooth">
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl overflow-hidden bg-secondary border border-border/50 shadow-soft">
                            {client.profilePic ? (
                              <img
                                src={client.profilePic}
                                alt={client.name}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-base">
                                {client.name?.charAt(0)}
                              </div>
                            )}
                          </div>

                          <div>
                            <span className="font-bold block text-foreground">
                              {client.name}
                            </span>
                            {/* <span className="text-xs text-muted-foreground">
                              {client.title || "Talent Core"}
                            </span> */}
                          </div>
                        </div>
                      </TableCell>


                      <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-muted-foreground/60" />
                          {client.email}
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-muted-foreground/60" />
                          {client.phone || "—"}
                        </div>
                      </TableCell>

                      <TableCell className="py-4 px-6 text-muted-foreground group-hover:text-foreground transition-colors">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Calendar size={14} className="text-primary/70" />
                          {formatDate(client.createdAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

          </div>
        ) : (
          /* Empty State Handling (For both Mobile & Desktop views) */
          <div className="glass rounded-[2rem] py-16 text-center border border-border/40 shadow-soft">
            <div className="bg-muted p-4 rounded-full w-fit mx-auto mb-4">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No client found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
              {searchInput
                ? `No results matches "${searchInput}". Try another query.`
                : "The current roster list is completely empty."}
            </p>
          </div>
        )}

        {/* Pagination Section */}
        <WithPagination
          page={page}
          totalPages={pagination?.totalPages || 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default Client;