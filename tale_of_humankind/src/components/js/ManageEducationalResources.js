
import React, { useEffect, useState } from 'react';
import "../css/List.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EducationalResources() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${process.env.REACT_APP_DJANGO_APP_API_URL}/get_resources/`, { withCredentials: true });
      //console.log("response", response.data);

      setData(response.data);
    };

    fetchData();
  }, []);
const handleAddUser = () => {
  navigate('/addEducationalResource');
};
const handleEdit = (id) => {
  navigate(`/editresource/${id}`);
};

const handleDelete = async (id) => {
  const shouldDelete = window.confirm("Are you sure you want to delete?");
  
  if (shouldDelete) {
    try {
      await axios.post(`${process.env.REACT_APP_DJANGO_APP_API_URL}/delete_resource/`, { id }, { withCredentials: true });
  
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }
};
  return (
    <div className="container-xl">
      <div className="table-responsive">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-5">
                <h2>Resource <b>Management</b></h2>
              </div>
              <div className="col-sm-7">
                <button onClick={handleAddUser} className="btn btn-secondary"><i className="material-icons">&#xE147;</i> <span>Add New Resource</span></button>
              </div>
            </div>
          </div>
          {data.length === 0 ? (
            <div>
              <h2>No resources to show</h2>
              <p>Looks like there are no resources added yet.</p>
            </div>
          ) : (
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Content Type</th>
                  <th>Resource URL</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((resource, index) => (
                  <tr key={index}>
                    <td>{resource.title}</td>
                    <td>{resource.content_type}</td>
                    <td><a href={resource.resource_url}>Go to resource</a></td>
                    <td>
                      <a href="#" className="edit" title="Edit" data-toggle="tooltip" onClick={() => handleEdit(resource.id)}><i className="material-icons">&#xE254;</i></a>
                      <a href="#" className="delete" title="Delete" data-toggle="tooltip" onClick={() => handleDelete(resource.id)}><i className="material-icons">&#xE5C9;</i></a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

