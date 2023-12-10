import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useSelector } from "react-redux";
import "../css/LoginPage.css";
import { Link } from "react-router-dom";


export default function Feed() {
    const navigate = useNavigate();
    const { id } = useParams();
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [formState, setFormState] = useState(null);


  useEffect(() => {
    const fetchResource = async () => {
        const response = await axios.get(`${process.env.REACT_APP_DJANGO_APP_API_URL}/get_feed_id/${id}`, { withCredentials: true });
        setFormState(response.data);
    };

    fetchResource();
  }, [id]);

  const handleSubmit = () => {
    axios
      .post(`${process.env.REACT_APP_DJANGO_APP_API_URL}/edit_feed/`, formState, {
        headers: {
            'content-type' : 'multipart/form-data'
        },
        withCredentials: true,
      })
      .then((response) => {
        setFeedbackMessage("Resources updated successfully!");
        navigate('/manageFeed');
      })
      .catch((error) => {
        console.error(error);
        setFeedbackMessage("Error updating Resources. Please try again.");
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
                  <div className="card-heading text-primary">Resources</div>
                </div>
                <div className="card-body p-lg-5">
                  <h3 className="mb-4">Edit Yourself</h3>
                  {feedbackMessage && (
                      <div className={feedbackMessage.includes("successfully") ? "alert alert-success" : "alert alert-danger"}>
                        {feedbackMessage}
                      </div>
                    )}
                    {formState && (
                  <form action="index.html">
                    {/* <div className="form-floating mb-3">
                      <input className="form-control" id="lastName" type="text" placeholder="Last Name" required  onChange={(event) => {
                          setusername(event.target.value);
                        }}/>
                      <label htmlFor="lastName">UserName</label>
                    </div> */}
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="content"
                        type="text"
                        placeholder="content"
                        name="content"
                        value={formState.content || ""}
                        required
                        onChange={(event) => {
                          setFormState({
                            ...formState,
                            [event.target.name]: event.target.value,
                          });
                        }}
                      />
                      <label htmlFor="content">content</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="resource_url"
                        type="text"
                        placeholder="resource_url"
                        name="resource_url"
                        value={formState.resource_url || ""}
                        required
                        onChange={(event) => {
                          setFormState({
                            ...formState,
                            [event.target.name]: event.target.value,
                          });
                        }}
                      />
                      <label htmlFor="resource_url">resource_url</label>
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
                            setFormState({
                              ...formState,
                              profileImage: file
                            });
                          }}
                        />
                        <label htmlFor="image">Image</label>
                    </div>
              

                    <div className="form-group">
                      <button
                        className="btn btn-success"
                        id="register"
                        type="button"
                        name="registerSubmit"
                        onClick={handleSubmit}
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
