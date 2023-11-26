import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

function NavFunction() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoggedInLocal, setIsLoggedInLocal] = useState(false);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);


  useEffect(() => {
    setIsLoggedInLocal(isLoggedIn); // Update local state when Redux state changes
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
              <Nav.Link as={Link} to="/ViewEducationalResource" style={{ color: "white" }}>
                Resources
              </Nav.Link>
              {isLoggedIn && (
                <Nav.Link as={Link} to="/UserProfile" style={{ color: "white" }}>
                  My Profile
                </Nav.Link>
              )}
            </Nav>
            {isLoggedIn ? (
              <Button variant="success" className="mr-2" onClick={handleLogout}>
                Logout
              </Button>
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

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavFunction;
