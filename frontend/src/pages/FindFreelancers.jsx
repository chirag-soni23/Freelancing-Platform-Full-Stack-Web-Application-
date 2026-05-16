import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  Star,
  MapPin,
  ShieldCheck,
  Zap,
  ExternalLink,
  MessageSquare,
  Users,
  IndianRupee,
  DollarSign,
  X,
  ArrowUpRight,
  Check,
  ChevronsUpDown,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import useDebounce from "@/hooks/useDebounce";
import WithPagination from "@/hoc/WithPagination";
import { Link } from "react-router-dom";
import { useCategory } from "@/hooks/useCategory";

const FindFreelancers = () => {
  const [category, setCategory] = useState("");
  const { uniqueCategories } = useCategory();
  const [rating, setRating] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState(false);

  const [categorySearch, setCategorySearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const {
    freelancers,
    freelancerPagination: pagination,
    isFetchingFreelancers,
  } = useAuth({
    page,
    limit: 10,
    search: debouncedSearch,
    category,
    rating,
    hourlyRate,
  });
  // console.log(freelancers);
  return (
    <div className="min-h-screen bg-[#fcfdfe] dark:bg-[#020617] text-foreground p-4 md:p-10">
      <div className="max-w-7xl mx-auto mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <Users size={14} /> Top 1% Verified Experts
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
          Hire the <span className="text-primary">Best Talent.</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl font-medium">
          Connect with specialized freelancers who have a proven track record of
          delivering excellence.
        </p>
      </div>

      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-4 p-2 bg-white dark:bg-card/50 border border-border/50 rounded-[1.5rem] shadow-xl shadow-black/5">
          <div className="relative flex-[3] flex items-center">
            <Search
              className="absolute left-5 text-muted-foreground"
              size={20}
            />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by skill (e.g. React, UI/UX Designer, SEO)..."
              className="pl-14 pr-12 !bg-transparent border-none text-md focus-visible:ring-0 h-14"
            />

            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-4 text-muted-foreground hover:text-red-500 text-lg font-bold"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <Button className="h-14 px-10 rounded-xl font-black text-base shadow-lg shadow-primary/20">
            Search Experts
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside className="lg:col-span-3 space-y-8">
          <div className="sticky top-20">
            <h2 className="font-black text-sm uppercase tracking-widest flex items-center gap-2 mb-6">
              <Filter size={16} className="text-primary" /> Filter Talent
            </h2>

            <Card className="border-none bg-secondary/30 dark:bg-secondary/10 rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Category
                  </label>
                  <Popover open={openCategory} onOpenChange={setOpenCategory}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCategory}
                        className="
        w-full
        justify-between
        h-12
        rounded-xl
        bg-background/50
        border-none
        font-semibold
        shadow-sm
      "
                      >
                        {category
                          ? uniqueCategories.find(
                              (cat) => cat.id.toString() === category,
                            )?.name
                          : "Select Category"}

                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="
      w-[300px]
      p-0
      rounded-2xl
      border-border/50
      shadow-2xl
    "
                    >
                      {/* SEARCH */}
                      <div className="p-3 border-b border-border/50">
                        <div className="relative">
                          <Search
                            className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            h-4
            w-4
            text-muted-foreground
          "
                          />

                          <Input
                            placeholder="Search category..."
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            className="
            pl-10
            h-11
            rounded-xl
            border-border/50
          "
                          />
                        </div>
                      </div>

                      {/* LIST */}
                      <div className="max-h-[260px] overflow-y-auto p-2">
                        {uniqueCategories
                          ?.filter((cat) =>
                            cat.name
                              .toLowerCase()
                              .includes(categorySearch.toLowerCase()),
                          )
                          .map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                setCategory(cat.id.toString());

                                setPage(1);

                                setOpenCategory(false);
                              }}
                              className={cn(
                                `
                w-full
                flex items-center gap-3
                rounded-xl
                px-4 py-3
                text-sm
                font-semibold
                transition-all
                hover:bg-secondary
              `,
                                category === cat.id.toString() &&
                                  "bg-primary text-white hover:bg-primary",
                              )}
                            >
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  category === cat.id.toString()
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />

                              <span>{cat.name}</span>
                            </button>
                          ))}

                        {uniqueCategories?.filter((cat) =>
                          cat.name
                            .toLowerCase()
                            .includes(categorySearch.toLowerCase()),
                        ).length === 0 && (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            No category found
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <Separator className="bg-border/50" />

                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Rating
                  </label>
                  <Select
                    value={rating}
                    onValueChange={(value) => {
                      setRating(value);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full bg-background/50 border-none rounded-xl h-12 font-semibold shadow-sm focus:ring-1 focus:ring-primary/20">
                      <SelectValue placeholder="Select Rating" />
                    </SelectTrigger>

                    <SelectContent className="rounded-xl border-border/50 shadow-2xl">
                      <SelectItem value="5">5 Star</SelectItem>

                      <SelectItem value="4">4 Star & Up</SelectItem>

                      <SelectItem value="3">3 Star & Up</SelectItem>

                      <SelectItem value="2">2 Star & Up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-border/50" />

                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Hourly Rate
                  </label>

                  <Select
                    value={hourlyRate}
                    onValueChange={(value) => {
                      setHourlyRate(value);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full bg-background/50 border-none rounded-xl h-12 font-semibold shadow-sm focus:ring-1 focus:ring-primary/20">
                      <SelectValue placeholder="Select Range" />
                    </SelectTrigger>

                    <SelectContent className="rounded-xl border-border/50 shadow-2xl">
                      <SelectItem value="0-500">₹0 - ₹500</SelectItem>

                      <SelectItem value="500-1000">₹500 - ₹1000</SelectItem>

                      <SelectItem value="1000-5000">₹1000 - ₹5000</SelectItem>

                      <SelectItem value="5000+">₹5000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setCategory("");
                      setRating("");
                      setHourlyRate("");
                      setSearch("");
                      setPage(1);
                    }}
                    className="text-[11px] font-black uppercase tracking-tighter text-primary hover:opacity-80 transition-opacity w-full text-center"
                  >
                    Reset All Filters
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        <main className="lg:col-span-9 space-y-6">
          {freelancers.length === 0 && !isFetchingFreelancers ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h2 className="text-2xl font-black mb-2">
                No Freelancers Found 😕
              </h2>
              <p className="text-muted-foreground mb-4">
                Try searching with different skills or keywords
              </p>

              <Button
                onClick={() => {
                  setCategory("");
                  setRating("");
                  setHourlyRate("");
                  setSearch("");
                  setPage(1);
                }}
                className="rounded-xl font-bold"
              >
                Reset Search
              </Button>
            </div>
          ) : (
            freelancers.map((f, i) => (
              <Card
                key={i}
                className="border-none bg-white dark:bg-[#0f172a] shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500 rounded-[2.5rem] overflow-hidden group"
              >
                <CardContent className="p-0">
                  <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8">
                    {/* Avatar & Rating */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-2xl">
                          <AvatarImage src={f?.profilePic} alt={f?.name} />
                          <AvatarFallback>
                            {f?.name?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {f?.isEmailVerified ? (
                          <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-4 border-background p-1.5 rounded-full shadow-lg">
                            <ShieldCheck size={14} className="text-white" />
                          </div>
                        ) : (
                          <div className="absolute -bottom-1 -right-1 bg-gray-500 border-4 border-background p-1.5 rounded-full shadow-lg">
                            <ShieldCheck size={14} className="text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-600 px-3 py-1 rounded-full text-xs font-black">
                        <Star size={14} fill="currentColor" />

                        {f?.averageRating || 0}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-4 text-center md:text-left">
                      <div className="space-y-1">
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                          <h2 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">
                            {f?.name}
                          </h2>
                          <Badge
                            variant="secondary"
                            className="bg-primary/5 text-primary border-none text-[10px] font-bold uppercase tracking-tighter"
                          >
                            Available Now
                          </Badge>
                        </div>
                        <p className="text-primary font-bold text-lg italic">
                          {f?.title}
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest">
                          {f?.categories?.name || "No Category"}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground text-[15px] leading-relaxed max-w-xl line-clamp-3">
                        {f?.bio}
                      </p>

                      <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                        {f?.skills?.map((skill, index) => (
                          <span
                            key={index}
                            className="px-4 py-1 rounded-xl bg-secondary/50 text-secondary-foreground text-xs font-black border border-border/40"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="md:w-48 flex flex-col justify-between items-center md:items-end gap-6 border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0 md:pl-8">
                      <div className="text-center md:text-right">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                          Starting at
                        </p>
                        <div className="flex items-center justify-center gap-1 text-3xl font-black tracking-tighter">
                          {f?.currency === "INR" ? (
                            <IndianRupee size={20} />
                          ) : (
                            <DollarSign size={20} />
                          )}

                          <span>
                            {f?.hourlyRate}
                            <span className="text-sm text-muted-foreground">
                              /hr
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col w-full gap-3">
                        <Link to={`/freelancer-details/${f?.id}`}>
                          <Button className="w-full rounded-2xl font-black h-12 shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center">
                            View Details{" "}
                            <ArrowUpRight
                              size={14}
                              className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                            />
                          </Button>
                        </Link>
                        <a href={f?.portfolio}>
                          <Button
                            variant="outline"
                            className="w-full rounded-2xl font-bold h-12 flex items-center gap-2 group/btn"
                          >
                            Portfolio{" "}
                            <ExternalLink
                              size={14}
                              className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                            />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div className="bg-secondary/20 dark:bg-secondary/5 px-8 py-4 flex flex-wrap justify-center md:justify-between items-center gap-4 border-t border-border/10">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-muted-foreground">
                        <MapPin size={14} className="text-primary" />{" "}
                        {f?.address}
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-muted-foreground">
                        <Zap size={14} className="text-orange-500" /> 100%
                        Success Rate
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[12px] font-black text-emerald-600">
                      <MessageSquare size={14} /> Quick Responder
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          <WithPagination
            page={page}
            totalPages={pagination?.totalPages}
            onPageChange={setPage}
          />
        </main>
      </div>
    </div>
  );
};

export default FindFreelancers;
