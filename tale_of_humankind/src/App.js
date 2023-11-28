
import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Navbar from "./components/js/Navbar";
import HomePage from "./components/js/HomePage";
import ContactUs from "./components/js/ContactUs";
import RegisterPage from "./components/js/RegisterPage";
import AboutUs from "./components/js/AboutUs";
import LoginPage from "./components/js/LoginPage";
import SupportUs from "./components/js/SupportUs";
import TeamSection from "./components/js/TeamSection";
import UserProfile from "./components/js/UserProfile";
import EducationalResources from "./components/js/EducationalResources";
import ViewEducationalResource from "./components/js/ViewEducationalResource";
import { Payment } from "./components/js/payments";
import Home from "./components/js/Home";

function App() {

  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/get_user_role/`, { withCredentials: true });
        console.log("User role:", response.data.user_type);
        setUserType(response.data.user_type);
      } catch (error) {
        console.error('Error fetching user role: ', error);
      }
    };

    fetchUserRole();
  }, []);

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
        {userType === 'mentor' && <Route path="/EducationalResources" element={<EducationalResources />} />}
        <Route path="/ViewEducationalResource" element={<ViewEducationalResource />}></Route>
        <Route path="/payment" element={<Payment />}></Route>
        <Route path="/home" element={<Home />}></Route>
      </Routes>
    </>
  );
}

export default App;

