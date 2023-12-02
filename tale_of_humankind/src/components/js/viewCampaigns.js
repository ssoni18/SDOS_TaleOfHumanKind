import React, { useState ,  useEffect} from "react";
import axios from "axios"
// import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import "../css/TeamSection.css"
const ViewCampaigns = () => {

    const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetchCampaigns/`, { withCredentials: true });
        console.log("response", response.data);
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
            <Row className="justify-content-center">
        <Col xs={12} sm={8} lg={6}>
          <div className="section_heading text-center wow fadeInUp">
            <h1 className="mt-3">Our Campaigns <span></span></h1>
            <div className="line"></div>
          </div>
        </Col>
      </Row>
      <Row></Row>
      <h3 className="mt-3">Campaigns to Fund<span></span></h3>
      <Row className="justify-content-center">
        {resources.map((resource, index) => (
          <Col xs={12} sm={6} lg={3} key={index} className="mt-5">
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={require('../static/image_1.jpeg')} />
              <Card.Body>
                <Card.Title>Campaign {`${index + 1}`}: {resource.title}</Card.Title>
                <Card.Text>
                  {resource.description}
                  <br></br>
                  <br></br>
                  <p>ChangeMaker: {resource.changemaker__first_name}</p>
                  <p>Mentor: {resource.mentor__first_name}</p>
                </Card.Text>
                {/* <Button variant="primary">Go somewhere</Button> */}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
);
};

export default ViewCampaigns;


