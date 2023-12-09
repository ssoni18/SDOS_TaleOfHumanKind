
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRegHeart, FaHeart } from "react-icons/fa"; // Import heart icons from react-icons
import "../css/EducationResources.css"
import { useLocation, useNavigate } from 'react-router-dom'; 
import { useSelector, useDispatch } from 'react-redux';               
import EmptyData from './EmptyData'; 

export default function Home() {

  const [resources, setResources] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const location = useLocation(); // Use useLocation hook to access location state
  const navigate = useNavigate();
  const userData = useSelector(state => state.auth.userData); // Access userData from Redux store

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_DJANGO_APP_API_URL}/getfeed/`, { withCredentials: true });
        //console.log("response", response.data);
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
      response = await axios.post(`${process.env.REACT_APP_DJANGO_APP_API_URL}/likeFeedItem/${id}/${email}/`, {}, { withCredentials: true });
    } else {
      response = await axios.post(`${process.env.REACT_APP_DJANGO_APP_API_URL}/unlikeFeedItem/${id}/${email}/`, {}, { withCredentials: true });
    }
    //console.log(response);

    const updatedResources = await axios.get(`${process.env.REACT_APP_DJANGO_APP_API_URL}/getfeed/`, { withCredentials: true });
    setResources(updatedResources.data);
  };

  const handleAddUser = () => {
    navigate('/feedForm');
  };

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <div>
      <div className="fixed-button" onClick={handleAddUser}>
        <button className="btn btn-secondary">
          <i className="material-icons">&#xE147;</i>
          <span>Add New Feed</span>
        </button>
      </div>

      {resources.length === 0 ? (
        <EmptyData
          title="No feed to show"
          description="Looks like there are no posts in the feed right now."
        />) : (
        resources.map((resource, index) => (
          <div className="post" key={index}>
            <div className={`post-image post-image-${index + 1}`}>
              {/* {//console.log("image" , resource.image)} */}
              <img src={`${process.env.REACT_APP_DJANGO_MEDIA_URL}/media/${resource.image}`} alt={resource.title} />
            </div>
            <div className="post-content">
              {console.log(resource.created_date)}
              <p className="post-date">Posted on <time datetime={resource.created_at}>{formatDate(resource.created_at)}</time> by <a className="post-author" href={`/publicProfile/${resource.creator__id}`}>{resource.creator__email}</a></p>
              <div className="post-excerpt">
                <p>{resource.content}</p>
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
