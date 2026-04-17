import FreelancersSection from "@/components/home/FreelancersSection";
import Hero from "@/components/home/Hero";
import MockUp from "@/components/home/MockUp";
import Newsletter from "@/components/home/NewSletter";
import RecentWorks from "@/components/home/RecentWork";
import StepsSection from "@/components/home/StepSection";
import React from "react";

const Home = () => {
  return (
    <div>
      <Hero />
      <StepsSection/>
      <FreelancersSection/>
      <MockUp/>
      <RecentWorks/>
      <Newsletter/>
    </div>
  );
};

export default Home;
