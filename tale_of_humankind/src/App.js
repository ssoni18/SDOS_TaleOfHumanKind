
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from "./components/js/Navbar";
import HomePage from "./components/js/HomePage";
import ContactUs from "./components/js/ContactUs";
import RegisterPage from "./components/js/RegisterPage";
import AboutUs from "./components/js/AboutUs";
import LoginPage from "./components/js/LoginPage";
import SupportUs from "./components/js/SupportUs";
import TeamSection from "./components/js/TeamSection";
import UserProfile from "./components/js/UserProfile";
import EducationalResources from "./components/js/ManageEducationalResources";
import ManageCampaigns from "./components/js/ManageCampaigns";
import ViewEducationalResources from "./components/js/ViewEducationalResources";
import { Payment } from "./components/js/payments";
import Home from "./components/js/Home";
import ForbiddenPage from "./components/js/403Page";
import ViewCampaigns from "./components/js/viewCampaigns";


function App() {
  const userData = useSelector(state => state.auth.userData); // Access userData from Redux store
  const userType = userData ? userData.user_type : null; // Access userType from userData
  console.log("userType now at App.js", userType);

  return (  
    <>
      <Navbar />
      
      <Routes>
        <Route path="/contactUs" element={<ContactUs />}></Route>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/aboutUs" element={<AboutUs />}></Route>
        <Route path="/Login" element={<LoginPage />}></Route>
        <Route path="/registerPage" element={<RegisterPage />}></Route>
        <Route path="supportUs" element={<SupportUs />}></Route>
        <Route path="/teamSection" element={<TeamSection />}></Route>
        <Route path="/userProfile" element={<UserProfile />}></Route>
        {userType === 'Mentor' && <Route path="/manageEducationalResources" element={<EducationalResources />} />}
        {userType !== 'Mentor' && <Route path="/manageEducationalResources" element={<ForbiddenPage />} />}
        {userType === 'Changemaker' && <Route path="/manageCampaigns" element={<ManageCampaigns />} />}
        {userType !== 'Changemaker' && <Route path="/manageCampaigns" element={<ForbiddenPage />} />}
        <Route path="/viewEducationalResources" element={<ViewEducationalResources />}></Route>
        <Route path="/viewCampaigns" element={<ViewCampaigns />}></Route>
        <Route path="/payment" element={<Payment />}></Route>
        <Route path="/home" element={<Home />}></Route>
      </Routes>
    </>
  );
}

export default App;

