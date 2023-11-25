import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import { Link } from "react-router-dom";
function NavFunction() {
  const navigate = useNavigate();
  const handleLogout = () => {
    axios
      .post("http://localhost:8000/logout/", {}, { withCredentials: true })
      .then((response) => {
        console.log("Response Headers:", response.headers);
        if (response.data.status === 'success') {
          // Clear userData from local storage on successful logout
          localStorage.removeItem('userData');

          navigate('/Login');
        }
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Navbar expand="lg" className="bg-dark text-white body-tertiary" >
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
            </Nav>
            <Nav>
              <Link to="/Login">
                <Button variant="success" className="mr-2">
                  Login
                </Button>
              </Link>

              <Link to="/registerPage">
                <Button variant="danger">Sign Up</Button>
              </Link>


              <Button variant="success" className="mr-2" onClick={handleLogout}>
                Logout
              </Button>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavFunction;
