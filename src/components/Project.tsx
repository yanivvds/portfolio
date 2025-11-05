import React, { useState } from "react";
import FlightIcon from '@mui/icons-material/Flight';
import HotelIcon from '@mui/icons-material/Hotel';
import GitHubIcon from '@mui/icons-material/GitHub';
import DescriptionIcon from '@mui/icons-material/Description';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ChatIcon from '@mui/icons-material/Chat';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VideocamIcon from '@mui/icons-material/Videocam';
import LinkIcon from '@mui/icons-material/Link';
import mock01 from '../assets/images/mock01.png';
import kalff from '../assets/images/kalff.png';
import mock02 from '../assets/images/mock02.png';
import mock03 from '../assets/images/mock03.png';
import mock04 from '../assets/images/mock04.png';
import mock05 from '../assets/images/mock05.png';
import mock06 from '../assets/images/mock06.png';
import mock07 from '../assets/images/mock07.png';
import mock08 from '../assets/images/mock08.png';
import mock09 from '../assets/images/mock09.png';
import mock10 from '../assets/images/mock10.png';
import vibegroup from '../assets/images/vibegroup.png';
import KPNEasyMode from '../assets/images/KPNEasyMode.png';
import FastAPI from '../assets/images/FastAPI.png';
import TravelInsiderTips from '../assets/images/TravelInsiderTips.png';
import '../assets/styles/Project.scss';

// YouTube video URLs instead of local files
const KPNeasyModeVideo = 'https://youtube.com/shorts/CIz3zKpBEF8';
const KPNkatVideo = 'https://youtube.com/shorts/GlrC3Jvr170';

