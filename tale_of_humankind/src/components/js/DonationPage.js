import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/DonationPage.css";
import fundraisingImage from "../static/fundraising.jpg";
const MakeDonations = () => {
  const [resources, setResources] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [amountToDonate, setAmountToDonate] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DJANGO_APP_API_URL}/fetchCampaigns/`,
          { withCredentials: true }
        );
        console.log("response", response.data);
        setResources(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);



  const handleCampaignChange = (e) => {
    setSelectedCampaign(e.target.value);
  };
  const fundedCampaigns = resources.filter(
    (resource) =>
      resource.goal_amount > 0 && resource.current_amount < resource.goal_amount
  );
  const handleCustomValueChange = (e) => {
    const value = e.target.value;
    const amount = value !== '' ? parseInt(value, 10) : 0;
    setAmountToDonate(amount);
  };

  return (

    <div className="container d-lg-flex" id="donationContainer">
      <div className="box-1 bg-light user">
        <div className="box-inner-1 pb-3 mb-3">
          <div
            id="my"
            className="carousel slide carousel-fade img-details"
            data-bs-ride="carousel"
            data-bs-interval="2000"
          >
            <div id="">
              <img src={fundraisingImage} />
            </div>
          </div>
          <h4 className="my-3">Some Denominations to Choose from</h4>
          <div className="radiobtn">
            <input type="radio" name="box" id="one" value="2000" onChange={handleCustomValueChange}/>
            <input type="radio" name="box" id="two" value="5000" onChange={handleCustomValueChange}/>
            <input type="radio" name="box" id="three" value="10000" onChange={handleCustomValueChange}/>
            <label htmlFor="one" className="box py-2 first">
              <div className="d-flex align-items-start">
                <span className="circle"></span>
                <div className="course">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fw-bold">Rs.2000</span>
                  </div>
                </div>
              </div>
            </label>
            <label htmlFor="two" className="box py-2 second">
              <div className="d-flex">
                <span className="circle"></span>
                <div className="course">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fw-bold">Rs.5000</span>
                  </div>
                </div>
              </div>
            </label>
            <label htmlFor="three" className="box py-2 third">
              <div className="d-flex">
                <span className="circle"></span>
                <div className="course">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fw-bold">Rs.10000</span>
                  </div>
                </div>
              </div>
            </label>
          </div>
          
        </div>
      </div>
      <div className="box-2">
        <div className="box-inner-2">
          <div>
            <p className="fw-bold">Payment Details</p>
            <p className="dis mb-3">
              Complete your purchase by providing your payment details
            </p>
          </div>
          <form action="">
            <div className="mb-3">
              <p className="dis fw-bold mb-2">Name</p>
              <input className="form-control" type="text" />
            </div>
            <div className="mb-3">
              <p className="dis fw-bold mb-2">Email address</p>
              <input className="form-control" type="email" />
            </div>
            <div>
              <div className="address">
                <p className="dis fw-bold mb-3">Campaign Selected</p>
                <div className="inputWithcheck">
                  <select
                    className="dis fw-bold mb-2 form-control custom-select"
                    readOnly
                  >
                    {fundedCampaigns.map((resource, index) => (
                      <option key={index} value={resource.id}>
                        {resource.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className=" my-3">
                  <p className="dis fw-bold mb-2">Custom Value</p>
                  <div>
                    <input
                      className="form-control"
                      type="number"
                      min="0" // Set minimum value to 0 (or any other minimum allowed number)
                      step="100" // Set step to 100 (increments)
                      onChange={handleCustomValueChange}
                    />
                  </div>
                </div>
                <div className="d-flex flex-column dis">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <p>Total</p>
                    <p>
                      <span className="fas fa-dollar-sign"></span>{amountToDonate}
                    </p>
                  </div>
                  <div className="btn btn-primary mt-2">
                    Pay<span className="fas fa-dollar-sign px-1"></span>{amountToDonate}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MakeDonations;
