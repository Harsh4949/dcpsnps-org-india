{ /*  Login Modal Component */ }

import { useState } from 'react';
import logo from '../assets/logo1.png';
import Register from './Register'; 
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';

const LoginModal = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  ///--------Register Modal State Management--------
  const [showRegister, setShowRegister] = useState(false);

  const openRegisterModal = () => setShowRegister(true);
  const closeRegisterModal = () => setShowRegister(false);

  return (
    <>
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[95%] max-w-lg p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <img src={logo} alt="Logo" className="h-12" />
        </div>
        

        {/* Heading */}
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-1">
          Welcome to DCPS
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Sign in to continue
        </p>

        {/* Google Sign In */}
        <button className="flex items-center justify-center gap-3 border border-gray-300 py-2 px-4 rounded w-full hover:bg-gray-100">
          <FaGoogle className="text-red-500" />
          <span className="text-sm text-gray-700">Sign in with Google</span>
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-sm text-gray-500">Or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Email Input */}
        <div className="relative mb-4">
          <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full text-gray-400 pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <FaLock className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter password"
            className="w-full text-gray-400 pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Forgot Password */}
        <div className="text-right  text-orange-600 mt-2">
          <a href="#" className="text-sm">
            Forgot Password?
          </a>
        </div>

        {/* Login Button */}
        <button className="mt-6 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition">
          Login
        </button>

        {/* Register */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <a href="#" onClick={openRegisterModal} className="text-orange-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
    {showRegister && <Register onClose={closeRegisterModal} />}
    </>
  );
};

export default LoginModal;
