import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/All/HomePage";
import LoginPage from "./pages/All/LoginPage";
import SignupPage from "./pages/All/SignupPage";
import ProfilePage from "./pages/All/ProfilePage";
import UpdateProfilePage from "./pages/All/UpdateProfilePage";
import ContactPage from "./pages/All/ContactPage";
import AboutPage from "./pages/All/AboutPage";
import JobPage from "./pages/JobPages/JobPage";
import JobCreationForm from "./pages/DeptStaffPages/JobCreationForm";
import JobDetailsPage from "./pages/JobPages/JobDetailPage";
import JobApplyPage from "./pages/JobPages/JobApplyPage";
import DeptStaffDashboard from "./pages/DeptStaffPages/DeptStaffDashboard";
import EditJobPage from "./pages/DeptStaffPages/EditJobPage";
import RequireAuth from "./components/Auth/RequireAuth";
import NotRequireAuth from "./components/Auth/NotRequireAuth";
import { Toaster } from "react-hot-toast";
import VerifyAccount from "./pages/User/Verification";
import EmailNotificationPage from "./pages/All/EmailNotificationPage";
import { useSelector } from "react-redux";
import Denied from "./pages/All/Denied";
import ApplicationsPage from "./pages/TApages/ApplicationsPage";
import ForgetPassword from "./pages/All/ForgetPassword";
import ResetPassword from "./pages/All/ResetPassword";
import SetPassword from "./pages/All/SetPassword";
import ApplicationReview from "./pages/Applications/ApplicationReview";
import ApplicationDetailsPage from "./pages/TApages/ApplicationDetailsPage";
import ApplicationReviewByCommittee from "./pages/Applications/ApplicationReviewByCommittee";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CourseCreation from "./pages/Admin/CourseCreation";
import DepartmentCreation from "./pages/Admin/DepartmentCreation";
import InstructorDashboard from "./pages/InstructorPages/InstructorDashboard";
import DashboardTACM from "./pages/TACommitteePages/DashboardTACM";
import ApplicationInvite from "./pages/Applications/ApplicationInvite";

function App() {
  // Fetching logged-in user data from Redux store
  const loggedInUser = useSelector((state) => state?.auth?.data);

  return (
    <Router>
      {/* Displaying Navbar component */}
      <Navbar />

      {/* Toaster component for displaying notifications */}
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>

      {/* Defining routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/verify/:verificationToken" element={<VerifyAccount />} />
        <Route
          path="/email-notification/:emailPrefix"
          element={<EmailNotificationPage />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/denied" element={<Denied />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/job" element={<JobPage />} />
        <Route path="/job_details/:jobId" element={<JobDetailsPage />} />

        {/* Routes for authenticated users */}
        <Route
          element={
            <RequireAuth
              allowedRoles={["USER", "DS", "TACM", "ADMIN", "INS"]}
            />
          }
        >
          {/* Common authenticated user routes */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/update-profile"
            element={<UpdateProfilePage user={loggedInUser} />}
          />
        </Route>

        {/* Routes for authenticated users with specific roles */}
        <Route element={<RequireAuth allowedRoles={["USER"]} />}>
          <Route path="/job/job-apply/:jobId" element={<JobApplyPage />} />
        </Route>

        {/* Routes for Department Staff (DS) */}
        <Route element={<RequireAuth allowedRoles={["DS"]} />}>
          <Route path="/dashboardDS" element={<DeptStaffDashboard />} />
          <Route path="/dashboard/create-job" element={<JobCreationForm />} />
          <Route
            path="/dashboardDS/application-review/:jobId"
            element={<ApplicationReview />}
          />
          <Route
            path="/dashboardDS/application-invite/:jobId"
            element={<ApplicationInvite />}
          />
          <Route
            path="/dashboardDS/edit-job/:jobId"
            element={<EditJobPage />}
          />
        </Route>

        {/* Routes for Admin */}
        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/create-course" element={<CourseCreation />} />
          <Route path="/create-department" element={<DepartmentCreation />} />
        </Route>

        {/* Routes for Instructor */}
        <Route element={<RequireAuth allowedRoles={["INS"]} />}>
          <Route
            path="/instructor-dashboard"
            element={<InstructorDashboard />}
          />
        </Route>

        {/* Routes for TA Committee Member (TACM) */}
        <Route element={<RequireAuth allowedRoles={["TACM"]} />}>
          <Route path="/tacm-dashboard" element={<DashboardTACM />} />
          <Route
            path="/tacm-dashboard/application-review-by-committee/:jobId"
            element={<ApplicationReviewByCommittee />}
          />
        </Route>

        {/* Routes for User/TAs */}
        <Route element={<RequireAuth allowedRoles={["USER"]} />}>
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route
            path="/applications/:jobId"
            element={<ApplicationDetailsPage />}
          />
        </Route>

        {/* Route for non-authenticated users */}
        <Route element={<NotRequireAuth />} />
      </Routes>

      {/* Displaying Footer component */}
      <Footer />
    </Router>
  );
}

export default App;
