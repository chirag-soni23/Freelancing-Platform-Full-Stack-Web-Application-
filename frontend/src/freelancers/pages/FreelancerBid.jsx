import React, { useState } from "react";
import { useBid } from "@/hooks/useBid";
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
import ConfirmDialog from "@/hoc/ConfirmDialog";
import {
  Mail,
  Calendar,
  Search,
  X,
  User,
  Loader2,
  Briefcase,
  DollarSign,
  Trash2,
  Eye,
} from "lucide-react";
import SubmissionDialog from "@/hoc/SubmissionDialog";

const ProposalDialog = ({ open, onOpenChange, title, content }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass w-full max-w-lg rounded-xl border border-border/40 p-6 sm:p-8 space-y-4 shadow-xl bg-card">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            {title}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-xl hover:bg-secondary/50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <hr className="border-border/40" />
        <div className="max-h-[50vh] overflow-y-auto text-sm text-muted-foreground leading-relaxed bg-secondary/20 p-4 rounded-2xl border border-border/20 whitespace-pre-wrap">
          {content || "No proposal summary provided."}
        </div>
        <div className="flex justify-end pt-2">
          <button
            onClick={() => onOpenChange(false)}
            className="px-5 py-2.5 text-sm font-semibold rounded-full bg-primary text-primary-foreground hover:opacity-90 shadow-soft transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const FreelancerBid = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBidId, setSelectedBidId] = useState(null);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);

  const [selectedBid, setSelectedBid] = useState(null);

  // Proposal view modal states
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState({
    title: "",
    content: "",
  });

  const debouncedSearch = useDebounce(searchInput, 500);

  const {
    myBids = [],
    pagination,
    isLoadingMyBids: isLoading,
    deleteBid,
    isDeletingBid,
  } = useBid(null, {
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

  const handleDeleteClick = (bidId) => {
    setSelectedBidId(bidId);
    setIsDialogOpen(true);
  };

  const handleOpenSubmissionModal = (bid) => {
    setSelectedBid(bid);
    setIsSubmissionOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBidId) return;
    try {
      await deleteBid(selectedBidId);
      setIsDialogOpen(false);
      setSelectedBidId(null);
    } catch (error) {
      console.error("Failed to delete bid:", error);
    }
  };

  // Jab user eye icon par click karega proposal dekhne ke liye
  const handleViewProposalClick = (jobTitle, proposalContent) => {
    setSelectedProposal({
      title: jobTitle || "Proposal Details",
      content: proposalContent,
    });
    setIsProposalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium">
          Loading your bids analytics...
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
            My Bids Proposal
          </h1>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
            Overview and track all your submitted proposals and active job bids.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (page !== 1) setPage(1);
            }}
            placeholder="Search bids by job title..."
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
        {myBids.length > 0 ? (
          <div>
            {/* 1. Mobile view: Grid layout with luxury cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {myBids.map((bid) => (
                <div
                  key={bid.id || bid._id}
                  className="glass rounded-2xl border border-border/40 p-5 space-y-4 shadow-card group relative"
                >
                  {/* Identity Header */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <span className="font-bold block text-foreground tracking-tight line-clamp-1">
                          {bid.job?.title || "Project Title"}
                        </span>
                        <span className="text-xs font-semibold text-primary flex items-center gap-1 mt-0.5">
                          <DollarSign size={12} /> {bid.amount}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          handleViewProposalClick(bid.job?.title, bid.proposal)
                        }
                        className="text-muted-foreground hover:text-primary p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        disabled={isDeletingBid}
                        onClick={() => handleDeleteClick(bid.id || bid._id)}
                        className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <hr className="border-border/40" />

                  {/* Bid Details & Proposal Info */}
                  <p className="text-sm text-muted-foreground line-clamp-2 bg-secondary/20 p-2.5 rounded-xl border border-border/20">
                    {bid.proposal || "No proposal summary provided."}
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <Mail size={12} className="text-muted-foreground/70" />
                      <span className="truncate">
                        Client: {bid.job?.client?.email || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <Calendar
                        size={12}
                        className="text-muted-foreground/70"
                      />
                      <span>Submitted on {formatDate(bid.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Desktop/Tablet view: Professional Table */}
            <div className="hidden md:block glass rounded-[2rem] overflow-hidden border border-border/40 shadow-card">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="py-5 px-6 font-bold">
                      Project / Job
                    </TableHead>
                    <TableHead className="font-bold">
                      Proposal Summary
                    </TableHead>
                    <TableHead className="font-bold">Bid Amount</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="py-5 px-6 font-bold">
                      Submission Date
                    </TableHead>
                    <TableHead className="py-5 px-6 font-bold">
                      Submission Link
                    </TableHead>
                    <TableHead className="font-bold text-center">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myBids.map((bid) => (
                    <TableRow
                      key={bid.id || bid._id}
                      className="group border-border/40 hover:bg-primary/[0.01] transition-smooth"
                    >
                      <TableCell className="py-4 px-6 max-w-[250px]">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-primary/10 text-primary border border-border/50 shadow-soft shrink-0">
                            <Briefcase size={18} />
                          </div>
                          <div className="truncate">
                            <span className="font-bold block text-foreground truncate">
                              {bid.job?.title || "Untitled Project"}
                            </span>
                            <span className="text-xs text-muted-foreground truncate block">
                              {bid?.client?.email || "No client email"}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors max-w-sm font-medium">
                        <p className="truncate" title={bid.proposal}>
                          {bid.proposal || "—"}
                        </p>
                      </TableCell>

                      <TableCell className="text-primary font-bold transition-colors">
                        <div className="flex items-center gap-0.5 text-sm">
                          <DollarSign size={14} className="text-primary/70" />
                          {bid.amount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            bid.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : bid.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : bid.status === "withdrawn"
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {bid.status}
                        </span>
                      </TableCell>

                      <TableCell className="py-4 px-6 text-muted-foreground group-hover:text-foreground transition-colors">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Calendar size={14} className="text-primary/70" />
                          {formatDate(bid.createdAt)}
                        </div>
                      </TableCell>

                      <TableCell className="py-4 px-6 text-muted-foreground group-hover:text-foreground transition-colors">
                        {bid.status === "accepted" ? (
                          bid.submission ? (
                            <button
                              onClick={() => handleOpenSubmissionModal(bid)}
                              className="px-3 py-1 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                            >
                              Update Link
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenSubmissionModal(bid)}
                              className="px-3 py-1 text-xs font-medium rounded-lg bg-green-600 text-white hover:bg-green-700"
                            >
                              Submit Link
                            </button>
                          )
                        ) : (
                          <span className="text-muted-foreground">
                            No Submission
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() =>
                              handleViewProposalClick(
                                bid.job?.title,
                                bid.proposal,
                              )
                            }
                            className="text-muted-foreground hover:text-primary p-2 rounded-xl hover:bg-primary/10 transition-colors"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            disabled={isDeletingBid}
                            onClick={() => handleDeleteClick(bid.id || bid._id)}
                            className="text-muted-foreground hover:text-destructive p-2 rounded-xl hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          /* Empty State Handling */
          <div className="glass rounded-[2rem] py-16 text-center border border-border/40 shadow-soft">
            <div className="bg-muted p-4 rounded-full w-fit mx-auto mb-4">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No proposals found
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
              {searchInput
                ? `No results matches "${searchInput}". Try another search.`
                : "You haven't placed any active bids on open projects yet."}
            </p>
          </div>
        )}

        <WithPagination
          page={page}
          totalPages={pagination?.totalPages || 1}
          onPageChange={setPage}
        />
      </div>

      <ConfirmDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Retract This Proposal?"
        description="Are you absolutely sure you want to delete this bid? This proposal will be permanently removed from the client's dashboard and your analytics."
        confirmText="Yes, Retract Bid"
        loadingText="Retracting..."
        loading={isDeletingBid}
        onConfirm={handleConfirmDelete}
      />

      <ProposalDialog
        open={isProposalOpen}
        onOpenChange={setIsProposalOpen}
        title={selectedProposal.title}
        content={selectedProposal.content}
      />

      <SubmissionDialog
        open={isSubmissionOpen}
        onOpenChange={setIsSubmissionOpen}
        bidId={selectedBid?.id}
        initialValue={selectedBid?.submission?.submissionUrl}
        isEdit={!!selectedBid?.submission}
      />
    </div>
  );
};

export default FreelancerBid;
