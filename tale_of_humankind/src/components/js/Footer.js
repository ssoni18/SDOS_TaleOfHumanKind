import React from "react";
import { SocialIcon } from 'react-social-icons/component'
import 'react-social-icons/linkedin'
import 'react-social-icons/facebook'
import 'react-social-icons/twitter'
import 'react-social-icons/instagram'
// renders: vimeo icon
<SocialIcon url="www.vimeo.com" />
export default function Footer() {
  return (
    <div fluid className="px-0">
      <footer className="text-white text-center text-lg-start bg-dark">
        <div className="container p-4">
          <div className="row mt-4">
            <div className="col-lg-4 col-md-12 mb-4 mb-md-0">
              <h5 className="text-uppercase mb-4">About Tale of Human Kind</h5>

              <p>
              Tale of Humankind Foundation is a registered non-profit under Section-8 of the Companies Act, 2013, governed by the Ministry of Corporate Affairs, Government of India.
              </p>

              <div className="mt-4">
              <SocialIcon url="https://www.linkedin.com/company/taleofhumankind/" />
              <SocialIcon url="https://www.facebook.com/taleofhumankind/" />
              <SocialIcon url="https://twitter.com/taleofhumankind/" />
              <SocialIcon url="https://www.instagram.com/taleofhumankind/" />
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
              <h5
                className="text-uppercase mb-4 pb-1"
                style={{ marginLeft: "10px" }}
              >
                Address
              </h5>
              <ul className="fa-ul">
                <li className="mb-3">
                  <span className="fa-li">
                    <i className="fas fa-home"></i>
                  </span>
                  <span className="ms-2">IIIT Delhi</span>
                </li>
                <li className="mb-3">
                  <span className="fa-li">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <span className="ms-2">ycbootcamp@taleofhumankind.org</span>
                </li>
                {/* <li className="mb-3">
                  <span className="fa-li">
                    <i className="fas fa-phone"></i>
                  </span>
                  <span className="ms-2">+48 234 567 88</span>
                </li> */}
              </ul>
            </div>
            {/* <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
              <h5 className="text-uppercase mb-4">Opening hours</h5>

              <table className="table text-center text-white">
                <tbody className="fw-normal">
                  <tr>
                    <td>Mon - Thu:</td>
                    <td>8am - 9pm</td>
                  </tr>
                  <tr>
                    <td>Fri - Sat:</td>
                    <td>8am - 1am</td>
                  </tr>
                  <tr>
                    <td>Sunday:</td>
                    <td>9am - 10pm</td>
                  </tr>
                </tbody>
              </table>
            </div> */}
          </div>
        </div>
        <div
          className="text-center p-3"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          © 2023 Copyright:

            Tale of HumanKind
        </div>
      </footer>
    </div>
  );
}
