import React, { useState, useEffect } from "react";
import "../css/LoginPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
// import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Loading from './Loading';
import Notification from './Notification';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const registered = urlParams.get('registered');
    const activated = urlParams.get('activated');
    if (registered) {
      setNotificationMessage('Sign up was successful, please check your email to activate your account!');
      setShowNotification(true);
    } else if (activated === 'true') {
      setNotificationMessage('Account activated successfully :)');
      setShowNotification(true);
    } else if (activated === 'false') {
      setNotificationMessage('Activation link is invalid :(');
      setShowNotification(true);
    }
    axios.get(`${process.env.REACT_APP_DJANGO_APP_API_URL}/is_authenticated/`, { withCredentials: true })
      .then((response) => {
        setLoading(false); // Set loading to false once the authentication check is complete

        if (response.data.is_authenticated) {
          console.log('user authenticated')
          navigate('/'); // Redirect to the home page if the user is authenticated
        }
      })
      .catch((error) => {
        setLoading(false); // Set loading to false if there is an error
        console.error(error);
        setErrorMessage('Authentication error occurred'); // Set the error message
        setShowNotification(true); // Show the notification
      });
  }, [navigate]); // Added navigate to the dependency array

  if (loading) {
    // Render a loading state while the authentication check is in progress
    return <Loading />;
  }

  const handleLogin = () => {
    console.log(email);
    axios
      .post(`${process.env.REACT_APP_DJANGO_APP_API_URL}/login_auth/`, {
        email: email,
        password: password,
      }, { withCredentials: true }) // Include session cookie with request
      .then((response) => {
        if (response.data.status === 'success') {
          const userData = response.data.user_data;

          // Dispatch the login action
          dispatch({ type: 'LOGIN', userData: userData });
          navigate('/UserProfile', { state: { userData: response.data.user_data } }); // Pass userData as state
        }
        else {
          setErrorMessage(response.data.message);
          console.log(response.data.message);
          setShowNotification(true);
        }
      })
      .catch((error) => {
        console.error(error);
        // Check if the error has a response and response data
        if (error.response && error.response.data) {
          console.error('Response data:', error.response.data);
          setErrorMessage(error.response.data.message);
          setShowNotification(true); // Show the notification with the error message
        }
      });
  };


  const responseGoogle = (response) => {
    // Send the Google access token to your server for verification.
    if (response.accessToken) {
      axios
        .post(`${process.env.REACT_APP_DJANGO_APP_API_URL}/google-login/`, {
          token: response.accessToken,
        }, { withCredentials: true }) // Include session cookie with request
        .then((response) => {
          // Handle the server response or redirect as needed.
          console.log(response);
        })
        .catch((error) => {
          // Handle the error.
          console.error(error)
        });
    }
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  return (
    <div className="App">
      {console.log("notificationMessage", notificationMessage)}
      {showNotification ? <Notification message={notificationMessage} showNotification={showNotification} onClose={handleNotificationClose} /> : null}
      <div className="page-holder align-items-center py-4 bg-gray-100 vh-80">
        <div className="container">
          <div className="row align-items-center">
            <div className="show col-lg-6 px-lg-4">
              <div className="card">
                <div className="card-header px-lg-5">
                  <div className="card-heading text-primary">Login</div>
                </div>
                <div className="card-body p-lg-5">
                  <h3 className="mb-4">Login</h3>
                  {/* <p className="text-muted text-sm mb-5">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore.
                  </p> */}
                  {errorMessage && <div className="alert alert-danger" style={{ color: 'red' }}>{errorMessage}</div>}
                  <form action="index.html">
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="email"
                        type="email"
                        placeholder="Email address"
                        required
                        onChange={(event) => {
                          setEmail(event.target.value);
                        }}
                      />
                      <label htmlFor="email">Email address</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="password"
                        type="password"
                        placeholder="Password"
                        required
                        onChange={(event) => {
                          setPassword(event.target.value);
                        }}
                      />
                      <label htmlFor="password">Password</label>
                    </div>

                    <div className="form-group">
                      <button
                        className="btn btn-primary"
                        id="login"
                        type="button"
                        name="loginSubmit"
                        onClick={handleLogin}
                      >
                        Login
                      </button>
                    </div>
                  </form>

                  {/* <GoogleLogin
                    clientId="335351655350-vnafv8fmml40qfrv2m3tt41ro4m47gko.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={"single_host_origin"}
                  /> */}
                </div>
                <div className="card-footer px-lg-5 py-lg-4">
                  <Link to="/registerPage">
                    <div className="text-sm text-muted">
                      Don't have an account?
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-xl-5 ms-xl-auto px-lg-4 text-center text-primary">
              <img
                className="img-fluid mb-4"
                width="300"
                src="https://therichpost.com/wp-content/uploads/2021/06/login_page_image.png"
                alt=""
                style={{ transform: "rotate(10deg)" }}
              />
              <h1 className="mb-4">
                Therichpost.com <br className="d-none d-lg-inline" />
                free code snippets.
              </h1>
              <p className="lead text-muted">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
