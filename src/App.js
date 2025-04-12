// FrontEnd/src/App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/navbar";
import DashboardNavbar from "./components/DashboardNavbar";
import Sections from "./components/section";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Appointments from "./components/Appointments";
import MentorOnboarding from "./components/MentorOnboarding";
import Matchmaking from "./components/Matchmaking";
import MentorProfileDetails from "./components/MentorProfileDetails";
import ConnectionRequests from "./components/ConnectionRequests";
import Chatbot from "./components/Chatbot"; // Import Chatbot

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  return (
    <Router>
      <Layout
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        userRole={userRole}
        setUserRole={setUserRole}
      />
    </Router>
  );
}

function Layout({ loggedIn, setLoggedIn, userRole, setUserRole }) {
  const location = useLocation();

  // Display DashboardNavbar if user is logged in and on dashboard-related paths.
  const dashboardPaths = [
    "/dashboard",
    "/profile",
    "/appointments",
    "/chat",
    "/matchmaking",
    "/requests",
  ];
  const showDashboardNav = loggedIn && dashboardPaths.includes(location.pathname);

  return (
    <>
      {showDashboardNav ? (
        <DashboardNavbar user={userRole} />
      ) : (
        <Navbar
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          userRole={userRole}
        />
      )}
      <Routes>
        <Route path="/" element={<Sections />} />
        <Route
          path="/login"
          element={
            <AuthPage
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
              setUserRole={setUserRole}
              defaultTab="login"
            />
          }
        />
        <Route
          path="/signup"
          element={
            <AuthPage
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
              setUserRole={setUserRole}
              defaultTab="signup"
            />
          }
        />
        <Route path="/dashboard" element={<Dashboard userRole={userRole} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/mentors" element={<MentorOnboarding />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/matchmaking" element={<Matchmaking />} />
        <Route path="/mentor/:mentorId" element={<MentorProfileDetails />} />
        <Route path="/requests" element={<ConnectionRequests />} />
      </Routes>
    </>
  );
}

export default App;
