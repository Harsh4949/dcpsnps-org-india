import { useState } from 'react';
import logo from '../assets/logo1.png';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaCalendarAlt, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';

/**
 * Register Component
 * Props:
 *  - onClose: closes the modal
 *  - onSwitchToLogin: switches to the login modal
 */
const Register = ({ onClose, onSwitchToLogin }) => {
  // Toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  // Controlled form data state
  const [formData, setFormData] = useState({
    username: '',
    dob: '',
    state: '',
    district: '',
    email: '',
    phone: '',
    password: ''
  });

  // Loading state for disabling submit button when processing
  const [loading, setLoading] = useState(false);

  /** Handle input changes */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

   /**
   * Form submission handler
   * - Creates user in Firebase Authentication
   * - Stores additional profile info in Realtime Database
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Save additional data in Realtime Database
      await set(ref(db, 'users/' + user.uid), {
        username: formData.username,
        dob: formData.dob,
        state: formData.state,
        district: formData.district,
        email: formData.email,
        phone: formData.phone,
        createdAt: new Date().toISOString()
      });

      alert('Registration successful! You can now log in.');
      onSwitchToLogin(); // Switch to login modal
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

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

        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-1">Create an Account</h2>
        <p className="text-center text-sm text-gray-600 mb-6">Fill in your details to get started</p>

          {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="relative mb-4">
            <FaUser className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border rounded text-gray-700"
            />
          </div>

          {/* DOB */}
          <div className="relative mb-4">
            <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border rounded text-gray-700"
            />
          </div>

          {/* State */}
          <div className="relative mb-4">
            <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border rounded text-gray-700"
            />
          </div>

          {/* District */}
          <div className="relative mb-4">
            <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              name="district"
              placeholder="District"
              value={formData.district}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border rounded text-gray-700"
            />
          </div>

          {/* Email */}
          <div className="relative mb-4">
            <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border rounded text-gray-700"
            />
          </div>

          {/* Phone */}
          <div className="relative mb-4">
            <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border rounded text-gray-700"
            />
          </div>

          {/* Password */}
          <div className="relative mb-6">
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-10 py-2 border rounded text-gray-700"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

         {/* Switch to Login */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-orange-600 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
