import Navbar from "./components/Navbar";
import Home from "./pages/home";
import Home2 from "./pages/Home2";
import Home3 from "./pages/Home3";
import Home4 from "./pages/Home4";
import About from "./pages/About";
import ContactUS from "./pages/ContactUs";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  return (
    <div>
      <Navbar />
      <Home/>
      <Home2 />
      <Home3/>
      <Home4/>
      <About/>
      <ContactUS/>
      <Footer/>
      
      
    </div>
  );
}

export default App;
