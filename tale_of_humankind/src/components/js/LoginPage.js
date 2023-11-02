import React, { useState } from "react";
import "../css/LoginPage.css";
import { Link} from "react-router-dom";
import axios from "axios";
import ReactDOM from 'react-dom';
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';

export default function LoginPage() {
  const history = useNavigate();

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const handleSubmit = () => {
    console.log(email);
    axios
      .post("http://localhost:8000/login_auth/", {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.data.status === 'ok'){
        const userData = response.data.user_data;
        console.log(userData.first_name);
        ReactDOM.render(<UserProfile userData={userData} />, document.getElementById('root'));
        history('/UserProfile')
        }
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const responseGoogle = (response) => {
    // Send the Google access token to your server for verification.
    if (response.accessToken) {
      axios
        .post("http://localhost:8000/google-login/", {
          token: response.accessToken,
        })
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
  
  return (
    <div className="App">
      <div className="page-holder align-items-center py-4 bg-gray-100 vh-80">
        <div className="container">
          <div className="row align-items-center">
            <div className="show col-lg-6 px-lg-4">
              <div className="card">
                <div className="card-header px-lg-5">
                  <div className="card-heading text-primary">Registration</div>
                </div>
                <div className="card-body p-lg-5">
                  <h3 className="mb-4">Login</h3>
                  <p className="text-muted text-sm mb-5">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore.
                  </p>
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
                        id="register"
                        type="button"
                        name="registerSubmit"
                        onClick={handleSubmit}
                      >
                        Register
                      </button>
                    </div>
                  </form>

                  <GoogleLogin
                    clientId="335351655350-vnafv8fmml40qfrv2m3tt41ro4m47gko.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={"single_host_origin"}
                  />
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
