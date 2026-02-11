<<<<<<< HEAD
import { useEffect, useState } from "react";
import { auth, db } from "../../services/firebase";
import {
  createUserWithEmailAndPassword,
=======
import { useState } from "react";
import { auth, db } from "../../services/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
>>>>>>> d32abf9dff35e8ad3481a74ce4f03e88044d8c3a
  updateProfile,
  signOut,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { toast } from "react-toastify";
<<<<<<< HEAD
import emailjs from "@emailjs/browser";

import {
  getStatesOfIndia,
  getDistrictsOfState,
} from "../../services/locationApi";
import logo from "../../assets/logo1.png";

const OTP_EXPIRY_TIME = 300;
const OTP_MAX_ATTEMPTS = 3;

const Register = ({ onClose }) => {
=======

const Register = ({ onClose, onSwitchToLogin }) => {
>>>>>>> d32abf9dff35e8ad3481a74ce4f03e88044d8c3a
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

<<<<<<< HEAD
  // OTP
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpAttempts, setOtpAttempts] = useState(0);

  // Location
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dob: "",
    mobile: "",
    state: "",
    stateIso: "",
    district: "",
    village: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const fieldStyle =
    "w-full rounded-md border border-blue-200 px-4 py-2.5 text-sm " +
    "text-black placeholder:text-black bg-white appearance-none " +
    "focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-400 mb-3";

  /* ================= OTP TIMERS ================= */

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setInterval(() => setResendTimer((v) => v - 1), 1000);
      return () => clearInterval(t);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (otpTimer > 0) {
      const t = setInterval(() => setOtpTimer((v) => v - 1), 1000);
      return () => clearInterval(t);
    }
    if (otpTimer === 0 && otpSent && !emailVerified) {
      toast.error("OTP expired. Please resend OTP.");
      setOtpSent(false);
    }
  }, [otpTimer, otpSent, emailVerified]);

  /* ================= OTP ================= */

  const generateOtp = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const sendEmailOtp = async () => {
    if (!formData.email) {
      toast.error("Enter email first");
      return;
    }

    const otp = generateOtp();
    setGeneratedOtp(otp);
    setOtpSent(true);
    setOtpTimer(OTP_EXPIRY_TIME);
    setOtpAttempts(0);
    setResendTimer(60);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { to_email: formData.email, otp },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      toast.success("OTP sent to email");
    } catch {
      toast.error("Failed to send OTP");
    }
  };

  const verifyOtp = () => {
    if (otpAttempts >= OTP_MAX_ATTEMPTS) {
      toast.error("Too many attempts. Please resend OTP.");
      return;
    }

    if (enteredOtp !== generatedOtp) {
      setOtpAttempts((v) => v + 1);
      toast.error("Invalid OTP");
      return;
    }

    setEmailVerified(true);
  };

  /* ================= LOCATION ================= */

  useEffect(() => {
    getStatesOfIndia().then(setStates);
  }, []);

  const handleStateChange = async (e) => {
    const s = states.find((x) => x.name === e.target.value);
    if (!s) return;
    setFormData({ ...formData, state: s.name, stateIso: s.iso2, district: "" });
    setDistricts(await getDistrictsOfState(s.iso2));
  };

  /* ================= REGISTER ================= */

  const handleRegister = async () => {
    if (!emailVerified) {
      toast.error("Verify email first");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
=======
  // OTP (demo)
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    village: "",
    district: "",
    state: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 📲 SEND OTP (DEMO)
  const sendOtp = () => {
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Enter valid 10-digit mobile number");
      return;
    }

    const otp = "123456";
    setGeneratedOtp(otp);
    setOtpSent(true);

    console.log("DEMO OTP:", otp);
    toast.success("OTP sent (demo: 123456)");
  };

  // ✅ VERIFY OTP
  const verifyOtp = () => {
    if (enteredOtp === generatedOtp) {
      setPhoneVerified(true);
      toast.success("Mobile number verified");
    } else {
      toast.error("Invalid OTP");
    }
  };

  const validateForm = () => {
    if (Object.values(formData).some((v) => !v)) {
      toast.error("Please fill all fields");
      return false;
    }

    if (!phoneVerified) {
      toast.error("Please verify mobile number");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  // 🧾 REGISTER
  const handleRegister = async () => {
    if (!validateForm()) return;
>>>>>>> d32abf9dff35e8ad3481a74ce4f03e88044d8c3a

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

<<<<<<< HEAD
      const fullName = `${formData.firstName} ${formData.middleName} ${formData.lastName}`;
      await updateProfile(user, { displayName: fullName });

      await set(ref(db, `users/${user.uid}`), {
        ...formData,
        fullName,
        emailVerified: true,
        createdAt: Date.now(),
      });

      await signOut(auth);
      setRegisteredEmail(formData.email);
      setSuccess(true);
    } catch {
      toast.error("Registration failed");
=======
      await updateProfile(user, {
        displayName: formData.fullName,
      });

      await set(ref(db, `users/${user.uid}`), {
        fullName: formData.fullName,
        gender: formData.gender,
        dob: formData.dob,
        email: formData.email,
        phone: formData.phone,
        phoneVerified: true,
        address: {
          village: formData.village,
          district: formData.district,
          state: formData.state,
        },
        createdAt: Date.now(),
      });

      await sendEmailVerification(user, {
        url: window.location.origin,
      });

      await signOut(auth);

      setRegisteredEmail(formData.email);
      setSuccess(true);
    } catch (error) {
      toast.error(
        error.code === "auth/email-already-in-use"
          ? "Email already registered"
          : "Registration failed"
      );
>>>>>>> d32abf9dff35e8ad3481a74ce4f03e88044d8c3a
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative bg-white w-[95%] max-w-md rounded-lg shadow-lg max-h-[90vh] overflow-hidden">
        <div className="p-5 max-h-[90vh] overflow-y-auto">

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-xl text-gray-400 hover:text-red-500"
          >
            ✕
          </button>
          <div className="flex justify-center mb-4">
  <img src={logo} alt="logo" className="h-12" />
</div>

          <h2 className="text-xl font-semibold text-center mb-4">
            User Registration
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Create your account
          </p>

          {!success ? (
            <>
              <input className={fieldStyle} placeholder="First Name" onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
              <input className={fieldStyle} placeholder="Middle Name" onChange={(e) => setFormData({ ...formData, middleName: e.target.value })} />
              <input className={fieldStyle} placeholder="Last Name" onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />

              <select className={fieldStyle} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <input type="date" className={fieldStyle} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />

              <input className={fieldStyle} placeholder="Mobile Number" onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />

              <select className={fieldStyle} onChange={handleStateChange}>
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.iso2}>{s.name}</option>
                ))}
              </select>

              <select className={fieldStyle} onChange={(e) => setFormData({ ...formData, district: e.target.value })}>
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id}>{d.name}</option>
                ))}
              </select>

              <input className={fieldStyle} placeholder="Village" onChange={(e) => setFormData({ ...formData, village: e.target.value })} />
              <input className={fieldStyle} placeholder="Email Address" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

              {/* ===== OTP SECTION (ADJUSTED) ===== */}
              <div className="">
                <button
                  onClick={sendEmailOtp}
                  className="w-full bg-orange-100 text-orange-600 py-2 rounded-lg font-medium mb-3"
                >
                  Send Email OTP
                </button>

                <input
                  className={fieldStyle}
                  placeholder="Enter OTP"
                  onChange={(e) => setEnteredOtp(e.target.value)}
                />

                <button
                  onClick={verifyOtp}
                  className="w-full bg-orange-100 text-orange-600 py-2 rounded-lg font-medium mb-3"
                >
                  Verify OTP
                </button>
              </div>

              {/* ===== PASSWORD SECTION ===== */}
              <input type="password" className={fieldStyle} placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              <input type="password" className={fieldStyle} placeholder="Confirm Password" onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />

              <button onClick={handleRegister} className="w-full bg-orange-500 text-white py-3 rounded-xl">
                Register
              </button>
            </>
          ) : (
            <div className="text-center py-10">
              <h2 className="text-orange-600 font-semibold text-lg">
                Registration Successful
              </h2>
              <p>{registeredEmail}</p>
            </div>
          )}
        </div>
