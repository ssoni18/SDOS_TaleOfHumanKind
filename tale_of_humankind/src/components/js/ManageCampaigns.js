import React, { useState, useEffect } from "react";
import "../css/LoginPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EmptyData from './EmptyData'; 

export default function EducationalResources() {
  const [title, setTitle] = useState("");
  const [description, setdescription] = useState("");
  const [goalAmount, setgoalAmount] = useState(0);
  const [Mentor, setMentor] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [mentorsData, setMentorsData] = useState({});
  const [image, setImage] = useState("");

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_DJANGO_APP_API_URL}/fetchMentors/`, { withCredentials: true });
        setMentorsData(response.data.mentors || {});
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);
  const handleSubmit = () => {
    var formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('goalAmount', goalAmount);
    formData.append('Mentor', Mentor);
    formData.append('image', image);  // make sure 'image' is the state where your File object is stored

      axios({
        method: "post",
        url: `${process.env.REACT_APP_DJANGO_APP_API_URL}/addCampaign/`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      })
      .then((response) => {
        console.log(response);
        setFeedbackMessage("Campaign added successfully!");
        // setTitle("");
        // setdescription("");
        // setgoalAmount(0);
        // setMentor("");
        // setImage("");
      })
      .catch((error) => {
        console.error(error);
        console.log(error.response.data.message)
        setFeedbackMessage(`${error.response.data.message}`);
      });
  };


  return (
    <div className="App">
      <div className="page-holder align-items-center py-4 bg-gray-100 vh-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="show col-lg-6 px-lg-4">
              <div className="card post">
                {/* <div className="card-image post-image post-image-1"></div> */}
                <div className="card-content post-content">
                  <div className="card-header px-lg-5">
                    <div className="card-heading text-primary">Campaigns</div>
                  </div>
                  <div className="card-body p-lg-5">
                    <h3 className="mb-4">Add Campaign</h3>
                    {feedbackMessage && (
                      <div className={feedbackMessage.includes("successfully") ? "alert alert-success" : "alert alert-danger"}>
                        {feedbackMessage}
                      </div>
                    )}
                    {/* <p className="text-muted text-sm mb-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.</p> */}
                    <form action="index.html">
                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          id="title"
                          type="text"
                          placeholder="Title"
                          required
                          onChange={(event) => {
                            setTitle(event.target.value);
                          }}
                        />
                        <label htmlFor="title">Title</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          id="description"
                          type="text"
                          placeholder="Content Type"
                          required
                          onChange={(event) => {
                            setdescription(event.target.value);
                          }}
                        />
                        <label htmlFor="description">Description</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          id="goalAmount"
                          type="number"
                          placeholder="Resource URL"
                          required
                          onChange={(event) => {
                            setgoalAmount(event.target.value);
                          }}
                        />
                        <label htmlFor="goalAmount">Goal Amount</label>
                      </div>

                        <div className="form-floating mb-3">
                          <select
                          className="form-control"
                          id="mentor"
                          type="text"
                          placeholder="Mentor"
                          required
                          onChange={(event) => {
                            setMentor(event.target.value);
                          }}
                          >
                          <option value="" disabled selected className="form-floating mb-3"></option>
                          {Object.entries(mentorsData).map(([email, name], index) => (
                            <optgroup label={name} key={index}>
                              <option value={email}>{email}</option>
                            </optgroup>
                          ))}
                          </select>

                          <label htmlFor="Mentor">Mentor</label>
                        </div>
                        <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          id="image"
                          type="file"
                          accept="image/*"
                          required
                          onChange={(event) => {
                            const file = event.target.files[0];
                            setImage(file);
                            console.log("Image after set", image);
                          }}
                        />
                        
                        <label htmlFor="image">Image</label>
                      </div>
                      <div className="form-group">
                        <button
                          className="btn btn-primary"
                          id="register"
                          type="button"
                          name="registerSubmit"
                          onClick={() => {
                            console.log(Mentor);
                            handleSubmit();
                          }}
                        >
                          Add Campaign
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-xl-5 ms-xl-auto px-lg-4 text-center text-primary">
              <img
                className="img-fluid mb-4"
                width="300"
                src="https://therichpost.com/wp-content/uploads/2021/06/login_page_image.png"
                alt=""
                style={{ transform: "rotate(10deg)" }}
              />
              <h1 className="mb-4">
                Therichpost.com <br className="d-none d-lg-inline" />
                free code snippets.
              </h1>
              <p className="lead text-muted">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
