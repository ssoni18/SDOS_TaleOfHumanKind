import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import "../css/LoginPage.css";
import { Link } from "react-router-dom";


export default function Profile() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData); // Access userData from Redux store
  const dispatch = useDispatch();

  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [formState, setFormState] = useState({
    ...userData,
    address: userData.address || {},
  });
  const handleSubmit = () => {
    axios
      .post(`${process.env.REACT_APP_DJANGO_APP_API_URL}/editProfile/`, formState, {
        headers: {
          'content-type': 'multipart/form-data'
        },
        withCredentials: true,
      })
      .then((response) => {
        setFeedbackMessage("Profile updated successfully!");
        dispatch({ type: 'UPDATE_USER_DATA', userData: response.data.user_data }); // Update userData in redux store
        navigate('/userProfile');
      })
      .catch((error) => {
        console.error(error);
        setFeedbackMessage("Error updating profile. Please try again.");
      });
  };

  return (
    <div className="App">
      <div className="page-holder align-items-center py-4 bg-gray-100 vh-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="show col-lg-6 px-lg-4">
              <div className="card">
                <div className="card-header px-lg-5">
                  <div className="card-heading text-primary">Profile</div>
                </div>
                <div className="card-body p-lg-5">
                  <h3 className="mb-4">Edit Yourself</h3>
                  {feedbackMessage && (
                    <div className={feedbackMessage.includes("successfully") ? "alert alert-success" : "alert alert-danger"}>
                      {feedbackMessage}
                    </div>
                  )}
                  <form action="index.html">
                    {/* <div className="form-floating mb-3">
                      <input className="form-control" id="lastName" type="text" placeholder="Last Name" required  onChange={(event) => {
                          setusername(event.target.value);
                        }}/>
                      <label htmlFor="lastName">UserName</label>
                    </div> */}
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="firstName"
                        type="text"
                        placeholder="First Name"
                        name="first_name"
                        value={formState.first_name || ""}
                        required
                        onChange={(event) => {
                          setFormState({
                            ...formState,
                            [event.target.name]: event.target.value,
                          });
                        }}
                      />
                      <label htmlFor="firstName">First Name</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="lastName"
                        type="text"
                        placeholder="Last Name"
                        name="last_name"
                        value={formState.last_name || ""}
                        required
                        onChange={(event) => {
                          setFormState({
                            ...formState,
                            [event.target.name]: event.target.value,
                          });
                        }}
                      />
                      <label htmlFor="lastName">Last Name</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="phoneNumber"
                        type="tel"
                        placeholder="Phone Number"
                        name="phone"
                        value={formState.phone || ""}
                        required
                        onChange={(event) => {
                          setFormState({
                            ...formState,
                            [event.target.name]: event.target.value,
                          });
                        }}
                      />
                      <label htmlFor="phoneNumber">Phone Number</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="email"
                        type="email"
                        placeholder="Email address"
                        name="email"
                        value={formState.email || ""}
                        required
                        readOnly
                      />
                      <label htmlFor="email">Email Address</label>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="DOB"
                        type="date"
                        placeholder="DOB"
                        name="dob"
                        value={formState.dob || ""}
                        required
                        onChange={(event) => {
                          setFormState({
                            ...formState,
                            [event.target.name]: event.target.value,
                          });
                        }}
                      />
                      <label htmlFor="DateOfBirth">Date of Birth</label>
                    </div>
                    
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="country"
                        type="text"
                        placeholder="Country"
                        name="country"
                        value={formState.address?.country || ""}
                        required
                        onChange={(event) => {
                          setFormState({
                            ...formState,
                            address: {
                              ...formState.address,
                              [event.target.name]: event.target.value,
                            },
                          });
                        }}
                      />
                      <label htmlFor="country">Country</label>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="streetname"
                        type="text"
                        placeholder="Street Name"
                        name="streetname"
                        value={formState.address?.streetname || ""}
                        required
                        onChange={(event) => {
                          setFormState({
                            ...formState,
                            address: {
                              ...formState.address,
                              [event.target.name]: event.target.value,
                            },
                          });
                        }}
                      />
                      <label htmlFor="streetname">Street Name</label>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="state"
                        type="text"
                        placeholder="State"
                        name="state"
                        value={formState.address?.state || ""}
                        required
                        onChange={(event) => {
                          setFormState({
                            ...formState,
                            address: {
                              ...formState.address,
                              [event.target.name]: event.target.value,
                            },
                          });
                        }}
                      />
                      <label htmlFor="state">State</label>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="pincode"
                        type="text"
                        placeholder="Pincode"
                        name="pincode"
                        value={formState.address?.pincode || ""}
                        required
                        onChange={(event) => {
                          setFormState({
                            ...formState,
                            address: {
                              ...formState.address,
                              [event.target.name]: event.target.value,
                            },
                          });
                        }}
                      />
                      <label htmlFor="pincode">Pincode</label>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="image"
                        type="file"
                        accept="image/*"
                        required
                        onChange={(event) => {
                          const file = event.target.files[0];
                          setFormState({
                            ...formState,
                            profileImage: file
                          });
                        }}
                      />
                      <label htmlFor="image">Image</label>
                    </div>


                    <div className="form-group">
                      <button
                        className="btn btn-success"
                        id="register"
                        type="button"
                        name="registerSubmit"
                        onClick={handleSubmit}>
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
