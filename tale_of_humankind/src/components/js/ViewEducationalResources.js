import React, { useState ,  useEffect} from "react";
import axios from "axios"
import "../css/EducationResources.css"
const ViewEducationalResource = () => {

    const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetchEducationalResources/`, { withCredentials: true });
        console.log("response", response.data);
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
        {resources.map((resource, index) => (
            <div className="post" key={index}>
                <div className={`post-image post-image-${index + 1}`}>
                    <img src={resource.image} alt={resource.title} />
                </div>
                <div className="post-content">
                    <p className="post-date">Posted on <time datetime={resource.date}>{resource.date}</time> by <a className="post-author" href="#">{resource.author}</a></p>
                    <h2 className="post-title">{resource.title}</h2>
                    <div className="post-excerpt">
                        <p>{resource.content_type}</p>
                    </div>
                    <a className="post-link" href={resource.resource_url}>Go to resource</a>
                </div>
            </div>
        ))}
    </div>
);
};

export default ViewEducationalResource;
