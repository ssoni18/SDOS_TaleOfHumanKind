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

const ManageInvitations = () => {

    const [resources, setResources] = useState([]);
    const [feedbackMessage, setFeedbackMessage] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_DJANGO_APP_API_URL}/fetchCampaignInvitations/`, { withCredentials: true });
        setResources(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [feedbackMessage]);
  const handleSubmit = (campaignId, status) => {
    console.log("campaign Id", campaignId);
    var formData = new FormData();
    formData.append('status', status);
    formData.append('id', campaignId);
      axios({
        method: "post",
        url: `${process.env.REACT_APP_DJANGO_APP_API_URL}/manageCampaignInvitations/`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      })
      .then((response) => {
        console.log(response);
        setFeedbackMessage(`Campaign ${status} successfully!`);
        setResources((prevResources) =>
          prevResources.filter((resource) => resource.id !== campaignId)
        );
      })
      .catch((error) => {
        console.error(error);
        setFeedbackMessage(`Error ${status} campaign. Please try again.`);
      });
  };


  return (
    <Container>
        {feedbackMessage && (
          <div className={feedbackMessage.includes("successfully") ? "alert alert-success" : "alert alert-danger"}>
            {feedbackMessage}
          </div>
        )}
        <Row className="justify-content-center">
        <Col xs={12} sm={8} lg={6}>
          <div className="section_heading text-center wow fadeInUp">
            <h1 className="mt-3">Our Campaigns <span></span></h1>
            <div className="line"></div>
          </div>
        </Col>
      </Row>
      <Row></Row>
      <h3 className="mt-3">Manage Invites to Campaigns<span></span></h3>
      <Row className="justify-content-center">
      {resources.length === 0 ? (
        <EmptyData
          title="No invitations to show"
          description="Looks like there are no invitations pending."
        />) :
        resources.map((resource, index) => (
          <Col xs={12} sm={6} lg={3} key={index} className="mt-5">
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top"src={`${process.env.REACT_APP_DJANGO_APP_API_URL}/media/${resource.image}`} alt={resource.title} /> 
              <Card.Body>
                <Card.Title>{resource.title}</Card.Title>
                <Card.Text>
                  {resource.description}
                  <br></br>
                  <br></br>
                  <p>ChangeMaker: {resource.changemaker__first_name}</p>
                  <p>Mentor: {resource.mentor__first_name}</p>
                </Card.Text>
                <div className="d-flex justify-content-between">
                    <Button variant="success" onClick={() => { console.log(`${resources}`); handleSubmit(resource.id, "accepted"); }}>Accept</Button>
                    <Button variant="danger" onClick={() => { console.log(`${resources}`); handleSubmit(resource.id, "rejected"); }}>Reject</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
);
};

export default ManageInvitations;


