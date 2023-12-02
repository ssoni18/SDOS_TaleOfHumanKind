import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation hook
import "../css/userProfile.css";
import RegistrationCounter from "./Counter";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Link } from "react-router-dom";

export default function UserProfile() {
  const location = useLocation(); // Use useLocation hook to access location state
  const navigate = useNavigate();
  let userData = location.state?.userData; // Access userData from location state
  // If userData is not available in location state, get it from local storage
  if (!userData) {
    userData = JSON.parse(localStorage.getItem("userData"));
  }
  console.log("user data at profile", userData);

  const [userType, setUserType] = useState(null);
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/get_user_role/`,
          { withCredentials: true }
        );
        console.log("User role:", response.data.user_type);
        setUserType(response.data.user_type);
      } catch (error) {
        console.error("Error fetching user role: ", error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/is_authenticated/`, {
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
              <h3 className="dark-color">{userData.first_name}</h3>
              <h6 className="theme-color lead">{userData.user_type}</h6>
              {userType === "Mentor" && (
                <Link to="/manageEducationalResources">
                  <Button variant="success">Manage Resources</Button> 
                </Link>
              )}
              {userType === "Changemaker" && (
                <Link to="/manageCampaigns">
                  <Button variant="success">Manage Campaigns</Button> 
                </Link>
              )}
              <p>
                Some description that is optional that the user will write about
                himself in his profile
              </p>
              <div className="row about-list">
                <div className="col-md-6">
                  <div className="media">
                    <label>Birthday</label>
                    <p>{userData.dob}</p>
                  </div>
                  <div className="media">
                    <label>Age</label>
                    <p>22 Yr</p>
                  </div>
                  <div className="media">
                    <label>Country</label>
                    <p>Canada</p>
                  </div>
                  <div className="media">
                    <label>Address</label>
                    <p>
                      Country: {userData.country}
                      <br />
                      Street Name: {userData.street_name}
                      <br />
                      State: {userData.state}
                      <br />
                      Pincode: {userData.pincode}
                    </p>{" "}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="media">
                    <label>E-mail</label>
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
              <img
                src="https://bootdey.com/img/Content/avatar/avatar7.png"
                title=""
                alt=""
              />
            </div>
          </div>
        </div>
        <br></br>
        <h6>
          This could include information realted to maybe students he/she taught
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
