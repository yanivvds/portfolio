import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import profileImage from '../assets/images/profile.jpeg';
import '../assets/styles/Main.scss';

function Main() {

  return (
    <div className="container">
      <div className="about-section">
        <div className="image-wrapper">
          <img src={profileImage} alt="Avatar" />
        </div>
        <div className="content">
          <div className="social_icons">
            <a href="https://github.com/yanivvds" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="https://www.linkedin.com/in/yanivvds/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
          </div>
          <h1>Yaniv van der Stigchel</h1>
          <p>AI Engineer | Student AI @ UvA</p>
          
          <div className="location-indicator">
            <LocationOnIcon className="location-icon" />
            <span>Amsterdam, NL</span>
          </div>

          <div className="mobile_social_icons">
            <a href="https://github.com/yanivvds" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="https://www.linkedin.com/in/yanivvds/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;