function Project({ parentToChild, openChatWithMessage }: { parentToChild?: { mode: string }, openChatWithMessage?: (message: string, projectName?: string, isFollowUp?: boolean) => void }) {
    const [showTravelModal, setShowTravelModal] = useState(false);
    const [showKPNModal, setShowKPNModal] = useState(false);
    const [showTagJeTafelModal, setShowTagJeTafelModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [currentVideo, setCurrentVideo] = useState<string>('');
    
    // Get current theme from props
    const mode = parentToChild?.mode || 'dark';
    const isDarkMode = mode === 'dark';

    // Generate simple initial message for AI chat
    const getAIInitialMessage = (projectName: string) => {
        return `Tell me more about the ${projectName} project`;
    };

    // Handle video modal opening
    const openVideoModal = (videoUrl: string) => {
        // Convert YouTube shorts URL to embeddable format
        const embedUrl = videoUrl.replace('youtube.com/shorts/', 'youtube.com/embed/');
        setCurrentVideo(embedUrl);
        setShowVideoModal(true);
    };

    return(
    <div className="projects-container" id="projects">
        <h1>Personal Projects</h1>
        <div className="projects-grid">
            <div className="project">
                <img src={kalff} className="zoom project-thumbnail" alt="Kalff Fundraising Dashboard" width="100%"/>
                <div className="project-header">
                    <h2>Kalff Fundraising Dashboard</h2>
                    <button 
                        className="ai-chat-btn"
                        onClick={() => openChatWithMessage && openChatWithMessage(getAIInitialMessage("Kalff Fundraising Dashboard"), "Kalff Fundraising Dashboard")}
                        title="Ask AI about this project"
                    >
                        <AutoAwesomeIcon className="ai-icon" />
                        Ask AI
                    </button>
                </div>
                <p>A comprehensive web platform and API empowering fundraising teams with real-time performance analytics, agent management, and AI-powered call analysis.</p>
            </div>
            <div className="project">
                <div onClick={() => setShowKPNModal(true)} style={{cursor: 'pointer'}}>
                    <img src={KPNEasyMode} className="zoom" alt="thumbnail" width="100%"/>
                    <div className="project-header">
                        <h2>KPN Easy Mode</h2>
                        <button 
                            className="ai-chat-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                openChatWithMessage && openChatWithMessage(getAIInitialMessage("KPN Easy Mode"), "KPN Easy Mode");
                            }}
                            title="Ask AI about this project"
                        >
                            <AutoAwesomeIcon className="ai-icon" />
                            Ask AI
                        </button>
                    </div>
                    <p>Developed an AI-powered iOS app in collaboration with KPN and KPMG to help seniors with daily tasks, featuring a lip-syncing avatar, real-time voice interaction, and an accessibility-first design.</p>
                </div>
            </div>
            <div className="project">
                <div onClick={() => openChatWithMessage && openChatWithMessage("Due to an NDA, I can share limited resources on this project, but you can ask questions about it!")} style={{cursor: 'pointer'}}>
                    <img src={vibegroup} className="zoom" alt="thumbnail" width="100%"/>
                    <div className="project-header">
                        <h2>VibeGroup Recruitement Algorithm</h2>
                        <button 
                            className="ai-chat-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                openChatWithMessage && openChatWithMessage(getAIInitialMessage("VibeGroup Recruitment Algorithm"), "VibeGroup Recruitment Algorithm");
                            }}
                            title="Ask AI about this project"
                        >
                            <AutoAwesomeIcon className="ai-icon" />
                            Ask AI
                        </button>
                    </div>
                </div>
                <p>Developed and deployed VibeGroup, an intelligent recruitment platform built with Next.js, TypeScript, and Python/ML. This system utilizes a proprietary predictive algorithm for smart candidate matching and optimized hiring outcomes.</p>
            </div>
            <div className="project">
                <div onClick={() => setShowTagJeTafelModal(true)} style={{cursor: 'pointer'}}>
                    <img src={mock08} className="zoom" alt="thumbnail" width="100%"/>
                    <div className="project-header">
                        <h2>TagJeTafel</h2>
                        <button 
                            className="ai-chat-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                openChatWithMessage && openChatWithMessage(getAIInitialMessage("TagJeTafel"), "TagJeTafel");
                            }}
                            title="Ask AI about this project"
                        >
                            <AutoAwesomeIcon className="ai-icon" />
                            Ask AI
                        </button>
                    </div>
                </div>
                <p>TagJeTafel is a side project I built from scratch - a digital marketplace platform that connects restaurants with social media content creators. As someone passionate about food culture and creator economies, I developed this full-stack application to solve the real problem of authentic food marketing.</p>
            </div>
            <div className="project">
                <div onClick={() => setShowTravelModal(true)} style={{cursor: 'pointer'}}>
                    <img src={TravelInsiderTips} className="zoom" alt="thumbnail" width="100%"/>
                    <div className="project-header">
                        <h2>Travel Insider Tips</h2>
                        <button 
                            className="ai-chat-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                openChatWithMessage && openChatWithMessage(getAIInitialMessage("Travel Insider Tips"), "Travel Insider Tips");
                            }}
                            title="Ask AI about this project"
                        >
                            <AutoAwesomeIcon className="ai-icon" />
                            Ask AI
                        </button>
                    </div>
                    <p>University project for UvA integrating flight APIs, web scraping, and hotel APIs to create a comprehensive travel agency website.</p>
                    <span className="project-note">Early university project • 2023</span>
                </div>
            </div>
            <div className="project">
                <a href="https://github.com/yanivvds/TaskManagementAPI" target="_blank" rel="noreferrer"><img src={FastAPI} className="zoom" alt="thumbnail" width="100%"/></a>
                <div className="project-header">
                    <a href="https://github.com/yanivvds/TaskManagementAPI" target="_blank" rel="noreferrer"><h2>Task Management API</h2></a>
                    <button 
                        className="ai-chat-btn"
                        onClick={() => openChatWithMessage && openChatWithMessage(getAIInitialMessage("Task Management API"), "Task Management API")}
                        title="Ask AI about this project"
                    >
                        <AutoAwesomeIcon className="ai-icon" />
                        Ask AI
                    </button>
                </div>
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

        {/* KPN Modal */}
        {showKPNModal && (
            <div className="travel-modal-overlay" onClick={() => setShowKPNModal(false)}>
                <div className={`travel-modal ${isDarkMode ? 'dark' : 'light'}`} onClick={(e) => e.stopPropagation()}>
                    <div className="travel-modal-header">
                        <h3>KPN Easy Mode</h3>
                        <button 
                            className="travel-modal-close"
                            onClick={() => setShowKPNModal(false)}
                            aria-label="Close modal"
                        >
                            ×
                        </button>
                    </div>
                    <div className="travel-modal-content">
                        <div className="travel-modal-item" onClick={() => window.open('https://www.canva.com/design/DAG24cp-JyQ/HRpvKbTHV4EEaXHyGqH_Pg/view?utm_content=DAG24cp-JyQ&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h8a9b51c9f2', '_blank')}>
                            <h4><DescriptionIcon className="modal-item-icon" /> Pitch Deck</h4>
                            <p>View the comprehensive pitch deck for the KPN Easy Mode project</p>
                        </div>
                        <div className="travel-modal-item" onClick={() => openVideoModal(KPNeasyModeVideo)}>
                            <h4><VideocamIcon className="modal-item-icon" /> Easy Mode Preview</h4>
                            <p>Click to view the video</p>
                        </div>
                        <div className="travel-modal-item" onClick={() => openVideoModal(KPNkatVideo)}>
                            <h4><VideocamIcon className="modal-item-icon" /> KPN Kat Recording</h4>
                            <p>Click to view the video</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* TagJeTafel Modal */}
        {showTagJeTafelModal && (
            <div className="travel-modal-overlay" onClick={() => setShowTagJeTafelModal(false)}>
                <div className={`travel-modal ${isDarkMode ? 'dark' : 'light'}`} onClick={(e) => e.stopPropagation()}>
                    <div className="travel-modal-header">
                        <h3>TagJeTafel</h3>
                        <button 
                            className="travel-modal-close"
                            onClick={() => setShowTagJeTafelModal(false)}
                            aria-label="Close modal"
                        >
                            ×
                        </button>
                    </div>
                    <div className="travel-modal-content">
                        <div className="travel-modal-item" onClick={() => window.open('https://tagjetafel.nl', '_blank')}>
                            <h4><LinkIcon className="modal-item-icon" /> Main website</h4>
                            <p>Visit the live TagJeTafel platform</p>
                        </div>
                        <div className="travel-modal-item" onClick={() => window.open('http://tagjetafel.nl/demo/creator', '_blank')}>
                            <h4><VideocamIcon className="modal-item-icon" /> Influencer demo</h4>
                            <p>Experience the creator dashboard</p>
                        </div>
                        <div className="travel-modal-item" onClick={() => window.open('http://tagjetafel.nl/demo/business', '_blank')}>
                            <h4><VideocamIcon className="modal-item-icon" /> Business demo</h4>
                            <p>Explore the business interface</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Video Modal */}
        {showVideoModal && (
            <div className="video-modal-overlay" onClick={() => setShowVideoModal(false)}>
                <div className={`video-modal ${isDarkMode ? 'dark' : 'light'}`} onClick={(e) => e.stopPropagation()}>
                    <div className="video-modal-header">
                        <button
                            className="video-modal-close"
                            onClick={() => setShowVideoModal(false)}
                            aria-label="Close video modal"
                        >
                            ×
                        </button>
                    </div>
                    <div className="video-modal-content">
                        <iframe
                            className="video-player"
                            src={currentVideo}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        )}
    </div>
    );
}

export default Project;