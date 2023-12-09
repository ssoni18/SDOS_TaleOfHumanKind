import React, { useState } from "react";
import "../css/LoginPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FeedForm() {
  const [content, setcontent] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [image, setImage] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('resourceUrl', resourceUrl);
    formData.append('image', image);  // make sure 'image' is the state where your File object is stored
    //console.log("Image", image);
    //console.log("feed ", formData);

    axios
      .post(`${process.env.REACT_APP_DJANGO_APP_API_URL}/addfeed/`, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }, withCredentials: true
      })
      .then((response) => {
        //console.log(response);
        setFeedbackMessage("Feed added successfully!");
        // Clear the form fields
        setcontent("");
        setResourceUrl("");
        setImage("");
        navigate('/managefeed');
      })
      .catch((error) => {
        console.error(error);
        setFeedbackMessage("Error adding feed. Please try again.");
      });
  };


  return (
    <div className="App">
      <div className="page-holder align-items-center py-4 bg-gray-100 vh-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="show col-lg-6 px-lg-4">
              <div className="card ">
                <div className="card-image post-image post-image-1"></div>
                <div className="card-content post-content">
                  <div className="card-header px-lg-5">
                    <div className="card-heading text-primary">feed</div>
                  </div>
                  <div className="card-body p-lg-5">
                    <h3 className="mb-4">Add Feed</h3>
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
                          id="content"
                          type="content"
                          placeholder="content"
                          required
                          onChange={(event) => {
                            setcontent(event.target.value);
                          }}
                        />
                        <label htmlFor="content">content</label>
                      </div>
                      
                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          id="resourceURL"
                          type="tel"
                          placeholder="Resource URL"
                          required
                          onChange={(event) => {
                            setResourceUrl(event.target.value);
                          }}
                        />
                        <label htmlFor="resourceURL">Resource URL</label>
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
                            //console.log("Image after set", image);
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
                          onClick={handleSubmit}
                        >
                          Add Feed
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
              {/* <h1 className="mb-4">
                Therichpost.com <br className="d-none d-lg-inline" />
                free code snippets.
              </h1>
              <p className="lead text-muted">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore.
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
