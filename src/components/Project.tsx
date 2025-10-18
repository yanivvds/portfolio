import React, { useState } from "react";
import FlightIcon from '@mui/icons-material/Flight';
import HotelIcon from '@mui/icons-material/Hotel';
import GitHubIcon from '@mui/icons-material/GitHub';
import mock01 from '../assets/images/mock01.png';
import mock02 from '../assets/images/mock02.png';
import mock03 from '../assets/images/mock03.png';
import mock04 from '../assets/images/mock04.png';
import mock05 from '../assets/images/mock05.png';
import mock06 from '../assets/images/mock06.png';
import mock07 from '../assets/images/mock07.png';
import mock08 from '../assets/images/mock08.png';
import mock09 from '../assets/images/mock09.png';
import mock10 from '../assets/images/mock10.png';
import KPNEasyMode from '../assets/images/KPNEasyMode.png';
import FastAPI from '../assets/images/FastAPI.png';
import TravelInsiderTips from '../assets/images/TravelInsiderTips.png';
import '../assets/styles/Project.scss';

function Project({ parentToChild }: { parentToChild?: { mode: string } }) {
    const [showTravelModal, setShowTravelModal] = useState(false);
    
    // Get current theme from props
    const mode = parentToChild?.mode || 'dark';
    const isDarkMode = mode === 'dark';

    return(
    <div className="projects-container" id="projects">
        <h1>Personal Projects</h1>
        <div className="projects-grid">
            <div className="project">
                <img src={mock01} className="zoom" alt="thumbnail" width="100%"/>
                <h2>Kalff Fundraising Dashboard</h2>
                <p>A comprehensive web platform empowering fundraising teams with real-time performance analytics, agent management, and AI-powered call analysis.</p>
            </div>
            <div className="project">
                <a href="https://www.filmate.club/" target="_blank" rel="noreferrer"><img src={KPNEasyMode} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://www.filmate.club/" target="_blank" rel="noreferrer"><h2>KPN Easy Mode</h2></a>
                <p>Developed an AI-powered iOS app in collaboration with KPN and KPMG to help seniors with daily tasks, featuring a lip-syncing avatar, real-time voice interaction, and an accessibility-first design.</p>
            </div>
            <div className="project">
                <a href="https://yujisatojr.itch.io/highspeedchase" target="_blank" rel="noreferrer"><img src={mock09} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://yujisatojr.itch.io/highspeedchase" target="_blank" rel="noreferrer"><h2>High Speed Chase</h2></a>
                <p>Designed, developed, and launched a 3D multiplayer racing game with C# and Unity. This is available on Itch.io for gamers worldwide to enjoy.</p>
            </div>
            <div className="project">
                <a href="https://yujisatojr.itch.io/spacecraft" target="_blank" rel="noreferrer"><img src={mock08} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://yujisatojr.itch.io/spacecraft" target="_blank" rel="noreferrer"><h2>Astro Raiders</h2></a>
                <p>Developed and released a 2D shooting game with C# and Unity. This project is hosted on the Itch.io public marketplace.</p>
            </div>
            <div className="project">
                <a href="https://www.datumlearn.com/" target="_blank" rel="noreferrer"><img src={mock07} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://www.datumlearn.com/" target="_blank" rel="noreferrer"><h2>Datum: Integrated Learning Platform</h2></a>
                <p>This is an online educational platform that provides high-quality, data science-focused learning resources in the Japanese language. I created the entire platform from scratch using Ruby on Rails.</p>
            </div>
            <div className="project">
                <a href="http://www.wemanage.jp/" target="_blank" rel="noreferrer"><img src={mock06} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="http://www.wemanage.jp/" target="_blank" rel="noreferrer"><h2>WeManage: Real Estate Asset Management</h2></a>
                <p>This mobile application allows realtors in Japan to securely manage their property information and view future income predictions. This app is built with Ruby on Rails and JavaScript.</p>
            </div>
            <div className="project">
                <div onClick={() => setShowTravelModal(true)} style={{cursor: 'pointer'}}>
                    <img src={TravelInsiderTips} className="zoom" alt="thumbnail" width="100%"/>
                    <h2>Travel Insider Tips</h2>
                    <p>University project for UvA integrating flight APIs, web scraping, and hotel APIs to create a comprehensive travel agency website.</p>
                    <span className="project-note">Early university project • 2023</span>
                </div>
            </div>
            <div className="project">
                <a href="https://github.com/yanivvds/TaskManagementAPI" target="_blank" rel="noreferrer"><img src={FastAPI} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/yanivvds/TaskManagementAPI" target="_blank" rel="noreferrer"><h2>Task Management API</h2></a>
                <p>A robust REST API built with FastAPI, featuring user authentication, CRUD operations, and SQLite integration for efficient task tracking and management.</p>
                <span className="project-note">Early project • 2024</span>
            </div>
        </div>

        {/* Travel Modal */}
        {showTravelModal && (
            <div className="travel-modal-overlay" onClick={() => setShowTravelModal(false)}>
                <div className={`travel-modal ${isDarkMode ? 'dark' : 'light'}`} onClick={(e) => e.stopPropagation()}>
                    <div className="travel-modal-header">
                        <h3>Travel Insider Tips</h3>
                        <button 
                            className="travel-modal-close"
                            onClick={() => setShowTravelModal(false)}
                            aria-label="Close modal"
                        >
                            ×
                        </button>
                    </div>
                    <div className="travel-modal-content">
                        <div className="travel-modal-item" onClick={() => window.open('https://photos.app.goo.gl/acco3pVxYgpwesn69', '_blank')}>
                            <h4><FlightIcon className="modal-item-icon" /> Flight Planning Demo</h4>
                            <p>Interactive demonstration of the flight booking system with real-time API integration and smart search algorithms</p>
                        </div>
                        <div className="travel-modal-item">
                            <h4><HotelIcon className="modal-item-icon" /> Hotel & Experiences Demo</h4>
                            <p>Showcase of hotel recommendations and curated experiences powered by web scraping and location-based services</p>
                        </div>
                        <div className="travel-modal-item" onClick={() => window.open('https://github.com/yanivvds/WebtechKI0', '_blank')}>
                            <h4><GitHubIcon className="modal-item-icon" /> Source Code Repository</h4>
                            <p>Complete project codebase featuring API integrations, web scraping, and modern web development practices</p>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
    );
}

export default Project;