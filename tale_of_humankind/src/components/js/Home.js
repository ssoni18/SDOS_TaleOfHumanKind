
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRegHeart, FaHeart } from "react-icons/fa"; // Import heart icons from react-icons
import "../css/EducationResources.css"
import { useLocation, useNavigate } from 'react-router-dom'; 
import EmptyData from './EmptyData'; 

export default function Home() {

  const [resources, setResources] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const location = useLocation(); // Use useLocation hook to access location state
  const navigate = useNavigate();
  let userData = location.state?.userData; // Access userData from location state
  // If userData is not available in location state, get it from local storage
  if (!userData) {
    userData = JSON.parse(localStorage.getItem('userData'));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getfeed/`, { withCredentials: true });
        console.log("response", response.data);
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
    // const intervalId = setInterval(fetchData, 5000); // fetch data every 5 seconds
    // return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  const handleLikeClick = async (id, email) => {
    setIsLiked(prevState => ({ ...prevState, [id]: !prevState[id] }));
    let response;
    if (!isLiked[id]) {
      response = await axios.post(`${process.env.REACT_APP_API_URL}/likeFeedItem/${id}/${email}/`, {}, { withCredentials: true });
    } else {
      response = await axios.post(`${process.env.REACT_APP_API_URL}/unlikeFeedItem/${id}/${email}/`, {}, { withCredentials: true });
    }
    console.log(response);

    const updatedResources = await axios.get(`${process.env.REACT_APP_API_URL}/getfeed/`, { withCredentials: true });
    setResources(updatedResources.data);
  };


  return (
    <div>
      {resources.length === 0 ? (
        <EmptyData
          title="No feed to show"
          description="Looks like there are no posts in the feed right now."
        />) : (
        resources.map((resource, index) => (
          <div className="post" key={index}>
            <div className={`post-image post-image-${index + 1}`}>
              <img src={resource.image} alt={resource.title} />
            </div>
            <div className="post-content">
              <p className="post-date">Posted on <time datetime={resource.created_date}>{resource.created_at}</time> by <a className="post-author" href="#">{resource.creator}</a></p>
              <div className="post-excerpt">
                <p>{resource.content}</p>
                <p>{resource.id}</p>
              </div>
              <a className="post-link" href={resource.resource_url}>Read More</a>

              <button onClick={() => handleLikeClick(resource.id, userData.email)} style={{ color: isLiked[resource.id] ? 'red' : 'grey' }}>
                {isLiked[resource.id] ? <FaHeart /> : <FaRegHeart />}
              </button>

              <p> {resource.likes} likes </p>
            </div>
          </div>
        )))}
    </div>
  );
}
