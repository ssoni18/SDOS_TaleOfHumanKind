import React, { useState } from "react";
import "../css/LoginPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EducationalResources() {
  const [title, settitle] = useState("NULL");
  const [contenttype, setcontent_type] = useState("NULL");
  const [resource_url, setresource_url] = useState("NULL");
  const [image, setimage] = useState("NULL");

const handleSubmit = () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('contenttype', contenttype);
    formData.append('resource_url', resource_url);
    formData.append('image', image);  // make sure 'image' is the state where your File object is stored

    axios
        .post(`${process.env.REACT_APP_API_URL}/EducationResource/`, formData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error(error);
        });
};


  return (
    <div className="App">
      <div className="page-holder align-items-center py-4 bg-gray-100 vh-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="show col-lg-6 px-lg-4">
              <div className="card">
                <div className="card-header px-lg-5">
                  <div className="card-heading text-primary">Resorces</div>
                </div>
                <div className="card-body p-lg-5">
                  <h3 className="mb-4">Add Resources</h3>
                  {/* <p className="text-muted text-sm mb-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.</p> */}
                  <form action="index.html">
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="firstName"
                        type="text"
                        placeholder="title"
                        required
                        onChange={(event) => {
                          settitle(event.target.value);
                        }}
                      />
                      <label htmlFor="firstName">title</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="lastName"
                        type="text"
                        placeholder="content_type"
                        required
                        onChange={(event) => {
                          setcontent_type(event.target.value);
                        }}
                      />
                      <label htmlFor="lastName">content_type</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="phoneNumber"
                        type="tel"
                        placeholder="Phone Number"
                        required
                        onChange={(event) => {
                          setresource_url(event.target.value);
                        }}
                      />
                      <label htmlFor="phoneNumber">resource_url</label>
                    </div>
                    
                    

                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="image"
                        type="file"
                        accept="image/*"
                        required
                        onChange={(event) => {
                          setimage(event.target.files[0]);
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
                        Add Resources
                      </button>
                    </div>
                  </form>
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
