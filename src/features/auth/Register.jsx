import { useState } from "react";
import logo from "../../assets/logo1.png";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { auth, db } from "../../services/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { toast } from "react-toastify";

const Register = ({ onClose, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.username) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // update display name
      await updateProfile(user, { displayName: formData.username });

      // Save basic profile in realtime DB
      await set(ref(db, "users/" + user.uid), {
        username: formData.username,
        email: formData.email,
        createdAt: new Date().toISOString(),
      });

      await sendEmailVerification(user);
      toast.success("Account created. Verification email sent.");
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-[95%] max-w-lg p-8 z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl">×</button>

        <div className="flex justify-center mb-5">
          <img src={logo} alt="Logo" className="h-12" />
        </div>

        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-1">Create your account</h2>
        <p className="text-center text-sm text-gray-600 mb-6">Join the DCPS community</p>

        <div className="relative mb-4">
          <FaUser className="absolute left-3 top-3.5 text-gray-400" />
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="relative mb-4">
          <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="relative mb-4">
          <FaLock className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full pl-10 pr-10 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button onClick={handleRegister} disabled={loading} className="mt-2 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition">{loading ? 'Creating...' : 'Create Account'}</button>

        <p className="text-center text-sm text-gray-600 mt-4">Already have an account? <button onClick={onSwitchToLogin} className="text-orange-600 hover:underline">Login</button></p>
      </div>
    </div>
  );
};

export default Register;
