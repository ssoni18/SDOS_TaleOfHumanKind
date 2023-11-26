
import React, { useState ,  useEffect} from "react";
import axios from "axios";

export default function Home() {

    const [resources, setResources] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/getfeed/`);
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
            alt={resource.user}
            style={{ width: "100px", height: "100px" }}
          />
          <h2>{resource.content}</h2>
          <p>{resource.likes}</p>
          <a href={resource.resource_url}>Go to resource</a>
        </div>
      ))}
    </div>
  );
}
