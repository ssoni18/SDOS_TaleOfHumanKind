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
import Loading from './Loading'; // Import the Loading component
import { Link } from "react-router-dom";

const ViewCampaigns = () => {

  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading to true at the start of the fetch
        const response = await axios.get(`${process.env.REACT_APP_DJANGO_APP_API_URL}/fetchCampaigns/`, { withCredentials: true });
        setCampaigns(response.data);
        setIsLoading(false); // Set loading to false once the fetch is complete
      } catch (error) {
        console.error('Error fetching data: ', error);
        setIsLoading(false); // Set loading to false if there is an error
      }
    };

    fetchData();
  }, []);
  
  const fundedCampaigns = campaigns.filter(resource => resource.goal_amount > 0 && resource.current_amount < resource.goal_amount);
  const nonFundedCampaigns = campaigns.filter(resource => resource.goal_amount === 0);

  if (isLoading) {
    console.log("loading now")
    // Render the Loading component while the fetch is in progress
    return <Loading />;
  }

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
              <Card.Img variant="top"src={`${process.env.REACT_APP_DJANGO_MEDIA_URL}/media/${resource.image}`} alt={resource.title} /> 
              <Card.Body>
              <center><Card.Title> {resource.title}</Card.Title></center>
                <Card.Text>
                  {resource.description}
                  <br></br>
                  <br></br>
                  <p><b>ChangeMaker:</b> {resource.changemaker__first_name}</p>
                  <p><b>Mentor:</b> {resource.mentor__first_name}</p>
                </Card.Text>
                <Link to="/donationPage" state={{campaignId: resource.id, campaignName: resource.title}}>
                  <center> <Button variant="primary">Fund Now!</Button></center>
              </Link>
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
              <Card.Img variant="top"src={`${process.env.REACT_APP_DJANGO_MEDIA_URL}/media/${resource.image}`} alt={resource.title} /> 
              <Card.Body>
                <center><Card.Title> {resource.title}</Card.Title></center>
                <Card.Text>
                  {resource.description}
                  <br></br>
                  <br></br>
                  <p><b>ChangeMaker:</b> {resource.changemaker__first_name}</p>
                  <p><b>Mentor:</b> {resource.mentor__first_name}</p>
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


