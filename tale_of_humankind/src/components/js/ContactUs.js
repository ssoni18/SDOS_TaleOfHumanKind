import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Notification from './Notification';
import "../css/ContactUs.css";

export default function ContactUs() {
  const userData = useSelector(state => state.auth.userData);
  const [formData, setFormData] = useState({
    name: userData ? userData.first_name + " " + userData.last_name : '',
    email: userData ? userData.email : '',
    phone: userData ? userData.phone : '',
    message: '',
    stayAnonymous: false,
    inquiryType: 'Query'
  });

  const [showNotification, setShowNotification] = useState(false); // State to control the display of the notification
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Make API call to send formData to backend
    axios.post(`${process.env.REACT_APP_DJANGO_APP_API_URL}/contactUs/`, {
      ...formData,
      name: (!userData || formData.stayAnonymous) ? 'Anonymous' : formData.name,
      email: (!userData || formData.stayAnonymous) ? 'anon@taleofhumankind.com' : formData.email,
      phone: (!userData || formData.stayAnonymous) ? '0000000000' : formData.phone,
    }, { withCredentials: true })
      .then((response) => {
        // Handle response
        setNotificationMessage('We received your message! We will get back to you soon.');
        setShowNotification(true);
      })
      .catch((error) => {
        // Handle error
        setNotificationMessage('Error submitting form');
        setShowNotification(true);
      });
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  return (
    <div className="contact3 py-3">
      {showNotification ? <Notification message={notificationMessage} showNotification={showNotification} onClose={handleNotificationClose} /> : null}
      <div className="container-fluid h-100">
        <div className="row">
          <div className="col-lg-5">
          <div className="card-shadow">
                <img
                  src="https://www.wrappixel.com/demos/ui-kit/wrapkit/assets/images/contact/2.jpg"
                  className="img-fluid"
                  alt="Contact"
                />
              </div>
              </div>
              <div className="col-lg-6">
            <div className="contact-box ml-3">
              <h1 className="font-weight-light mt-2">Quick Contact</h1>
              <form className="mt-4" onSubmit={handleSubmit}>
                <div className="row">
                  {userData && !formData.stayAnonymous && (
                    <>
                      <div className="col-lg-12">
                        <div className="form-group mt-2">
                          <input
                            className="form-control"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Name"
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group mt-2">
                          <input
                            className="form-control"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email address"
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group mt-2">
                          <input
                            className="form-control"
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Phone"
                            disabled={true}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {userData && (
                    <div className="col-lg-12">
                      <div className="form-group form-check mt-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="anonymousCheck"
                          name="stayAnonymous"
                          checked={formData.stayAnonymous}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="anonymousCheck">Stay Anonymous</label>
                      </div>
                    </div>
                  )}
                  <div className="col-lg-12">
                    <div className="form-group mt-2">
                      <textarea
                        className="form-control"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Message"
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group mt-2">
                      <select
                        className="form-control"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                      >
                        <option value="Query">Query</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Complaint">Complaint</option>
                        {/* Add more options as needed */}
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <button
                      type="submit"
                      className="btn btn-danger-gradiant mt-3 text-white border-0 px-3 py-2"
                    >
                      <span> SUBMIT</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}