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

  const [userData, setUserProfileData] = useState(null); // State to store user profile data

  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        const id = window.location.pathname.split("/").pop(); // Extract id from the URL
        const response = await axios.post(`${process.env.REACT_APP_DJANGO_APP_API_URL}/publicProfile/`, { id });
        setUserProfileData(response.data.user_data);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchUserProfileData();
  }, [window.location.pathname]);

  if (!userData) {
    return <div></div>; // Render loading state while fetching data
  }

  return (
    <section className="section about-section gray-bg" id="about">
      <div className="container">
        <div className="row align-items-center flex-row-reverse">
          <div className="col-lg-6">
            <div className="about-text go-to">
              <h3 className="dark-color">{userData.first_name + " " + userData.last_name}</h3>
              <h6 className="theme-color lead">{userData.user_type}</h6> 
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
                  src={`${process.env.REACT_APP_DJANGO_APP_API_URL}/media/${userData.profile_image}`}
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
