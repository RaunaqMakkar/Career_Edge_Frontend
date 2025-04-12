import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";  // Import HashLink
import "../styles/navbar.css";

const Navbar = ({ loggedIn, setLoggedIn, userRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">Career Edge</div>
      <ul className="navLinks">
        {/* Use HashLink for in-page anchor navigation */}
        <li><HashLink smooth to="/#home">Home</HashLink></li>
        <li><HashLink smooth to="/#services">Services</HashLink></li>
        <li><HashLink smooth to="/#about">About</HashLink></li>
        <li><HashLink smooth to="/#contact">Contact Us</HashLink></li>

        {!loggedIn && (
          <li>
            <Link to="/login" className="nav-button">
              Login
            </Link>
          </li>
        )}
        {loggedIn && (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/appointments">Appointments</Link></li>
            <li><Link to="/chat">AI Chat</Link></li>
            <li>
              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