=======
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="relative bg-white w-[95%] max-w-md rounded-lg shadow-lg p-5"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* ❌ CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
          title="Close"
        >
          ✕
        </button>

        {!success ? (
          <>
            <h2 className="text-xl font-semibold text-center text-black mb-3">
              User Registration
            </h2>

            <input className="input" name="fullName" placeholder="Full Name" onChange={handleChange} />
            <select className="input" name="gender" onChange={handleChange}>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <input className="input" type="date" name="dob" onChange={handleChange} />
            <input className="input" name="village" placeholder="Village" onChange={handleChange} />
            <input className="input" name="district" placeholder="District" onChange={handleChange} />
            <input className="input" name="state" placeholder="State" onChange={handleChange} />
            <input className="input" name="email" placeholder="Email Address" onChange={handleChange} />
            <input className="input" name="phone" placeholder="Mobile Number" onChange={handleChange} />

            <button onClick={sendOtp} className="btn-blue">Send OTP</button>

            <input
              className="input"
              placeholder="Enter OTP"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              disabled={!otpSent}
            />

            <button onClick={verifyOtp} disabled={!otpSent} className="btn-green">
              Verify OTP
            </button>

            <input
              className="input"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />

            <button onClick={handleRegister} disabled={loading} className="btn-orange">
              {loading ? "Creating Account..." : "Register"}
            </button>

            <p className="text-center text-sm text-black mt-2">
              Already have an account?{" "}
              <button onClick={onSwitchToLogin} className="text-orange-600 font-medium">
                Login
              </button>
            </p>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-green-600">
              🎉 Registration Successful
            </h2>
            <p className="text-black mt-2">
              Verification email sent to
            </p>
            <p className="font-semibold text-orange-600">
              {registeredEmail}
            </p>

            <button onClick={onSwitchToLogin} className="btn-orange mt-4">
              Go to Login
            </button>
          </div>
        )}
>>>>>>> d32abf9dff35e8ad3481a74ce4f03e88044d8c3a
      </div>
    </div>
  );
};

export default Register;
