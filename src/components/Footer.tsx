import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import '../assets/styles/Footer.scss'

function Footer() {
  return (
    <footer>
      <div>
        <a href="https://github.com/yanivvds" target="_blank" rel="noreferrer"><GitHubIcon/></a>
        <a href="https://www.linkedin.com/in/yanivvds/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
        <a href="mailto:yanivvds@gmail.com"><EmailIcon/></a>
      </div>
      <p>A portfolio designed & built by <a href="https://github.com/yanivvds" target="_blank" rel="noreferrer">Yaniv van der Stigchel</a></p>
    </footer>
  );
}

export default Footer;