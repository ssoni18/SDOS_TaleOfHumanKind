import { Container, Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";
import "../css/TeamSection.css";
import EmptyData from './EmptyData';

function TeamSection() {
  const [resources, setResources] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DJANGO_APP_API_URL}/fetchTeam/`,
          { withCredentials: true }
        );
        setResources(response.data);
      } catch (error) { }
    };

    fetchData();
  }, []);

  const Mentors = resources.filter(resource => resource.user_type === "Mentor");
  const Changemakers = resources.filter(resource => resource.user_type === "Changemaker");

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} sm={8} lg={6}>
          <div className="section_heading text-center wow fadeInUp">
            <h3 className="mt-3">
              The Tale of HumanKind Team <span></span>
            </h3>
            <p>
              Appland is completely creative, lightweight, clean & super
              responsive app landing page.
            </p>
            <div className="line"></div>
          </div>
        </Col>
      </Row>
      <h5 className="mt-3">
        Mentors<span></span>
      </h5>

      <Row className="justify-content-center">
        {Mentors.length === 0 ? (
          <EmptyData
            title="No Mentors till now"
            description="Looks like there are no Mentors."
          />) : Mentors.map((resource, index) => (
            <Col key={index} xs={12} sm={6} lg={3}>
              <div className="single_advisor_profile wow fadeInUp">
                <div className="advisor_thumb">

                  <img src={
                    resource.profile_image
                      ? `${process.env.REACT_APP_DJANGO_MEDIA_URL}/media/${resource.profile_image}`
                      : "https://bootdey.com/img/Content/avatar/avatar1.png"
                  }
                    title=""
                    alt=""
                  />
                  <div className="social-info">
                    <a href={resource.facebook}>
                      <i className="fa fa-facebook"></i>
                    </a>
                    <a href={resource.twitter}>
                      <i className="fa fa-twitter"></i>
                    </a>
                    <a href={resource.linkedin}>
                      <i className="fa fa-linkedin"></i>
                    </a>
                  </div>
                </div>
                <div className="single_advisor_details_info">
                  <h6>{resource.first_name}</h6>
                  <p className="designation">{resource.user_type}</p>
                </div>
              </div>
            </Col>
          ))}
      </Row>
      <h5 className="mt-3">
        Changemakers<span></span>
      </h5>

      <Row className="justify-content-center">
        {Changemakers.length === 0 ? (
          <EmptyData
            title="No Changemakers till now"
            description="Looks like there are no Changemakers."
          />) : Changemakers.map((resource, index) => (
            <Col key={index} xs={12} sm={6} lg={3}>
              <div className="single_advisor_profile wow fadeInUp">
                <div className="advisor_thumb">
                  <img src={
                    resource.profile_image
                      ? `${process.env.REACT_APP_DJANGO_MEDIA_URL}/media/${resource.profile_image}`
                      : "https://bootdey.com/img/Content/avatar/avatar1.png"
                  }
                    title=""
                    alt=""
                  />
                  <div className="social-info">
                    <a href={resource.facebook}>
                      <i className="fa fa-facebook"></i>
                    </a>
                    <a href={resource.twitter}>
                      <i className="fa fa-twitter"></i>
                    </a>
                    <a href={resource.linkedin}>
                      <i className="fa fa-linkedin"></i>
                    </a>
                  </div>
                </div>
                <div className="single_advisor_details_info">
                  <h6>{resource.first_name}</h6>
                  <p className="designation">{resource.user_type}</p>
                </div>
              </div>
            </Col>
          ))}
      </Row>
    </Container>
  );
}

export default TeamSection;
