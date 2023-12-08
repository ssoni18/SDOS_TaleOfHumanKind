import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation hook
import "../css/userProfile.css";
import RegistrationCounter from "./Counter";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

export default function UserProfile() {
  const navigate = useNavigate();
  const userData = useSelector(state => state.auth.userData); // Access userData from Redux store
  //console.log("user data at profile", userData);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_DJANGO_APP_API_URL}/is_authenticated/`, {
        withCredentials: true,
      })
      .then((response) => {
        if (!response.data.is_authenticated) {
          // Redirect to login page if user is not authenticated
          navigate("/Login");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [navigate]); // Added navigate to the dependency array

  // Check if userData is not available or user is not authenticated
  useEffect(() => {
    if (!userData) {
      // Redirect to login page if userData is not available
      navigate("/Login");
    }
  }, [userData, navigate]);

  if (!userData) {
    // Don't render anything if userData is not available
    return null;
  }

  return (
    <section className="section about-section gray-bg" id="about">
      <div className="container">
        <div className="row align-items-center flex-row-reverse">
          <div className="col-lg-6">
            <div className="about-text go-to">
              <h3 className="dark-color">{userData.first_name + " " + userData.last_name}</h3>
              <h6 className="theme-color lead">{userData.user_type}</h6>
              <Link to="/editprofile">
                <Button variant="success" className="mr-2">Edit Profile</Button>
              </Link>
              {userData.user_type === "Mentor" && (
                <Link to="/manageEducationalResources">
                  <Button variant="success">Manage Resources</Button>
                </Link>
              )}
              {userData.user_type === "Changemaker" && (
                <Link to="/manageCampaigns">
                  <Button variant="success">Manage Campaigns</Button>
                </Link>
              )}
              {/* <h6 className="theme-color lead">Role</h6> */}
              <p>
                Some description that is optional that the user will write about
                himself in his profile
              </p>
              <div className="row about-list">
                <div className="col-md-6">
                  <div className="media">
                    <label>Birthday</label>
                    <p>{userData.dob || "None"}</p>
                  </div>
                  <div className="media">
                    <label>Age</label>
                    <p>{userData.age ? `${userData.age} Yr` : "None"}</p>
                  </div>
                  <div className="media">
                    <label>Country</label>
                    <p>Canada</p>
                  </div>
                  <div className="media">
                    <label>Address</label>
                    <p>
                      Country: {userData.country || "None"}
                      <br />
                      Street Name: {userData.street_name || "None"}
                      <br />
                      State: {userData.state || "None"}
                      <br />
                      Pincode: {userData.pincode || "None"}
                    </p>{" "}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="media">
                    <label>E-mail</label>
                    {/* Don't display email here for privacy reasons (add a user setting to allow or not allow users to display their email) */}
                    <p>{userData.email}</p>
                  </div>
                  <div className="media">
                    <label>Phone</label>
                    <p>{userData.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="about-avatar">
              {userData.profile_image ? (
                <img
                  src={`${process.env.REACT_APP_DJANGO_APP_API_URL}${userData.profile_image}`}
                  title=""
                  alt=""
                />
              ) : (
                <img
                  src="https://bootdey.com/img/Content/avatar/avatar7.png"
                  title=""
                  alt=""
                />
              )}
            </div>
          </div>
        </div>
        <br></br>
        <h6>
          This could include information related to maybe students he/she has mentored
        </h6>

        <div className="counter">
          <div className="row">
            <div className="col-6 col-lg-3">
              <div className="count-data text-center">
                <RegistrationCounter limit="300" description="Happy Clients" />
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="count-data text-center">
                <RegistrationCounter
                  limit="100"
                  description="Project Completed"
                />
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="count-data text-center">
                <RegistrationCounter limit="300" description="Photo Capture" />
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="count-data text-center">
                <RegistrationCounter
                  limit="50"
                  description="Telephonic Calls"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
