import React from 'react';
import "../css/userProfile.css";
import RegistrationCounter from './Counter';

export default function UserProfile() {
  return (
    <section className="section about-section gray-bg" id="about">
      <div className="container">
        <div className="row align-items-center flex-row-reverse">
          <div className="col-lg-6">
            <div className="about-text go-to">
              <h3 className="dark-color"></h3>
              <h6 className="theme-color lead">Role</h6>
              <p>
                Some description that is optional that the user will write about himself in his profile 
              </p>
              <div className="row about-list">
                <div className="col-md-6">
                  <div className="media">
                    <label>Birthday</label>
                    <p>4th April 1998</p>
                  </div>
                  <div className="media">
                    <label>Age</label>
                    <p>22 Yr</p>
                  </div>
                  <div className="media">
                    <label>Country</label>
                    <p>Canada</p>
                  </div>
                  <div className="media">
                    <label>Address</label>
                    <p>California, USA</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="media">
                    <label>E-mail</label>
                    <p>info@domain.com</p>
                  </div>
                  <div className="media">
                    <label>Phone</label>
                    <p>820-885-3321</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="about-avatar">
              <img src="https://bootdey.com/img/Content/avatar/avatar7.png" title="" alt="" />
            </div>
          </div>
        </div>
        <br></br>
        <h6>This could include information realted to maybe students he/she taught</h6>
          
        <div className="counter">
          <div className="row">
            <div className="col-6 col-lg-3">
              <div className="count-data text-center">
                <RegistrationCounter limit="300" description="Happy Clients"/>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="count-data text-center">
              <RegistrationCounter limit="100" description="Project Completed"/>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="count-data text-center">
              <RegistrationCounter limit="300" description="Photo Capture"/>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="count-data text-center">
              <RegistrationCounter limit="50" description="Telephonic Calls"/>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
