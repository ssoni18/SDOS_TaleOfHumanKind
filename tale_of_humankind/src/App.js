
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from "./components/js/Navbar";
import HomePage from "./components/js/HomePage";
import ContactUs from "./components/js/ContactUs";
import RegisterPage from "./components/js/RegisterPage";
import LoginPage from "./components/js/LoginPage";
import TeamSection from "./components/js/TeamSection";
import UserProfile from "./components/js/UserProfile";
import EducationalResources from "./components/js/ManageEducationalResources";
import ManageInvitations from "./components/js/ManageInvitations"
import ManageCampaigns from "./components/js/ManageCampaigns";
import ViewEducationalResources from "./components/js/ViewEducationalResources";
import Profile from './components/js/EditProfile';
// import { Payment } from "./components/js/payments";
import Feed from "./components/js/Feed";
import ForbiddenPage from "./components/js/403Page";
import ViewCampaigns from "./components/js/viewCampaigns";
import EducationForm from './components/js/form';
import Resource from './components/js/EditResources';
import ManageFeed from './components/js/ManageFeed';
import AddFeed from './components/js/AddFeed';
import DonationPage from './components/js/DonationPage';
import EditFeed from './components/js/EditFeed';
import PublicProfile from './components/js/PublicProfile';
import AboutUsPage from './components/js/AboutUs';
import { Navigate } from 'react-router-dom';

function App() {
  const userData = useSelector(state => state.auth.userData); // Access userData from Redux store
  const userType = userData ? userData.user_type : null; // Access userType from userData
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  return (  
    <>
      <Navbar />
      <Routes>
        <Route path="/contactUs" element={<ContactUs />}></Route>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/registerPage" element={<RegisterPage />}></Route>
        <Route path="/teamSection" element={<TeamSection />}></Route>
        <Route path="/userProfile" element={<UserProfile />}></Route>
        {isLoggedIn && userType === 'Mentor' && <Route path="/manageEducationalResources" element={<EducationalResources />} />}
        {isLoggedIn && userType !== 'Mentor' && <Route path="/manageEducationalResources" element={<ForbiddenPage />} />}
        {isLoggedIn && userType === 'Mentor' && <Route path="/manageInvitations" element={<ManageInvitations />} />}
        {isLoggedIn && userType !== 'Mentor' && <Route path="/manageInvitations" element={<ForbiddenPage />} />}
        {isLoggedIn && userType === 'Changemaker' && <Route path="/manageCampaigns" element={<ManageCampaigns />} />}
        {isLoggedIn && userType !== 'Changemaker' && <Route path="/manageCampaigns" element={<ForbiddenPage />} />}
        <Route path="/donationPage" element={<DonationPage />}></Route>
        <Route path="/viewEducationalResources" element={<ViewEducationalResources />}></Route>
        <Route path="/viewCampaigns" element={<ViewCampaigns />}></Route>
        {/* <Route path="/payment" element={<Payment />}></Route> */}
        <Route path="/feed" element={<Feed />}></Route>
        <Route path="/editprofile" element={<Profile />}></Route>
        {isLoggedIn && userType === 'Mentor' && <Route path="/form" element={<EducationForm />} />}
        {isLoggedIn && userType !== 'Mentor' && <Route path="/form" element={<ForbiddenPage />} />}
        <Route path="/editresource/:id" element={<Resource />}></Route>
        <Route path="/manageFeed" element={<ManageFeed />}></Route>
        {isLoggedIn ? <Route path="/addFeed" element={<AddFeed />} /> : <Route path="/addFeed" element={<Navigate to="/login" />} />}
        <Route path="/editfeed/:id" element={<EditFeed />}></Route>
        <Route path="/publicprofile/:id" element={<PublicProfile />}></Route>
        <Route path="/aboutus" element={<AboutUsPage />}></Route>
      </Routes>
    </>
  );
}

export default App;

