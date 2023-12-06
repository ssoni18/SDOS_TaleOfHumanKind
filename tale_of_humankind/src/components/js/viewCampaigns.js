import React, { useState ,  useEffect} from "react";
import axios from "axios"
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import "../css/TeamSection.css"
import EmptyData from './EmptyData'; 

const ViewCampaigns = () => {

  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_DJANGO_APP_API_URL}/fetchCampaigns/`, { withCredentials: true });
        console.log("response", response.data);
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);
  
  const fundedCampaigns = resources.filter(resource => resource.goal_amount > 0 && resource.current_amount < resource.goal_amount);
  const nonFundedCampaigns = resources.filter(resource => resource.goal_amount == 0);

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
      {fundedCampaigns.length === 0 ? (
        <EmptyData
          title="No funded Campaigns"
          description="Looks like there are no funded Campaigns."
        />) :fundedCampaigns.map((resource, index) => (
          <Col xs={12} sm={6} lg={3} key={index} className="mt-5">
            <Card style={{ width: '18rem' }}>
              {console.log(resource)}
              <Card.Img variant="top"src={`${process.env.REACT_APP_DJANGO_APP_API_URL}/media/${resource.image}`} alt={resource.title} /> 
              {console.log(`${process.env.REACT_APP_DJANGO_APP_API_URL}/media/${resource.image}`)}
              <Card.Body>
              <center><Card.Title> {resource.title}</Card.Title></center>
                <Card.Text>
                  {resource.description}
                  <br></br>
                  <br></br>
                  <p>ChangeMaker: {resource.changemaker__first_name}</p>
                  <p>Mentor: {resource.mentor__first_name}</p>
                </Card.Text>
                <center><Button variant="primary">Fund Now!</Button></center>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <h3 className="mt-3">Non-funding Campaigns<span></span></h3>
      <Row className="justify-content-center">
      {nonFundedCampaigns.length === 0 ? (
        <EmptyData
          title="No non-funded campaigns"
          description="Looks like there are no non-funded campaigns."
        />) :nonFundedCampaigns.map((resource, index) => (
          <Col xs={12} sm={6} lg={3} key={index} className="mt-5">
            <Card style={{ width: '18rem' }}>
              {console.log(resource)}
              <Card.Img variant="top"src={`${process.env.REACT_APP_DJANGO_APP_API_URL}/media/${resource.image}`} alt={resource.title} /> 
              {console.log(`${process.env.REACT_APP_DJANGO_APP_API_URL}/media/${resource.image}`)}
              <Card.Body>
                <center><Card.Title> {resource.title}</Card.Title></center>
                <Card.Text>
                  {resource.description}
                  <br></br>
                  <br></br>
                  <p>ChangeMaker: {resource.changemaker__first_name}</p>
                  <p>Mentor: {resource.mentor__first_name}</p>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
);
};

export default ViewCampaigns;


