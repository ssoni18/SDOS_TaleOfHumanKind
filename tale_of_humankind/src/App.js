import Navbar from "./components/js/Navbar";
// import ControlledCarousel from "./components/js/Corousel";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/js/HomePage";
import ContactUs from "./components/js/ContactUs";
import RegisterPage from "./components/js/RegisterPage";
import AboutUs from "./components/js/AboutUs";
import LoginPage from "./components/js/LoginPage";
import SupportUs from "./components/js/SupportUs";
import TeamSection from "./components/js/TeamSection";
import UserProfile from "./components/js/UserProfile";
function App() {
  return (<>
    <Navbar/>
    <Routes>
      <Route path="/contactUs" element={<ContactUs/>}></Route>
      <Route path="/" element={<HomePage/>}></Route>
      <Route path="/aboutUs" element={<AboutUs/>}></Route>
      <Route path="/Login" element={<LoginPage/>}></Route>
      <Route path="/registerPage" element={<RegisterPage/>}></Route>
      <Route path="supportUs" element={<SupportUs/>}></Route>
      <Route path="/teamSection" element={<TeamSection/>}></Route>
      <Route path='/userProfile' element={<UserProfile/>}></Route>
    </Routes>
  </>)
  }

export default App;
