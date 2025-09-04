import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/clickedUserProfilePage";
import Contact from "./pages/Contact";
import About from "./pages/About"
import Footer from "./components/Footer";
import SwapsPage from "./pages/SwapPage";
import Announcements from "./pages/Announcement";

import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const App = () => {
  const location = useLocation();
  const token = localStorage.getItem("token"); // check token

  // hide Navbar on login/register pages
  const hideNavbarPaths = ["/login", "/register"];
  const shouldShowNavbar =
    token && !hideNavbarPaths.includes(location.pathname);

  return (
    <div>
    <ToastContainer />

      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
          />

        {/* "/home" route */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/request-profile/:id" element={<ProfilePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/swap-page" element={<SwapsPage />} />
        <Route path="/announcement" element={<Announcements />} />

      </Routes>
      {shouldShowNavbar && <Footer />}
    </div>
  );
};

export default App;
