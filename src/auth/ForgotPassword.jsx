//=====Implementation Of Forgot Password=======//

import { useState } from "react";
import logo from "../assets/logo1.png";
import { FaEnvelope } from "react-icons/fa";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

/**
 * ForgotPassword component
 * Props:
 *  - onClose: closes the modal
 *  - onSwitchToLogin: switches to Login modal after process
 */
const ForgotPassword = ({ onClose, onSwitchToLogin }) => {
  // State to store email entered by user
  const [email, setEmail] = useState("");
  // Loading state to disable button during request
  const [loading, setLoading] = useState(false);

  /**
   * Handle form submission
   * Sends Firebase password reset email to the entered user email
   */
  const handleSubmit = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      // Send reset email using Firebase Auth
      await sendPasswordResetEmail(auth, email);
      alert(`Password reset link has been sent to ${email}`);
      onSwitchToLogin(); // Redirect user back to login screen
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[95%] max-w-lg p-8 relative">
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
          Forgot Password
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Enter your email to reset your password
        </p>

        {/* Email Input */}
        <div className="relative mb-6 text-gray-700">
          <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* Switch to Login */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Remembered your password?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-orange-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
