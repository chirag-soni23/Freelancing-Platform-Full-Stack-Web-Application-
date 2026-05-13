import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Profile from "@/pages/Profile";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import Category from "@/client/pages/Category";
import Jobs from "@/client/pages/Jobs";
import RoleProtectedRoute from "./RoleProtectedRoute";
import Contact from "@/pages/Contact";
import FreelancerDetails from "@/pages/FreelancerDetails";
import JobDetails from "@/pages/JobDetails";
import Chat from "@/pages/Chat";

const MainLayout = lazy(() => import("@/components/layout/MainLayout"));
const Dashboard = lazy(() => import("@/dashboard/Dashboard"));
const AppLayout = lazy(() =>
  import("@/dashboard/layouts/AppLayout").then((m) => ({
    default: m.AppLayout,
  })),
);

const ClientSignUp = lazy(() => import("@/pages/ClientSignUp"));
const FindFreelancers = lazy(() => import("@/pages/FindFreelancers"));
const FindWork = lazy(() => import("@/pages/FindWork"));
const FreeLancerSignUp = lazy(() => import("@/pages/FreeLancerSignup"));
const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/Login"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const WorkDetail = lazy(() => import("@/pages/WorkDetail"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* PUBLIC */}
        <Route
          path="/client-signup"
          element={
            <PublicRoute>
              <ClientSignUp />
            </PublicRoute>
          }
        />

        <Route
          path="/freelancer-signup"
          element={
            <PublicRoute>
              <FreeLancerSignUp />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

        {/* MAIN */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="find-work" element={<FindWork />} />
          <Route path="find-freelancers" element={<FindFreelancers />} />
          <Route
            path="freelancer-details/:id"
            element={<FreelancerDetails />}
          />
          <Route path="job-details/:id" element={<JobDetails />} />
          <Route path="work-detail/:id" element={<WorkDetail />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* PROTECTED */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          {/* CLIENT */}
          <Route
            path="category"
            element={
              <RoleProtectedRoute allowedRoles={["client"]}>
                <Category />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="jobs"
            element={
              <RoleProtectedRoute allowedRoles={["client"]}>
                <Jobs />
              </RoleProtectedRoute>
            }
          />
          <Route path="chats" element={<Chat />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
