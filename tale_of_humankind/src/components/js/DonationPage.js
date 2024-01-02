import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/DonationPage.css";
import { useLocation } from "react-router-dom"
import fundraisingImage from "../static/fundraising.jpg";

function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => {
			resolve(true)
		}
		script.onerror = () => {
			resolve(false)
		}
		document.body.appendChild(script)
	})
}

const MakeDonations = () => 
{
    const location = useLocation();
    const {campaignId, campaignName} = location.state;
    const [isCustomValueSelected, setIsCustomValueSelected] = useState(false);
    const [resources, setResources] = useState([]);
    const [amountToDonate, setAmountToDonate] = useState(0);
    const [name, setName] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [email, setEmail] = useState("");
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(
              `${process.env.REACT_APP_DJANGO_APP_API_URL}/fetchCampaigns/`,
              { withCredentials: true }
            );
            setResources(response.data);
          } catch (error) {
            
          }
        };
    
        fetchData();
    }, []);

    const fundedCampaigns = resources.filter(
        (resource) =>
          resource.goal_amount > 0 && resource.current_amount < resource.goal_amount
      );
      const handleCustomValueChange = (e) => {
        const value = e.target.value;
        const amount = value !== '' ? parseInt(value, 10) : 0;
        setAmountToDonate(amount);
      };
      
      const handlePaymentSuccess = async (response) => {
        try {
          await axios.post(`${process.env.REACT_APP_DJANGO_APP_API_URL}/verifySignature/`, response, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
	    withCredentials: true
          })
            .then((res) => {
              setFeedbackMessage("Donation made successfully!")
              setName("");
              setAmountToDonate(0);
            })
            .catch((err) => {
            });
        } catch (error) {
        }
      };
    
  async function handleSubmit() {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
    if (!res) {
        alert('Failure loading the Razorpay SDK. PLease make sure you are connected to the internet')
        return
    }
    var formData = new FormData();
    formData.append('campaignId', campaignId);
    formData.append('amount', amountToDonate);
    formData.append('name', name);
    formData.append('email', email);
 
    const orderData = await axios.post(`${process.env.REACT_APP_DJANGO_APP_API_URL}/makeDonation/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
    })
    var options = {
        key: `${process.env.REACT_APP_PUBLIC_KEY}`, 
        amount: orderData.data["amount"].toString(),
        currency: 'INR',
        name: "The Tale of Humankind",
        description: "Test Transaction",
        image: "",
        order_id: orderData.data["order_id"],
        handler: function (response) {
            handlePaymentSuccess(response);
        },
        theme: {
          color: "#61dafb",
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    }
  return (
    <div className="container d-lg-flex my-5" id="donationContainer">
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
          <h4 className="my-3">Some Denominations</h4>
          <div className="radiobtn">
            <input type="radio" name="box" id="one" value="2000" onChange={handleCustomValueChange} checked={!isCustomValueSelected && amountToDonate === 2000} onClick={() => setIsCustomValueSelected(false)}/>
            <input type="radio" name="box" id="two" value="5000" onChange={handleCustomValueChange}  checked={!isCustomValueSelected && amountToDonate === 5000} onClick={() => setIsCustomValueSelected(false)}/>
            <input type="radio" name="box" id="three" value="10000" onChange={handleCustomValueChange}  checked={!isCustomValueSelected && amountToDonate === 10000} onClick={() => setIsCustomValueSelected(false)}/>
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
      {feedbackMessage && (
                      <div className={feedbackMessage.includes("successfully") ? "alert alert-success" : "alert alert-danger"}>
                        {feedbackMessage}
                      </div>
        )}
        
        <div className="box-inner-2">
          <div>
            <p className="fw-bold">Payment Details</p>
            <p className="dis mb-3">
              Make a Change now!
            </p>
          </div>
          <form action="">
            <div className="mb-3">
              <p className="dis fw-bold mb-2">Name</p>
              <input
                    className="form-control"
                    id="title"
                    type="text"
                    onChange={(event) => {
                        setName(event.target.value);
                        }}
                    />
            </div>
            <div className="mb-3">
              <p className="dis fw-bold mb-2">Email address</p>
              <input
                    className="form-control"
                    id="title"
                    type="email"
                    onChange={(event) => {
                        setEmail(event.target.value);
                        }}
                    />
            </div>
            <div>
              <div className="address">
             
              <div className=" my-3">
                                <p className="dis fw-bold mb-2">Campaign Selected</p>
                                <div className="inputWithcheck">
                                    <input className="form-control" type="text" value={campaignName} readOnly/> 
                                    <span className="fas fa-check"></span>

                                </div>
                            </div>
                <div className=" my-3">
                  <p className="dis fw-bold mb-2">Custom Value</p>
                  <div>
                    <input
                      className="form-control"
                      type="number"
                      min="0" 
                      step="100" 
                      onChange={handleCustomValueChange}
                      onFocus={() => setIsCustomValueSelected(true)}
                    />
                  </div>
                </div>
                <div className="d-flex flex-column dis" onClick={handleSubmit}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
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
