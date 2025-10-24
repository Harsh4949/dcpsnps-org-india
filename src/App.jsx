import { Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Home2 from "./pages/Home2";
import Home3 from "./pages/Home3";
import Home4 from "./pages/Home4";
import About from "./pages/About";
import ContactUS from "./pages/ContactUs";
import Footer from "./components/Footer";

import Post from "./pages/Post";      // Feed Page
import Create from "./pages/CreatePost";  // Create Post Page
import SavedPost from "./pages/SavedPost"; // Saved Post Page
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./pages/Profile";
import MyPosts from './pages/MyPosts.jsx';
import emailjs from "emailjs-com";

import "./App.css";
// ✅ Initialize EmailJS globally
emailjs.init("u8itjQTl3n-K0a0Nh");

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Home Page (all sections) */}
        <Route
          path="/"
          element={
            <>
              <Home />
              <Home2 />
              <Home3 />
              <Home4 />
              <About />
              <ContactUS />
              <Footer />
            </>
          }
        />

        {/* Community Section */}
        <Route path="/post" element={<Post />} />       {/* Feed */}
        <Route path="/create" element={<Create />} />   {/* Create Post */}
        <Route path="/saved" element={<SavedPost />} /> {/* Saved Posts */}
        <Route path="/profile" element={<Profile />} /> {/* User Profile */}
        <Route path="/myposts" element={<MyPosts />} />
      </Routes>
     <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;
