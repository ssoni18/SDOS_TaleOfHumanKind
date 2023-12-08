import React, { useState, useEffect } from "react";
import axios from "axios"
import "../css/EducationResources.css"
import EmptyData from './EmptyData';
import Loading from './Loading'; // Import the Loading component
import { useNavigate } from "react-router-dom";
const ViewEducationalResource = () => {

  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading to true at the start of the fetch
        const response = await axios.get(`${process.env.REACT_APP_DJANGO_APP_API_URL}/fetchEducationalResources/`, { withCredentials: true });
        //console.log("response", response.data);
        setResources(response.data);
        setIsLoading(false); // Set loading to false once the fetch is complete
      } catch (error) {
        console.error('Error fetching data: ', error);
        setIsLoading(false); // Set loading to false if there is an error
      }
    };

    fetchData();
  }, []);

  const handleAddUser = () => {
    navigate('/form');
  };


  if (isLoading) {
    // Render the Loading component while the fetch is in progress
    return <Loading />;
  }

  return (
    <div>

      <div className="fixed-button" onClick={handleAddUser}>
        <button className="btn btn-secondary">
          <i className="material-icons">&#xE147;</i>
          <span>Add New Resource</span>
        </button>
      </div>

      {resources.length === 0 ? (
        <EmptyData
          title="No resources to show"
          description="Looks like there are no resources added yet."
        />) : (
        resources.map((resource, index) => (
          <div className="post" key={index}>
            <div className={`post-image post-image-${index + 1}`}>
              <img src={`${process.env.REACT_APP_DJANGO_APP_API_URL}/media/${resource.image}`} alt={resource.title} />
            </div>
            <div className="post-content">
              <p className="post-date">Posted by <a className="post-author" href="#">{resource.creator__email}</a> on <time>{new Date(resource.created_date).toLocaleString('en-GB')}</time></p>
              <div className="post-excerpt">
                <p>{resource.content_type}</p>
              </div>
              <a className="post-link" href={resource.resource_url} target={resource.resource_url.startsWith('http') ? "_self" : "_blank"}>Go to resource</a>            </div>
          </div>
        )))}
    </div>
  );
};

export default ViewEducationalResource;
