import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  X,
  Check,
  Ban,
  Eye,
  Calendar,
  DollarSign,
  User,
} from "lucide-react";
import { useBid } from "@/hooks/useBid";
import ConfirmDialog from "@/hoc/ConfirmDialog";
import WithPagination from "@/hoc/WithPagination";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { usePayment } from "@/hooks/usePayment";

const ClientBid = ({ jobId: propJobId }) => {
  const { jobId: routeJobId } = useParams();
  const jobId = propJobId || routeJobId;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const {
    jobBids = [],
    jobBidsPagination,
    isLoadingJobBids,
    acceptBid,
    isAcceptingBid,
    rejectBid,
    isRejectingBid,
  } = useBid(jobId, { page, limit: 10, search: debouncedSearch });

  const [proposalOpen, setProposalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [targetBidId, setTargetBidId] = useState(null);
  const { createPayment, isCreatingPayment } = usePayment();

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  const handleActionConfirm = () => {
    console.log("clicked", targetBidId, actionType);

    if (!targetBidId) return;

    if (actionType === "accept") {
      acceptBid(targetBidId, {
        onSuccess: () => {
          setActionOpen(false);

          setTargetBidId(null);
        },
      });
    }

    if (actionType === "reject") {
      rejectBid(targetBidId, {
        onSuccess: () => {
          setActionOpen(false);

          setTargetBidId(null);
        },
      });
    }
  };

  const isMutating = isAcceptingBid || isRejectingBid;

  return (
    <div className="mt-10 min-h-screen">
      <div className="max-w-8xl mx-auto space-y-6 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight gradient-text text-foreground">
            Job Proposals & Bids
          </h1>
          <p className="text-muted-foreground mt-1 text-xs md:text-sm">
            Review and manage incoming submissions from top freelancers
          </p>
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by freelancer name or details..."
            className="h-11 md:h-12 w-full pl-11 pr-11 rounded-full bg-card border-border/60 shadow-soft"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* --- MOBILE RESPONSIVE CARDS (Visible only on small screens) --- */}
        <div className="block md:hidden space-y-4">
          {isLoadingJobBids ? (
            <div className="p-8 text-center text-muted-foreground font-medium animate-pulse bg-card border rounded-2xl">
              Loading bids information...
            </div>
          ) : jobBids.length > 0 ? (
            jobBids.map((bid) => (
              <div
                key={bid.id}
                className="glass p-5 rounded-2xl border border-border/50 shadow-sm space-y-4 bg-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        bid.freelancer?.profilePic ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                      }
                      alt={bid.freelancer?.name}
                      className="w-11 h-11 rounded-xl object-cover border border-border bg-muted shadow-sm"
                    />
                    <div>
                      <h4 className="font-bold text-foreground text-sm leading-tight">
                        {bid.freelancer?.name || "Unknown Freelancer"}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 max-w-[160px] truncate">
                        {bid.freelancer?.title || "Professional Specialist"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${getStatusStyle(bid.status)}`}
                  >
                    {bid.status?.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-secondary/30 p-3 rounded-xl border border-border/20 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">
                      Amount
                    </span>
                    <span className="font-extrabold text-primary">
                      {bid.amount?.toLocaleString()} {bid.currency || "USD"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">
                      Timeline
                    </span>
                    <span className="font-bold text-foreground flex items-center gap-1 mt-0.5">
                      <Calendar size={12} /> {bid.deliveryDays} Days
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider mb-1">
                    Proposal Statement
                  </span>
                  <div className="flex items-start justify-between gap-2 bg-background p-2.5 rounded-lg border text-xs text-muted-foreground">
                    <p className="line-clamp-2 flex-1">{bid.proposal}</p>
                    <button
                      onClick={() => {
                        setSelectedProposal(bid);
                        setProposalOpen(true);
                      }}
                      className="p-1 rounded-md bg-secondary text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>

                {bid.status === "pending" ? (
                  <div className="flex gap-2 pt-1">
                    <button
                      disabled={isMutating}
                      onClick={() => {
                        setTargetBidId(bid.id);
                        setActionType("accept");
                        setActionOpen(true);
                      }}
                      className="flex-1 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Check size={14} /> Accept Offer
                    </button>

                    <button
                      disabled={isMutating}
                      onClick={() => {
                        setTargetBidId(bid.id);
                        setActionType("reject");
                        setActionOpen(true);
                      }}
                      className="flex-1 py-2.5 rounded-xl border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 text-destructive font-bold text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Ban size={14} /> Decline
                    </button>
                  </div>
                ) : bid.status === "accepted" ? (
                  bid.payment?.status === "paid" ? (
                    <a
                      href={bid.submission?.submissionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs"
                    >
                      View Submission
                    </a>
                  ) : (
                    <button
                      onClick={() => createPayment(bid.id)}
                      disabled={isCreatingPayment}
                      className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs disabled:opacity-50"
                    >
                      {isCreatingPayment ? "Processing..." : "Pay Now"}
                    </button>
                  )
                ) : null}
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-card rounded-2xl border text-muted-foreground">
              No proposals found.
            </div>
          )}
        </div>

        <div className="hidden md:block glass rounded-xl overflow-hidden border border-border/40 shadow-card">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="py-5 px-6 font-bold text-foreground">
                  Freelancer
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  Bid Amount
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  Timeline
                </TableHead>
                <TableHead className="font-bold text-foreground max-w-xs">
                  Proposal Summary
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  Status
                </TableHead>
                <TableHead className="text-right py-5 px-6 font-bold text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingJobBids ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-64 text-center text-muted-foreground font-medium animate-pulse"
                  >
                    Loading bids information...
                  </TableCell>
                </TableRow>
              ) : jobBids.length > 0 ? (
                jobBids.map((bid) => (
                  <TableRow
                    key={bid.id}
                    className="group border-border/40 hover:bg-primary/[0.02] transition-smooth"
                  >
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            bid.freelancer?.profilePic ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                          }
                          alt={bid.freelancer?.name}
                          className="w-10 h-10 rounded-xl object-cover border border-border bg-muted shadow-sm"
                        />
                        <div>
                          <p className="font-semibold text-foreground leading-tight">
                            {bid.freelancer?.name || "Unknown Freelancer"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {bid.freelancer?.title || "Professional Specialist"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 font-bold text-primary">
                      {bid.amount?.toLocaleString()} {bid.currency || "USD"}
                    </TableCell>

                    <TableCell className="py-4 font-medium text-foreground">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar size={14} className="text-muted-foreground" />
                        {bid.deliveryDays} Days
                      </div>
                    </TableCell>

                    <TableCell className="py-4 text-muted-foreground max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="truncate block flex-1 text-sm">
                          {bid.proposal}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedProposal(bid);
                            setProposalOpen(true);
                          }}
                          className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${getStatusStyle(bid.status)}`}
                      >
                        {bid.status?.toUpperCase()}
                      </span>
                    </TableCell>

                    <TableCell className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-3">
                        {bid.status === "pending" ? (
                          <>
                            <button
                              disabled={isMutating}
                              onClick={() => {
                                setTargetBidId(bid.id);
                                setActionType("accept");
                                setActionOpen(true);
                              }}
                              className="p-2.5 rounded-xl bg-background border border-border hover:border-emerald-500 text-foreground hover:text-emerald-500 transition-all shadow-soft disabled:opacity-40"
                            >
                              <Check size={18} />
                            </button>

                            <button
                              disabled={isMutating}
                              onClick={() => {
                                setTargetBidId(bid.id);
                                setActionType("reject");
                                setActionOpen(true);
                              }}
                              className="p-2.5 rounded-xl bg-background border border-border hover:border-destructive text-foreground hover:text-destructive transition-all shadow-soft disabled:opacity-40"
                            >
                              <Ban size={18} />
                            </button>
                          </>
                        ) : bid.status === "accepted" ? (
                          bid.payment?.status === "paid" ? (
                            <a
                              href={bid.submission?.submissionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all"
                            >
                              View Submission
                            </a>
                          ) : (
                            <button
                              onClick={() => createPayment(bid.id)}
                              disabled={isCreatingPayment}
                              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50"
                            >
                              {isCreatingPayment ? "Processing..." : "Pay Now"}
                            </button>
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground italic pr-2 select-none">
                            No actions available
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="bg-muted p-3 rounded-full">
                        <Search className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground">
                          No proposals found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {search
                            ? `No bids matching "${search}".`
                            : "No bids have been submitted for this job opening yet."}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <WithPagination
          page={page}
          totalPages={jobBidsPagination?.totalPages || 1}
          onPageChange={setPage}
        />

        {/* --- DETAILS MODAL DIALOG --- */}
        <Dialog open={proposalOpen} onOpenChange={setProposalOpen}>
          <DialogContent className="glass border-border/40 w-[92%] sm:max-w-[550px] rounded-xl p-4 md:p-6 mx-auto">
            <DialogHeader>
              <DialogTitle className="text-xl md:text-2xl font-bold gradient-text">
                Cover Letter & Proposal
              </DialogTitle>
              {selectedProposal && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4 p-3 rounded-xl bg-secondary/40 border border-border/40">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedProposal.freelancer?.profilePic}
                      alt={selectedProposal.freelancer?.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-foreground">
                        {selectedProposal.freelancer?.name}
                      </h4>
                      <p className="text-xs text-muted-foreground max-w-[150px] truncate">
                        {selectedProposal.freelancer?.title}
                      </p>
                    </div>
                  </div>
                  <div className="sm:ml-auto text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-none border-border/40 flex justify-between sm:block">
                    <span className="text-sm font-extrabold text-primary block">
                      {selectedProposal.amount?.toLocaleString()}{" "}
                      {selectedProposal.currency}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {selectedProposal.deliveryDays} days delivery
                    </span>
                  </div>
                </div>
              )}
            </DialogHeader>
            <div className="py-2 md:py-4">
              <label className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground px-1 block mb-2">
                Detailed Message
              </label>
              <div className="p-4 rounded-xl bg-card border border-border/50 max-h-[220px] overflow-y-auto text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {selectedProposal?.proposal}
              </div>
            </div>
            <DialogFooter>
              <button
                onClick={() => setProposalOpen(false)}
                className="w-full bg-secondary text-secondary-foreground py-2.5 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 border border-border text-xs md:text-sm"
              >
                Close Cover Letter
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={actionOpen}
          onOpenChange={(value) => {
            setActionOpen(value);

            if (!value) {
              setTargetBidId(null);
            }
          }}
          onConfirm={handleActionConfirm}
          title={
            actionType === "accept" ? "Accept this bid?" : "Reject this bid?"
          }
          description={
            actionType === "accept"
              ? "Accepting this offer will officially contract this freelancer for the project."
              : "Are you sure you want to decline this freelancer's submission? This cannot be undone."
          }
          confirmText={
            actionType === "accept" ? "Accept Offer" : "Decline Offer"
          }
          loading={isMutating}
        />
      </div>
    </div>
  );
};

export default ClientBid;
