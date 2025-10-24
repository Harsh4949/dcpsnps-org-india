import { useState, useEffect } from "react";
import logo from "../assets/logo1.png";
import emailjs from "@emailjs/browser";
import { fetchSignInMethodsForEmail } from "firebase/auth";



import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  FaCalendarAlt,
  FaPhone,
  FaVenusMars,
} from "react-icons/fa";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import statesWithDistricts from "../components/StatesWithDistricts.jsx";




const Register = ({ onClose, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    gender: "",
    dob: "",
    state: "",
    district: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState("");

  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");

  // ✅ Auto check username availability
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.username.trim()) {
        const snapshot = await get(ref(db, "users"));
        let taken = false;
        snapshot.forEach((child) => {
          if (child.val().username === formData.username) taken = true;
        });
        setUsernameAvailable(!taken);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [formData.username]);

  // ✅ Realtime password strength
  useEffect(() => {
    const pwd = formData.password;
    if (!pwd) return setPasswordStrength("");

    const weakRegex = /^.{1,7}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (weakRegex.test(pwd)) setPasswordStrength("Weak");
    else if (strongRegex.test(pwd)) setPasswordStrength("Strong");
    else if (mediumRegex.test(pwd)) setPasswordStrength("Medium");
  }, [formData.password]);

  // ✅ Password Validation (strict)
  const isPasswordValid = (pwd) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  // ✅ Handle Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid(formData.password)) {
      return toast.error(
        "Password must be 8+ chars, include uppercase, lowercase, number & symbol."
      );
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    setLoading(true);

    try {
      // 🚨 Double check email before OTP
       const methods = await fetchSignInMethodsForEmail(auth, formData.email);
    const emailExists = methods.length > 0;

    if (emailExists) {
      toast.warning("⚠️ Email already exists. Please login instead.");
      setLoading(false);
      return; // ⛔ STOP – no OTP will be sent
    }

      // ✅ Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);

      // ✅ Send OTP
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          email: formData.email,
          passcode: otp,
          time: new Date(Date.now() + 15 * 60000).toLocaleTimeString(),
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast.success("OTP sent to your email!");
      setShowOtpPopup(true);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to send OTP.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ OTP Verification & Registration
  const handleVerifyOtp = async () => {
    if (enteredOtp === generatedOtp) {
      try {
        // Create Firebase user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        // Save to Realtime DB
        await set(ref(db, "users/" + user.uid), {
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          fullname: `${formData.firstName} ${
            formData.middleName ? formData.middleName + " " : ""
          }${formData.lastName}`,
          username: formData.username,
          gender: formData.gender,
          dob: formData.dob,
          state: formData.state,
          district: formData.district,
          email: formData.email,
          phone: formData.phone,
          createdAt: new Date().toISOString(),
        });

        await signOut(auth);
        toast.success("🎉 Registered Successfully!");
        setShowOtpPopup(false);
        onSwitchToLogin();
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      toast.error("❌ Invalid OTP. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-2">
      {/* Dimmed background */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
        aria-label="Close modal"
      />
      {/* Modal content */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh] z-10">
        {/* Close */}
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

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full text-gray-700"
            />
            <input
              type="text"
              name="middleName"
              placeholder="Middle Name"
              value={formData.middleName}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full text-gray-700"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full text-gray-700"
            />
          </div>

          {/* Username */}
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-24 py-2 border rounded text-gray-700"
            />
            {usernameAvailable !== null && (
              <span
                className={`absolute right-3 top-3 text-sm ${
                  usernameAvailable ? "text-green-600" : "text-red-600"
                }`}
              >
                {usernameAvailable ? "✓ Available" : "✗ Already Taken"}
              </span>
            )}
          </div>

          {/* Gender Row */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <label className="flex items-center gap-2 text-gray-700">
              <FaVenusMars /> Gender
            </label>
            <div className="flex items-center gap-4 ">
              {["Male", "Female", "Other"].map((g) => (
                <label
                  key={g}
                  className="flex items-center gap-2 text-gray-600"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleChange}
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          {/* DOB */}
          <div className="relative">
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

          {/* State & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-600">
            <select
              name="state"
              value={formData.state}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  state: e.target.value,
                  district: "",
                })
              }
              required
              className="border rounded p-2"
            >
              <option value="">Select State</option>
              {Object.keys(statesWithDistricts).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
              className="border rounded p-2"
              disabled={!formData.state}
            >
              <option value="">Select District</option>
              {formData.state &&
                statesWithDistricts[formData.state].map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
            </select>
          </div>

          {/* Phone */}
          <div className="relative">
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

          {/* Email */}
          <div className="relative">
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

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (8+ chars, Aa1@)"
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

          {/* ✅ Password Strength Meter */}
          {passwordStrength && (
            <p
              className={`text-sm font-semibold ${
                passwordStrength === "Weak"
                  ? "text-red-500"
                  : passwordStrength === "Medium"
                  ? "text-yellow-500"
                  : "text-green-600"
              }`}
            >
              Password Strength: {passwordStrength}
            </p>
          )}

          {/* Confirm Password */}
          <div className="relative mb-2">
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-10 py-2 border rounded text-gray-700"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded transition ${
              !loading
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-orange-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>

      {/* OTP Verification Popup */}
      {showOtpPopup && (
        <div className="fixed inset-0 flex items-center justify-center   z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Verify Email
            </h3>
            <input
              type="text"
              placeholder="Enter OTP"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              className="border p-2 w-full mb-3 text-gray-900"
            />
            <button
              onClick={handleVerifyOtp}
              className="bg-orange-500 text-white w-full py-2 rounded hover:bg-orange-600"
            >
              Verify & Register
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
