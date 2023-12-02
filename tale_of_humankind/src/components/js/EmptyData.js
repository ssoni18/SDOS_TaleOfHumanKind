// EmptyData.js
import React from "react";
import PropTypes from "prop-types";
import '../css/EmptyData.css';

const EmptyData = ({ title, description }) => {
  return (
    <div className="empty-page-container">
      <h2>{title}</h2>
      <p>{description}</p>
      {/* You can add more content or customization as needed */}
    </div>
  );
}

EmptyData.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default EmptyData;
