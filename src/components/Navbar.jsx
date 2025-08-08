{/* Navbar Component */ }

import logo from '../assets/logo1.png';
import { useState } from "react";
import LoginModal from '../auth/Login';



export default function Navbar() {

  // =============Navbar state and handlers=====================
  const [isOpen, setIsOpen] = useState(false);

    const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleClose = () => {
    setShowLogin(false);
  };

  return (
    <>
      <nav
        style={{ background: "var(--body-color)" }}
        className="shadow-md w-full fixed top-0 left-0 z-50"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="DCPS Logo" className="h-12" />
          
          </div>

          {/* Hamburger Button (Mobile Only) */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            {isOpen ? (
              /* Close Icon (X) */
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              /* Hamburger Icon */
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-10">
            <a
              href="#Home"
              className="text-gray-200 font-medium px-3 py-2 relative group"
            >
              Home
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#About"
              className="text-gray-200 font-medium px-3 py-2 relative group"
            >
              About
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#Contact"
              className="text-gray-200 font-medium px-3 py-2 relative group"
            >
              Contact
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#Post"
              className="text-gray-200 font-medium px-3 py-2 relative group"
            >
              Posts
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <button
              onClick={handleLoginClick}
              className="bg-green-600 h-full items-center text-white font-medium rounded-md px-4 py-2 border-none shadow-sm ml-2"
            >
              Login
            </button>
          </div>
        </div>

        {/* Mobile Menu (Dropdown) */}
        {isOpen && (
          <div className="md:hidden bg-green-600 bg-opacity-95 flex flex-col space-y-4 px-6 py-4">
            <a href="#Home" className="text-white hover:text-yellow-300 transition" onClick={() => setIsOpen(false)}>Home</a>
            <a href="#About" className="text-white hover:text-yellow-300 transition" onClick={() => setIsOpen(false)}>About</a>
            <a href="#Contact" className="text-white hover:text-yellow-300 transition" onClick={() => setIsOpen(false)}>Contact</a>
            <a href="#Post" className="text-white hover:text-yellow-300 transition" onClick={() => setIsOpen(false)}>Posts</a>
            <button
    onClick={handleLoginClick}
    className="bg-green-700 text-white font-medium rounded-md px-4 py-2 border-none shadow-sm"
  >
    Login
  </button>
          </div>
        )}
      </nav>
      {showLogin && <LoginModal onClose={handleClose} />}
    </>
  );
}
