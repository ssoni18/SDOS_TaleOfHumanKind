import React, { useState ,  useEffect} from "react";
import axios from "axios"

const ViewEducationalResource = () => {

    const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Fetchresources/`, { withCredentials: true });
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
        <div
          key={index}
          style={{
            border: "1px solid black",
            margin: "10px",
            padding: "10px",
          }}
        >
          <img
            src={resource.image}
            alt={resource.title}
            style={{ width: "100px", height: "100px" }}
          />
          <h2>{resource.title}</h2>
          <p>{resource.content_type}</p>
          <a href={resource.resource_url}>Go to resource</a>
        </div>
      ))}
    </div>
  );
};

export default ViewEducationalResource;
