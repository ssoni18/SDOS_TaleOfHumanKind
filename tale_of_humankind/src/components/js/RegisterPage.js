import React, { useState } from 'react';
import "../css/LoginPage.css";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';


export default function RegisterPage() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("Changemaker"); // Initialize with a default role
  const [selectedQualification, setSelectedQualification] = useState("High School"); // Initialize with a default qualification
  const [firstName, setfirstname] = useState("NULL")
  const [lastName, setlastname] = useState("NULL")
  const [phoneNumber, setphone] = useState("NULL")
  const [email, setemail] = useState("NULL")
  const [password, setpassword] = useState("NULL")
  const [confirmPassword, setConfirmPassword] = useState("NULL")
  const [agreeTerms, setAgreeTerms] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(null);
  const [isloading, setisLoading] = useState(false); 
  
// Validate Email
  const validateEmail = (email) => {
    if (!email) {
      return false;
    }
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    return emailRegex.test(email);
  };

  // Validate Password Length
  const validatePasswordLength = (password) => {
    if (!password || password.length < 8 || password.length > 32) {
      return false;
    }
    return true;
  };

  // Validate Password Match
  const validatePasswordMatch = (password, confirmPassword) => {
    if (!password || !confirmPassword || password !== confirmPassword) {
      return false;
    }
    return true;
  };

  // Validate Firstname
  const validateFirstname = (firstName) => {
    if (!firstName || firstName.length > 32) {
      return false;
    }
    return true;
  };

  // Validate Lastname
  const validateLastname = (lastName) => {
    if (!lastName || lastName.length > 32) {
      return false;
    }
    return true;
  };

  // Validate Phone Number
  const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      return false;
    }
    return true;
  };

  // Validate Selected Role
  const validateSelectedRole = (selectedRole) => {
    if (!selectedRole || !['Mentor', 'Changemaker'].includes(selectedRole)) {
      return false;
    }
    return true;
  };

  // Validate Selected Qualification
  const validateSelectedQualification = (selectedQualification) => {
    if (!selectedQualification || !['High School', 'Bachelor\'s Degree', 'Master\'s Degree'].includes(selectedQualification)) {
      return false;
    }
    return true;
  };

  
  const handleSubmit = () => {
    if(!agreeTerms){
      setisLoading(false);
      setErrorMessage("Accept the T&C");
    }else if (!validateEmail(email)) {
      setisLoading(false);
      setErrorMessage("Invalid email");
    }else if(!validatePasswordLength(password)){
      setisLoading(false);
      setErrorMessage("Invalid password");
    }else if(!validatePasswordMatch(password, confirmPassword)){
      setisLoading(false);
      setErrorMessage("Password doesnt match");
    }else if(!validateFirstname(firstName)){
      setisLoading(false);
      setErrorMessage("Invalid firstname");
    }else if(!validateLastname(lastName)){
      setisLoading(false);
      setErrorMessage("Invalid lastname");
    }else if(!validatePhoneNumber(phoneNumber)){
      setisLoading(false);
      setErrorMessage("Invalid phone number");
    }else if(!validateSelectedRole(selectedRole)){
      setisLoading(false);
      setErrorMessage("Invalid role");
    }else if(!validateSelectedQualification(selectedQualification)){
      setisLoading(false);
      setErrorMessage("Invalid qualification");
    }
    else{
    setisLoading(true);

    axios
      .post(`${process.env.REACT_APP_DJANGO_APP_API_URL}/user_signup/`, {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        selectedRole: selectedRole,
        selectedQualification: selectedQualification,
      })
      .then((response) => {
        setisLoading(false);
        if (response.data.status === 'success') {
          navigate('/Login?registered=true');  // Redirect to the login page with a query parameter
          //console.log(response);
        } else {
          setErrorMessage(response.data.message);
          //console.log(response.data.message);
        }
      })
      .catch((error) => {
        setisLoading(false); 
        console.error(error);
        // Check if the error has a response and response data
        if (error.response && error.response.data) {
          console.error('Response data:', error.response.data);
          setErrorMessage(error.response.data.message);
        }
      });
    }
  };

  if (isloading) {
    return <Loading />;
  }

  const handleRoleChange = (e) => {
    //console.log("current target value: ", e.target.value);
    setSelectedRole(e.target.value);
  };

  const handleQualificationChange = (e) => {
    setSelectedQualification(e.target.value);
  };

  const handleCheckboxChange = () => {
    setAgreeTerms(!agreeTerms);
  };
  return (
    <div className="App">
      <div className="page-holder align-items-center py-4 bg-gray-100 vh-100">
        <div className="container">
          <div className="row align-items-center">
            <div className='show col-lg-6 px-lg-4'>
              <div className="card">
                <div className="card-header px-lg-5">
                  <div className="card-heading text-primary">Registration</div>
                </div>
                <div className="card-body p-lg-5">
                  <h3 className="mb-4">Register Yourself</h3>
                  {/* <p className="text-muted text-sm mb-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.</p> */}
                  {errorMessage && <div className="alert alert-danger" style={{ color: 'red' }}>{errorMessage}</div>}
                  <form action="index.html">
                    {/* <div className="form-floating mb-3">
                      <input className="form-control" id="lastName" type="text" placeholder="Last Name" required  onChange={(event) => {
                          setusername(event.target.value);
                        }}/>
                      <label htmlFor="lastName">UserName</label>
                    </div> */}
                    <div className="form-floating mb-3">
                      <input className="form-control" id="firstName" type="text" placeholder="First Name" required onChange={(event) => {
                        setfirstname(event.target.value);
                      }} />
                      <label htmlFor="firstName">First Name</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input className="form-control" id="lastName" type="text" placeholder="Last Name" required onChange={(event) => {
                        setlastname(event.target.value);
                      }} />
                      <label htmlFor="lastName">Last Name</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input className="form-control" id="phoneNumber" type="tel" placeholder="Phone Number" required
                        onChange={(event) => {
                          setphone(event.target.value);
                        }} />
                      <label htmlFor="phoneNumber">Phone Number</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input className="form-control" id="email" type="email" placeholder="Email address" required onChange={(event) => {
                        setemail(event.target.value);
                      }} />
                      <label htmlFor="email">Email address</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input className="form-control" id="password" type="password" placeholder="Password" required onChange={(event) => {
                        setpassword(event.target.value);
                      }} />
                      <label htmlFor="password">Password</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input className="form-control" id="confirmPassword" type="password" placeholder="Confirm Password" required onChange={(event) => {
                        setConfirmPassword(event.target.value);
                      }} />
                      <label htmlFor="confirmPassword">Confirm Password</label>
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="role">Choose Role</label>
                      <select className="form-control" id="role" onChange={handleRoleChange} value={selectedRole}>
                        <option value="Changemaker">Changemaker</option>
                        <option value="Mentor">Mentor</option>
                      </select>
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="qualification">Choose Qualification</label>
                      <select className="form-control" id="qualification" onChange={handleQualificationChange} value={selectedQualification}>
                        <option value="High School">High School</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                      </select>
                    </div>
                    <div className="form-check mb-3">
                      <input className="form-check-input" type="checkbox" name="agree" id="agree" onChange={handleCheckboxChange} required />
                      <label className="form-check-label" htmlFor="agree">I agree with the <a href="/">Terms & Conditions</a>.</label>
                    </div>
                    <div className="form-group">
                      <button className="btn btn-primary" id="register" type="button" name="registerSubmit" onClick={handleSubmit}>Register</button>
                    </div>
                  </form>
                </div>
                <div className="card-footer px-lg-5 py-lg-4">
                  <Link to="/Login">
                    <div className="text-sm text-muted">Already have an account?</div></Link>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-xl-5 ms-xl-auto px-lg-4 text-center text-primary">
              <img className="img-fluid mb-4" width="300" src="https://therichpost.com/wp-content/uploads/2021/06/login_page_image.png" alt="" style={{ transform: "rotate(10deg)" }} />
              <h1 className="mb-4">Therichpost.com <br className="d-none d-lg-inline" />free code snippets.</h1>
              <p className="lead text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

