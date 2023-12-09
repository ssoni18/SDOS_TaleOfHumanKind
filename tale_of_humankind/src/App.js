
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from "./components/js/Navbar";
import HomePage from "./components/js/HomePage";
import ContactUs from "./components/js/ContactUs";
import RegisterPage from "./components/js/RegisterPage";
import AboutUs from "./components/js/AboutUs";
import LoginPage from "./components/js/LoginPage";
import TeamSection from "./components/js/TeamSection";
import UserProfile from "./components/js/UserProfile";
import EducationalResources from "./components/js/ManageEducationalResources";
import ManageInvitations from "./components/js/ManageInvitations"
import ManageCampaigns from "./components/js/ManageCampaigns";
import ViewEducationalResources from "./components/js/ViewEducationalResources";
import Profile from './components/js/EditProfile';
import Home from "./components/js/Home";
import ForbiddenPage from "./components/js/403Page";
import ViewCampaigns from "./components/js/viewCampaigns";
import EducationForm from './components/js/form';
import Resource from './components/js/EditResources';
import ManageFeed from './components/js/Managefeed';
import FeedForm from './components/js/FeedForm';
import Feed from './components/js/EditFeed';
import DonationPage from './components/js/DonationPage';
function App() {
  const userData = useSelector(state => state.auth.userData); // Access userData from Redux store
  const userType = userData ? userData.user_type : null; // Access userType from userData

  return (  
    <>
      <Navbar />
      <Routes>
        <Route path="/contactUs" element={<ContactUs />}></Route>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/aboutUs" element={<AboutUs />}></Route>
        <Route path="/Login" element={<LoginPage />}></Route>
        <Route path="/registerPage" element={<RegisterPage />}></Route>
        <Route path="/teamSection" element={<TeamSection />}></Route>
        <Route path="/userProfile" element={<UserProfile />}></Route>
        {userType === 'Mentor' && <Route path="/manageEducationalResources" element={<EducationalResources />} />}
        {userType !== 'Mentor' && <Route path="/manageEducationalResources" element={<ForbiddenPage />} />}
        {userType === 'Mentor' && <Route path="/manageInvitations" element={<ManageInvitations />} />}
        {userType !== 'Mentor' && <Route path="/manageInvitations" element={<ForbiddenPage />} />}
        {userType === 'Changemaker' && <Route path="/manageCampaigns" element={<ManageCampaigns />} />}
        {userType !== 'Changemaker' && <Route path="/manageCampaigns" element={<ForbiddenPage />} />}
        <Route path="/donationPage" element={<DonationPage />}></Route>
        <Route path="/viewEducationalResources" element={<ViewEducationalResources />}></Route>
        <Route path="/viewCampaigns" element={<ViewCampaigns />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/editprofile" element={<Profile />}></Route>
        <Route path="/form" element={<EducationForm />}></Route>
        <Route path="/editresource/:id" element={<Resource />}></Route>
        <Route path="/managefeed" element={<ManageFeed />}></Route>
        <Route path="/feedForm" element={<FeedForm />}></Route>
        <Route path="/editfeed/:id" element={<Feed />}></Route>
      </Routes>
    </>
  );
}

export default App;

