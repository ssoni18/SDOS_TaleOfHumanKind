import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "../css/Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserAlt,
  faMapMarker,
  faCog,
  faSignOutAlt,
  faChevronDown,
  faRss,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

function NavFunction() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData); // Access userData from Redux store

  const [isLoggedInLocal, setIsLoggedInLocal] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    setIsLoggedInLocal(isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_DJANGO_APP_API_URL}/is_authenticated/`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.is_authenticated) {
          dispatch({ type: "LOGIN", userData: userData });
        }
      })
      .catch((error) => {
        console.error(error);
        dispatch({ type: "LOGOUT" });
      });
  }, [dispatch, userData]);

  const handleLogout = () => {
    axios
      .post(
        `${process.env.REACT_APP_DJANGO_APP_API_URL}/logout/`,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.status === "success") {
          dispatch({ type: "LOGOUT" });
          navigate("/Login");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Navbar expand="lg" className="bg-dark text-white body-tertiary fixed-top">
        <Container>
          <Navbar.Brand as={Link} to="/" style={{ color: "white" }}>
            Tale of HumanKind
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/feed" style={{ color: "white" }}>
                Feed
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/viewCampaigns"
                style={{ color: "white" }}
              >
                Campaigns
              </Nav.Link>
              <Nav.Link as={Link} to="/viewEducationalResources" style={{ color: "white" }}>
                Resources
              </Nav.Link>
              <Nav.Item as={Dropdown}>
                <Dropdown.Toggle
                  variant="links"
                  id="dropdown-basic"
                  as={Nav.Link}
                  style={{ color: "white" }}
                >
                  More
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/aboutUs">
                    About Us
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/teamSection">
                    Our Team
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/contactUs">
                    Contact Us
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Nav.Item>
            </Nav>
            <Nav>
              {isLoggedIn ? (
                <Dropdown>
                  <Dropdown.Toggle
                    variant="success"
                    id="dropdown-basic"
                    className="profile-dropdown-toggle"
                  >
                    <div className="icon_wrap">
                      {userData.profile_image ? (
                        <img
                          src={`${process.env.REACT_APP_DJANGO_APP_API_URL}${userData.profile_image}`}
                          title=""
                          alt=""
                        />
                      ) : (
                        <img
                          src="https://i.imgur.com/x3omKbe.png"
                          title=""
                          alt=""
                        />
                      )}
                      <span className="name">{userData.first_name + " " + userData.last_name}</span>
                      <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/UserProfile">
                      <span className="picon">
                        <FontAwesomeIcon icon={faUserAlt} />
                      </span>
                      Profile
                    </Dropdown.Item>
                    {userData.user_type === "Mentor" && (
                      <Dropdown.Item as={Link} to="/manageEducationalResources">
                        <span className="picon">
                          <FontAwesomeIcon icon={faMapMarker} />{" "}
                          {/* You can change this icon */}
                        </span>
                        Manage Resources
                      </Dropdown.Item>
                    )}

                    {userData.user_type === "Changemaker" && (
                      <Dropdown.Item as={Link} to="/manageCampaigns">
                        <span className="picon">
                          <FontAwesomeIcon icon={faMapMarker} />{" "}
                          {/* You can change this icon */}
                        </span>
                        Manage Campaigns
                      </Dropdown.Item>
                    )}

                    <Dropdown.Item as={Link} to="/managefeed">
                      <span className="picon">
                        <FontAwesomeIcon icon={faRss} />
                      </span>
                      Manage Feed
                    </Dropdown.Item>
                    {userData.user_type === "Mentor" && (
                      <Dropdown.Item as={Link} to="/manageInvitations">
                        <span className="picon">
                          <FontAwesomeIcon icon={faEnvelope} />
                        </span>
                          Campaign Invitations
                      </Dropdown.Item>
                    )}
                    {/* <Dropdown.Item as={Link} to="/Settings">
                      <span className="picon">
                        <FontAwesomeIcon icon={faCog} />
                      </span>
                      Settings
                    </Dropdown.Item> */}
                    <Dropdown.Item onClick={handleLogout}>
                      <span className="picon">
                        <FontAwesomeIcon icon={faSignOutAlt} />
                      </span>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Link to="/Login">
                    <Button variant="success" className="mr-2">
                      Login
                    </Button>
                  </Link>
                  <Link to="/registerPage">
                    <Button variant="danger">Sign Up</Button>
                  </Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavFunction;
