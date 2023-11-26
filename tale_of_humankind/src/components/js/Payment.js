// import React from 'react';
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import Button from 'react-bootstrap/Button';
// import axios from 'axios';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';


// function Payment() {

//     const makePayment = async (event) => {
    
//             axios.post(`${process.env.REACT_APP_API_URL}/process_payment/`, {
//             })
//             .then(response => {
//                 console.log(response);
//             })
//             .catch(error => {
//                 console.error(error);
//             });
//         }

//     return (
//         <div className="container">
//             <h2>Payment Page</h2>
//             <form onSubmit={makePayment}>
//                 {/* <CardEclement /> */}
//                 <Button variant="primary" type="submit" >Make Payment</Button>
//             </form>
//         </div>
//     );
// };

// export default Payment;
