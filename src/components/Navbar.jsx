// Navbar Component — shows site navigation, user auth status, and login/logout actions

import logo from '../assets/logo1.png';
import { useState, useEffect } from "react";
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import AuthModalManager from '../auth/ModalManager';
import { FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
 // State to control mobile menu open/close
  const [isOpen, setIsOpen] = useState(false);
 // State to show/hide authentication modal
  const [showAuthModal, setShowAuthModal] = useState(false);
  // Logged-in Firebase Auth user object
  const [user, setUser] = useState(null); 
  // Username fetched from Realtime Database
  const [username, setUsername] = useState("");

 /**
   * useEffect → Listen for Firebase user authentication state changes.
   * When the user logs in, fetch their username from the Realtime Database.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch username from Realtime Database
        const snapshot = await get(ref(db, 'users/' + currentUser.uid));
        if (snapshot.exists()) {
          setUsername(snapshot.val().username || "");
        }
      } else {
        setUser(null);
        setUsername("");
      }
    });

    return () => unsubscribe();
  }, []);
  // Open Login/Auth modal
  const handleAuthOpen = () => setShowAuthModal(true);
  // Close Login/Auth modal
  const handleAuthClose = () => setShowAuthModal(false);
  // Logout user from Firebase
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setUsername("");
  };

  return (
    <>
    {/* Navigation Bar */}
      <nav
        style={{ background: "var(--body-color)" }}
        className="shadow-md w-full fixed top-0 left-0 z-50"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="DCPS Logo" className="h-12" />
          </div>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-10">
            <a href="#Home" className="text-gray-200 font-medium px-3 py-2 relative group">
              Home
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#About" className="text-gray-200 font-medium px-3 py-2 relative group">
              About
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#Contact" className="text-gray-200 font-medium px-3 py-2 relative group">
              Contact
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#Post" className="text-gray-200 font-medium px-3 py-2 relative group">
              Posts
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </a>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-white">
                  <FaUserCircle size={24} />
                  <span>{username || "User"}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleAuthOpen}
                className="bg-green-600 h-full items-center text-white font-medium rounded-md px-4 py-2 border-none shadow-sm ml-2"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-green-600 bg-opacity-95 flex flex-col space-y-4 px-6 py-4">
            <a href="#Home" className="text-white hover:text-yellow-300 transition" onClick={() => setIsOpen(false)}>Home</a>
            <a href="#About" className="text-white hover:text-yellow-300 transition" onClick={() => setIsOpen(false)}>About</a>
            <a href="#Contact" className="text-white hover:text-yellow-300 transition" onClick={() => setIsOpen(false)}>Contact</a>
            <a href="#Post" className="text-white hover:text-yellow-300 transition" onClick={() => setIsOpen(false)}>Posts</a>

            {user ? (
              <>
                <div className="flex items-center space-x-2 text-white">
                  <FaUserCircle size={20} />
                  <span>{username || "User"}</span>
                </div>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => { setIsOpen(false); handleAuthOpen(); }}
                className="bg-green-700 text-white font-medium rounded-md px-4 py-2 border-none shadow-sm"
              >
                Login
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Auth Modal Manager */}
      {showAuthModal && <AuthModalManager onClose={handleAuthClose} />}
    </>
  );
}
