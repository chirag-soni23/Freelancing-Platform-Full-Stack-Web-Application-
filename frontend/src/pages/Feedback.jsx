import React, { useState } from "react";

import { Star, MessageSquarePlus, Send, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

import { useFeedback } from "@/hooks/useFeedback";
import { toast } from "@/hooks/use-toast";

import {
  createFeedbackSchema,
  updateFeedbackSchema,
} from "@/validations/feedback.validator";
import WithPagination from "@/hoc/WithPagination";

const Feedback = ({ id }) => {
  const [open, setOpen] = useState(false);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [page, setPage] = useState(1);

  const [editId, setEditId] = useState(null);

  const {
    feedbacks,
    averageRating,
    totalReviews,

    createFeedback,
    updateFeedback,
    deleteFeedback,

    isCreatingFeedback,
    isUpdatingFeedback,
    isDeletingFeedback,
    feedbackPagination,

    isLoadingFeedbacks,
  } = useFeedback(id, { page, limit: 10 });

  const resetForm = () => {
    setEditId(null);
    setRating(0);
    setHover(0);
    setComment("");
  };

  const handleSubmit = async () => {
    const payload = {
      receiverId: id,
      rating,
      comment,
    };

    const { error } = editId
      ? updateFeedbackSchema.validate(
          {
            rating,
            comment,
          },
          {
            abortEarly: true,
          },
        )
      : createFeedbackSchema.validate(payload, {
          abortEarly: true,
        });

    if (error) {
      return toast({
        title: "Validation Error",
        description: error.details[0].message,
        variant: "destructive",
      });
    }

    if (editId) {
      updateFeedback(
        {
          id: editId,
          data: {
            rating,
            comment,
          },
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Feedback updated successfully",
            });

            resetForm();
            setOpen(false);
          },
        },
      );
    } else {
      createFeedback(payload, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Feedback posted successfully",
          });

          resetForm();
          setOpen(false);
        },
      });
    }
  };

  const handleEdit = (rev) => {
    setEditId(rev.id);
    setRating(rev.rating);
    setComment(rev.comment);

    // modal open automatically
    setOpen(true);
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = (id) => {
    deleteFeedback(id, {
      onSuccess: () => {
        toast({
          title: "Deleted",
          description: "Feedback deleted successfully",
        });
      },
    });
  };

  // =========================
  // LOADING
  // =========================
  if (isLoadingFeedbacks) {
    return (
      <div className="py-20 flex justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="space-y-8 pt-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-3xl font-black tracking-tight">Reviews</h3>

          <p className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2">
            <Star className="fill-amber-500 text-amber-500" size={20} />
            {averageRating || 0} out of 5 based on {totalReviews || 0} projects
          </p>
        </div>

        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);

            if (!value) {
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="h-14 px-8 rounded-md font-black text-md gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 hover:scale-105 transition-transform">
              <MessageSquarePlus size={20} />
              Leave a Review
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] rounded-md border-none p-8 bg-white dark:bg-[#020617]">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-3xl font-black text-slate-900 dark:text-white">
                {editId ? "Update Your Feedback" : "Share Your Feedback"}
              </DialogTitle>

              <DialogDescription className="font-bold text-slate-500 dark:text-slate-400">
                How was your experience working on this project?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* STARS */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={`transition-colors ${
                        star <= (hover || rating)
                          ? "fill-amber-500 text-amber-500"
                          : "text-slate-300 dark:text-slate-600"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* COMMENT */}
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review here... Be as detailed as possible."
                className="min-h-[150px] rounded-md border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:ring-primary p-4 font-medium"
              />

              {/* BUTTONS */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={isCreatingFeedback || isUpdatingFeedback}
                  className="flex-1 h-14 rounded-2xl font-black text-lg gap-2"
                >
                  {isCreatingFeedback || isUpdatingFeedback ? (
                    "Processing..."
                  ) : (
                    <>
                      {editId ? "Update Review" : "Post Review"}

                      <Send size={18} />
                    </>
                  )}
                </Button>

                {editId && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setOpen(false);
                    }}
                    className="h-14 rounded-2xl font-bold"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ========================= */}
      {/* REVIEWS */}
      {/* ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedbacks?.length > 0 ? (
          feedbacks.map((rev) => (
            <Card
              key={rev.id}
              className="border-none bg-white h-full dark:bg-slate-900/40 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-none transition-all group"
            >
              <CardContent className="p-8 space-y-5">
                {/* TOP */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/10">
                      <AvatarImage src={rev?.sender?.profilePic} />

                      <AvatarFallback className="font-black bg-primary/5 text-primary">
                        {rev?.sender?.name?.slice(0, 2)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-black text-slate-900 dark:text-white leading-none">
                        {rev?.sender?.name}
                      </p>

                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                        Verified Client •{" "}
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* REVIEW STARS */}
                  <div className="flex gap-0.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < rev.rating
                            ? "fill-amber-500 text-amber-500"
                            : "fill-slate-300 text-slate-300 dark:fill-slate-600 dark:text-slate-600"
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* COMMENT */}
                <div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium pl-4">
                    {rev.comment}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(rev)}
                    className="rounded-xl font-bold"
                  >
                    <Pencil size={14} className="mr-2" />
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isDeletingFeedback}
                    onClick={() => handleDelete(rev.id)}
                    className="rounded-xl font-bold"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">
              No Reviews Yet
            </h3>

            <p className="text-muted-foreground font-semibold mt-2">
              Be the first one to leave feedback.
            </p>
          </div>
        )}
      </div>

      <WithPagination
        page={page}
        totalPages={feedbackPagination?.totalPages}
        onPageChange={setPage}
      />
    </section>
  );
};

export default Feedback;
