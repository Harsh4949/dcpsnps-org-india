// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { auth, db, storage } from "../services/firebase";
import { ref, get, update } from "firebase/database";
import { getDownloadURL, ref as sRef, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  FaUser,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaPhone,
  FaEdit,
  FaVenusMars,
  FaIdBadge,
  FaEnvelope,
} from "react-icons/fa";

export default function Profile() {
  const [userData, setUserData] = useState({});
  const [editField, setEditField] = useState(null);
  const [newValue, setNewValue] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const snapshot = await get(ref(db, "users/" + user.uid));
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      } else {
        // If user logs out, redirect to home page
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleEdit = (field) => {
    setEditField(field);
    setNewValue(userData[field] || "");
  };

const handleSave = async (field) => {
  if (!auth.currentUser) return;

  // If saving one of the name parts, compute a new fullName too
  const nextUser = { ...userData, [field]: newValue };
  const fullName = [nextUser.firstName, nextUser.middleName, nextUser.lastName]
    .filter(Boolean)
    .join(" ");

  await update(ref(db, "users/" + auth.currentUser.uid), {
    [field]: newValue,
    fullName,
  });

  setUserData({ ...nextUser, fullName });
  setEditField(null);
  setNewValue("");
};


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !auth.currentUser) return;

    setUploading(true);
    const storageRef = sRef(storage, `profilePics/${auth.currentUser.uid}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    await updateProfile(auth.currentUser, { photoURL: downloadURL });
    await update(ref(db, "users/" + auth.currentUser.uid), {
      photoURL: downloadURL,
    });

    // Re-fetch user data to update UI
    const snapshot = await get(ref(db, "users/" + auth.currentUser.uid));
    if (snapshot.exists()) {
      setUserData(snapshot.val());
    }

    setUploading(false);
  };

  /** Renders a field row with label, value, and optional edit */
  const renderField = (label, field, icon, editable = false) => {
    const value = userData[field];
    const canEdit = editable || !value; // editable if forced or empty

    return (
      <div className="flex items-center justify-between border-b pb-2">
        <span className="flex items-center space-x-2">
          {icon}
          <span className="font-medium text-gray-700">{label}:</span>
          {editField === field ? (
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="border p-1 rounded ml-2 text-gray-600"
            />
          ) : (
            <span className="text-gray-600 ml-2">
              {value || "Not set"}
            </span>
          )}
        </span>
        {editField === field ? (
          <button
            onClick={() => handleSave(field)}
            className="text-green-600 font-medium"
          >
            Save
          </button>
        ) : (
          canEdit && (
            <FaEdit
              className="text-gray-500 cursor-pointer"
              onClick={() => handleEdit(field)}
            />
          )
        )}
      </div>
    );
  };

  return (
    <div
      style={{ background: "var(--body-color)" }}
      className="pt-24 px-6 min-h-screen bg-gray-50"
    >
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
          My Profile
        </h1>

        {/* Profile Picture */}
        <div className="flex justify-center mb-6 relative">
          <div className="relative group">
            <img
              src={userData.photoURL || "/default-avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-gray-300 object-cover"
            />
            <label
              htmlFor="profilePic"
              className="absolute bottom-0 right-0 bg-gray-700 text-white p-2 rounded-full cursor-pointer flex items-center justify-center"
              style={{ opacity: 1 }} // Always visible
            >
              <FaEdit size={16} />
            </label>
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 rounded-full">
              <span className="text-gray-700">Uploading...</span>
            </div>
          )}
        </div>  

        {/* User Info */}
        <div className="space-y-4">
          {renderField("Full Name", "fullname", <FaIdBadge className="text-gray-600" />, true)}
          {renderField("Username", "username", <FaUser className="text-gray-600" />)}
          {renderField("Gender", "gender", <FaVenusMars className="text-gray-600" />)}
          {renderField("DOB", "dob", <FaBirthdayCake className="text-gray-600" />)}
          {renderField("State", "state", <FaMapMarkerAlt className="text-gray-600" />)}
          {renderField("District", "district", <FaMapMarkerAlt className="text-gray-600" />)}
          {renderField("Phone No", "phone", <FaPhone className="text-gray-600" />)}

          {/* Email (always visible, not editable) */}
          <div className="flex items-center border-b pb-2">
            <FaEnvelope className="text-gray-600 mr-2" /> {/* Mail icon */}
            <span className="font-medium text-gray-700">Email:</span>
            <span className="ml-2 text-gray-600">
              {auth.currentUser?.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
