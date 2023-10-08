import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import "../css/TeamSection.css"
function TeamSection() {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} sm={8} lg={6}>
          <div className="section_heading text-center wow fadeInUp">
            <h3 className="mt-3">The Tale of HumanKind Team <span></span></h3>
            <p>Appland is completely creative, lightweight, clean & super responsive app landing page.</p>
            <div className="line"></div>
          </div>
        </Col>
      </Row>
      <Row>
        {/* Single Advisor */}
        <Col xs={12} sm={6} lg={3}>
          <div className="single_advisor_profile wow fadeInUp">
            <div className="advisor_thumb"><img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" />
              {/* Social Info */}
              <div className="social-info">
                <a href="#"><i className="fa fa-facebook"></i></a>
                <a href="#"><i className="fa fa-twitter"></i></a>
                <a href="#"><i className="fa fa-linkedin"></i></a>
              </div>
            </div>
            {/* Team Details */}
            <div className="single_advisor_details_info">
              <h6>Samantha Sarah</h6>
              <p className="designation">Founder & CEO</p>
            </div>
          </div>
        </Col>
        {/* Single Advisor */}
        <Col xs={12} sm={6} lg={3}>
          <div className="single_advisor_profile wow fadeInUp">
            <div className="advisor_thumb"><img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="" />
              {/* Social Info */}
              <div className="social-info">
                <a href="#"><i className="fa fa-facebook"></i></a>
                <a href="#"><i className="fa fa-twitter"></i></a>
                <a href="#"><i className="fa fa-linkedin"></i></a>
              </div>
            </div>
            {/* Team Details */}
            <div className="single_advisor_details_info">
              <h6>Nazrul Islam</h6>
              <p className="designation">UI Designer</p>
            </div>
          </div>
        </Col>
        {/* Single Advisor */}
        <Col xs={12} sm={6} lg={3}>
          <div className="single_advisor_profile wow fadeInUp">
            <div className="advisor_thumb"><img src="https://bootdey.com/img/Content/avatar/avatar6.png" alt="" />
              {/* Social Info */}
              <div className="social-info">
                <a href="#"><i className="fa fa-facebook"></i></a>
                <a href="#"><i className="fa fa-twitter"></i></a>
                <a href="#"><i className="fa fa-linkedin"></i></a>
              </div>
            </div>
            {/* Team Details */}
            <div className="single_advisor_details_info">
              <h6>Riyadh Khan</h6>
              <p className="designation">Developer</p>
            </div>
          </div>
        </Col>
        {/* Single Advisor */}
        <Col xs={12} sm={6} lg={3}>
          <div className="single_advisor_profile wow fadeInUp">
            <div className="advisor_thumb"><img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="" />
              {/* Social Info */}
              <div className="social-info">
                <a href="#"><i className="fa fa-facebook"></i></a>
                <a href="#"><i className="fa fa-twitter"></i></a>
                <a href="#"><i className="fa fa-linkedin"></i></a>
              </div>
            </div>
            {/* Team Details */}
            <div className="single_advisor_details_info">
              <h6>Niloy Islam</h6>
              <p className="designation">Marketing Manager</p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default TeamSection;
