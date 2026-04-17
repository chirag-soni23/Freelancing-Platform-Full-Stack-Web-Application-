import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/dashboard/Dashboard";
import { AppLayout } from "@/dashboard/layouts/AppLayout";
import ClientSignUp from "@/pages/ClientSignUp";
import FindFreelancers from "@/pages/FindFreelancers";
import FindWork from "@/pages/FindWork";
import FreeLancerSignUp from "@/pages/FreeLancerSignup";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import WorkDetail from "@/pages/WorkDetail";
import React from "react";
import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/client-signup" element={<ClientSignUp />} />
        <Route path="/freelancer-signup" element={<FreeLancerSignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/find-work" element={<FindWork />} />
          <Route path="/find-freelancers" element={<FindFreelancers />} />
          <Route path="/work-detail/:id" element={<WorkDetail />} />
        </Route>

        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<Dashboard />}></Route>
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
