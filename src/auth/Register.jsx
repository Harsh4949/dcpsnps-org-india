{ /* Register Component */ }

import { useState } from 'react';
import logo from '../assets/logo1.png';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaCalendarAlt, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Register = ({ onClose, onSwitchToLogin }) => {

  //------State for password visibility-----------
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    //------State for Register Modal------------
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
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

        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-1">
          Create an Account
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Fill in your details to get started
        </p>

        {/* Username */}
        <div className="relative mb-4">
          <FaUser className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Username"
            className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black text-gray-700"
          />
        </div>

        {/* DOB */}
        <div className="relative mb-4">
          <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="date"
            placeholder="Date of Birth"
            className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black text-gray-700"
          />
        </div>

        {/* State */}
        <div className="relative mb-4">
          <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="State"
            className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black text-gray-700"
          />
        </div>

        {/* District */}
        <div className="relative mb-4">
          <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="District"
            className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black text-gray-700"
          />
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black text-gray-700"
          />
        </div>

        {/* Phone */}
        <div className="relative mb-4">
          <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black text-gray-700"
          />
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <FaLock className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black text-gray-700"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Register Button */}
        <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition">
          Register
        </button>

        {/* Login Switch Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <a
            href="#"
            onClick={() => {
              onClose(); // Close Register modal
              onSwitchToLogin(); // Show Login modal
            }}
            className="text-orange-600 hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
