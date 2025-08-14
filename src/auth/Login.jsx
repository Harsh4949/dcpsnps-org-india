import { useState } from "react";
import logo from "../assets/logo1.png";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { auth, db, googleProvider } from "../firebase"; // ✅ Import googleProvider
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { ref, get, set } from "firebase/database";

/**
 * LoginModal Component
 * Props:
 *  - onClose: Close the login modal
 *  - onSwitchToRegister: Switch modal to registration view
 *  - onSwitchToForgot: Switch modal to forgot password view
 */
const LoginModal = ({ onClose, onSwitchToRegister, onSwitchToForgot }) => {
  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  // Controlled form inputs for email and password
  const [formData, setFormData] = useState({ email: "", password: "" });
  // Loading state for disabling buttons during requests
  const [loading, setLoading] = useState(false);

  /** Toggle password visibility */
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  /** Handle form field changes */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Email/Password Login
  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      // Sign in with Firebase email/password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Fetch username from database if available
      const userRef = ref(db, "users/" + user.uid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        alert(`Welcome ${snapshot.val().username || "User"}!`);
      } else {
        alert("Welcome!");
      }

      // Close modal after successful login
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Google Sign-In Handler
   * - Uses Firebase Popup Auth
   * - Saves new user to database if not already registered
   */
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider); // ✅ Now using imported provider
      const user = result.user;

      // Save user to Realtime Database if new
      const userRef = ref(db, "users/" + user.uid);
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        await set(userRef, {
          username: user.displayName || "",
          email: user.email || "",
          createdAt: new Date().toISOString(),
        });
      }

      alert(`Welcome ${user.displayName || "User"}!`);
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
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

        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-1">
          Welcome to DCPS
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Sign in to continue
        </p>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 border border-gray-300 py-2 px-4 rounded w-full hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500"
            viewBox="0 0 48 48"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.84-6.84C35.28 2.55 29.91 0 24 0 14.64 0 6.4 5.64 2.54 13.8l7.9 6.13C12.38 13.71 17.73 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.1 24.5c0-1.52-.14-2.98-.4-4.4H24v8.32h12.4c-.54 2.9-2.14 5.36-4.54 7.02l7.14 5.54C43.6 36.74 46.1 30.97 46.1 24.5z"
            />
            <path
              fill="#FBBC05"
              d="M10.44 28.93c-.6-1.76-.94-3.63-.94-5.57 0-1.94.34-3.8.94-5.57L2.54 13.8C.9 17.36 0 20.96 0 24.5s.9 7.14 2.54 10.7l7.9-6.27z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.92-2.14 15.9-5.8l-7.14-5.54c-2.06 1.38-4.72 2.18-8.76 2.18-6.27 0-11.62-4.21-13.52-9.96l-7.9 6.27C6.4 42.36 14.64 48 24 48z"
            />
          </svg>
          <span className="text-sm text-gray-700">Sign in with Google</span>
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-sm text-gray-500">Or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className="w-full text-gray-700 pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <FaLock className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
            className="w-full text-gray-700 pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
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
        <div className="text-right text-orange-600 mt-2">
          <button
            onClick={onSwitchToForgot}
            className="text-sm hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-6 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Switch to Register */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-orange-600 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
