import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import "../css/Navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faMapMarker, faCog, faSignOutAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';

function NavFunction() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoggedInLocal, setIsLoggedInLocal] = useState(false);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    setIsLoggedInLocal(isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/is_authenticated/`, { withCredentials: true })
      .then((response) => {
        if (response.data.is_authenticated) {
          dispatch({ type: 'LOGIN' });
        }
      })
      .catch((error) => {
        console.error(error);
        dispatch({ type: 'LOGOUT' });
      });
  }, [dispatch]);

  const handleLogout = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/logout/`, {}, { withCredentials: true })
      .then((response) => {
        if (response.data.status === 'success') {
          dispatch({ type: 'LOGOUT' });
          navigate('/Login');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Navbar expand="lg" className="bg-dark text-white body-tertiary">
        <Container>
          <Navbar.Brand as={Link} to="/" style={{ color: "white" }}>
            Tale of HumanKind
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/contactUs" style={{ color: "white" }}>
                Contact Us
              </Nav.Link>
              <Nav.Link as={Link} to="/aboutUs" style={{ color: "white" }}>
                About Us
              </Nav.Link>
              <Nav.Link as={Link} to="/teamSection" style={{ color: "white" }}>
                Our Team
              </Nav.Link>
              <Nav.Link as={Link} to="/supportUs" style={{ color: "white" }}>
                Support Us
              </Nav.Link>
              <Nav.Link as={Link} to="/viewEducationalResources" style={{ color: "white" }}>
                Resources
              </Nav.Link>
            </Nav>
            <Nav>
              {isLoggedIn ? (
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    <div className="icon_wrap">
                      <img src="https://i.imgur.com/x3omKbe.png" alt="profile_pic" />
                      <span className="name">John Alex</span>
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
                    <Dropdown.Item as={Link} to="/Address">
                      <span className="picon">
                        <FontAwesomeIcon icon={faMapMarker} />
                      </span>
                      Address
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/Settings">
                      <span className="picon">
                        <FontAwesomeIcon icon={faCog} />
                      </span>
                      Settings
                    </Dropdown.Item>
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
