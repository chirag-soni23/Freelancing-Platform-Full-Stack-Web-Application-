import React from "react";
import { ArrowLeft, ArrowRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const jobs = [
  {
    title: "Logo Design",
    category: "Design",
    desc: "Need a professional logo with writing underneath for our jewellery company",
    price: "$500",
  },
  {
    title: "Graphic Design",
    category: "UI/UX",
    desc: "We need a graphic designer with UI/UX skills for our Furniture company",
    price: "$500",
  },
  {
    title: "SEO Specialist",
    category: "Marketing",
    desc: "Need a SEO expert for our company who will take our visibility to a higher level",
    price: "$300",
  },
];

const RecentWork = () => {
  return (
    <section className="py-20 bg-slate-50/50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <Badge
              variant="outline"
              className="mb-3 px-3 py-1 text-primary border-primary/20 bg-primary/5"
            >
              Explore Opportunities
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              Recently Posted <span className="text-primary italic">Works</span>
            </h2>
            <p className="mt-4 text-slate-500 dark:text-zinc-400 max-w-md">
              Discover the latest freelance projects from top companies around
              the globe.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-primary hover:text-white transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              className="rounded-full shadow-lg shadow-primary/20"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job, i) => (
            <Card
              key={i}
              className="group border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col justify-between h-full"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Briefcase size={24} />
                  </div>
                  <Badge variant="secondary" className="font-medium">
                    {job.category}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100">
                  {job.title}
                </h3>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2">
                  {job.desc}
                </p>
              </CardContent>

              <CardFooter className=" pt-4 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 -mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Highest Bid
                  </p>
                  <p className="text-lg font-bold text-primary">{job.price}</p>
                </div>

                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary hover:bg-primary/5 font-semibold group/btn"
                >
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-16 text-center">
          <Button size="lg" className="px-8 rounded-full font-semibold">
            View All Postings
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RecentWork;
