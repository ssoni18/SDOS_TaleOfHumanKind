
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRegHeart, FaHeart } from "react-icons/fa"; // Import heart icons from react-icons
import "../css/EducationResources.css"

export default function Home() {

  const [resources, setResources] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

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
    const intervalId = setInterval(fetchData, 50); // fetch data every 5 seconds
    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  const handleLikeClick = async () => {
    setIsLiked(!isLiked);
    let response;
    if (!isLiked) {
      response = await axios.post(`${process.env.REACT_APP_API_URL}/incrementLikeCount/`, {}, { withCredentials: true });
    } else {
      response = await axios.post(`${process.env.REACT_APP_API_URL}/decrementLikeCount/`, {}, { withCredentials: true });
    }
    console.log(response);
  };

return (
    <div>
    {resources.map((resource, index) => (
        <div className="post" key={index}>
            <div className={`post-image post-image-${index + 1}`}>
                <img src={resource.image} alt={resource.title}/>
            </div>
            <div className="post-content">
                <p className="post-date">Posted on <time datetime={resource.created_date}>{resource.created_at}</time> by <a className="post-author" href="#">{resource.creator}</a></p>
                <div className="post-excerpt">
                    <p>{resource.content}</p>
                </div>
                <a className="post-link" href={resource.resource_url}>Read More</a>
            
                <button onClick={handleLikeClick} style={{ color: isLiked ? 'red' : 'grey' }}>
                  {isLiked ? <FaHeart /> : <FaRegHeart />}
                </button>
                <p> {resource.likes} likes </p>
            </div>
        </div>
    ))}
</div>
  );
}
