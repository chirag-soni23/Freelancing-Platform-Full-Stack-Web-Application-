import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

import Profile from "@/pages/Profile";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import Contact from "@/pages/Contact";
import FreelancerDetails from "@/pages/FreelancerDetails";
import JobDetails from "@/pages/JobDetails";
import Chat from "@/pages/Chat";
import Review from "@/dashboard/Review";
import ScrollToTop from "@/hoc/ScrollToTop";
import SavedProjects from "@/pages/SavedProjects";
import SavedFreelancers from "@/pages/SaveFreelancers";

import Jobs from "@/client/pages/Jobs";
import Category from "@/admin/pages/Category";
import Freelancers from "@/admin/pages/Freelancers";
import Client from "@/admin/pages/Client";
import AdminJobs from "@/admin/pages/AdminJobs";
import { useAuth } from "@/hooks/useAuth";
import FreelancerBid from "@/freelancers/pages/FreelancerBid";
import ClientBid from "@/client/pages/ClientBid";
import ClientJobDetails from "@/client/pages/ClientJobDetails";
import Notifications from "@/freelancers/pages/Notifications";

/* =========================
   LAZY IMPORTS
========================= */

const MainLayout = lazy(() => import("@/components/layout/MainLayout"));

const AppLayout = lazy(() =>
  import("@/dashboard/layouts/AppLayout").then((m) => ({
    default: m.AppLayout,
  })),
);

const FreelancerDashboard = lazy(
  () => import("@/freelancers/FreelancerDashboard"),
);

const ClientDashboard = lazy(() => import("@/client/ClientDashboard"));
const ClientSignUp = lazy(() => import("@/pages/ClientSignUp"));

const FindFreelancers = lazy(() => import("@/pages/FindFreelancers"));

const FindWork = lazy(() => import("@/pages/FindWork"));

const FreeLancerSignUp = lazy(() => import("@/pages/FreeLancerSignup"));

const Home = lazy(() => import("@/pages/Home"));

const Login = lazy(() => import("@/pages/Login"));

const ResetPassword = lazy(() => import("@/pages/ResetPassword"));

const WorkDetail = lazy(() => import("@/pages/WorkDetail"));

const NotFound = lazy(() => import("@/pages/NotFound"));

/* =========================
   ADMIN
========================= */

const AdminDashboard = lazy(() => import("@/admin/pages/AdminDashboard"));

/* =========================
   LOADER
========================= */

const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
  </div>
);

/* =========================
   ROUTES
========================= */

const AppRoutes = () => {
  const { user } = useAuth();

  const role = user?.data?.role;
  return (
    <Suspense fallback={<Loader />}>
      <ScrollToTop />

      <Routes>
        {/* =========================
            PUBLIC
        ========================= */}

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

        {/* =========================
            MAIN
        ========================= */}

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />

          <Route path="contact" element={<Contact />} />

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

          <Route
            path="saved-projects"
            element={
              <ProtectedRoute>
                <SavedProjects />
              </ProtectedRoute>
            }
          />

          <Route
            path="saved-freelancers"
            element={
              <ProtectedRoute>
                <SavedFreelancers />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* =========================
            USER DASHBOARD
        ========================= */}

        <Route
          path="/dashboard"
          element={
            user?.data?.role === "admin" ? (
              <NotFound />
            ) : (
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            )
          }
        >

         
          <Route
            index
            element={
              role === "freelancer" ? (
                <FreelancerDashboard />
              ) : role === "client" ? (
                <ClientDashboard />
              ) : (
                <NotFound />
              )
            }
          />

          <Route path="notifications" element={role === "freelancer" && <Notifications/>}/>

          <Route
            path="my-bids"
            element={role === "freelancer" && <FreelancerBid />}
          />
          <Route path="chats" element={<Chat />} />

          <Route path="rating-and-reviews" element={<Review />} />

          <Route
            path="jobs"
            element={
              <RoleProtectedRoute allowedRoles={["client"]}>
                <Jobs />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="job/:id"
            element={
              <RoleProtectedRoute allowedRoles={["client"]}>
                <ClientJobDetails />
              </RoleProtectedRoute>
            }
          />
        </Route>

        {/* =========================
            ADMIN DASHBOARD
        ========================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="category"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <Category />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="freelancers"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <Freelancers />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="clients"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <Client />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="jobs"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <AdminJobs />
              </RoleProtectedRoute>
            }
          />
        </Route>

        {/* =========================
            NOT FOUND
        ========================= */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
