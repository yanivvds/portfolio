import React from "react";
import '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReact, faDocker, faPython } from '@fortawesome/free-brands-svg-icons';
import Chip from '@mui/material/Chip';
import '../assets/styles/Expertise.scss';

const labelsFirst = [
    "Python",
    "PyTorch",
    "Machine Learning & AI",
    "OpenAI API Integration",
    "Content Matching Algorithms"
];

const labelsSecond = [
    "Next.js",
    "TypeScript",
    "JavaScript",
    "React Native Development",
    "iOS App Development",
    "Real-Time Audio Processing",
    "WebSocket Communication",
    "API Integration",
    "Database Architecture"
];

const labelsThird = [
    "Azure",
    "Azure Functions",
    "Microsoft SQL Server",
    "Supabase",
    "Vercel",
    "n8n",
    "Agile Development (Scrum)"
];

function Expertise() {
    return (
    <div className="container" id="expertise">
        <div className="skills-container">
            <h1>Expertise</h1>
            <div className="skills-grid">
                <div className="skill">
                    <FontAwesomeIcon icon={faPython} size="3x"/>
                    <h3>AI & Machine Learning</h3>
                    <p>As an AI student at UvA, I specialize in developing intelligent solutions using cutting-edge AI technologies. I have hands-on experience with machine learning algorithms, neural networks, and integrating AI APIs into practical applications.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Tech stack:</span>
                        {labelsFirst.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <FontAwesomeIcon icon={faReact} size="3x"/>
                    <h3>Full-Stack Development</h3>
                    <p>I build end-to-end web and mobile applications with modern frameworks and real-time capabilities. My experience spans from responsive web apps to native mobile development, with expertise in API integration and database architecture.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Tech stack:</span>
                        {labelsSecond.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <FontAwesomeIcon icon={faDocker} size="3x"/>
                    <h3>Cloud & DevOps</h3>
                    <p>I leverage cloud platforms and modern development practices to build scalable, automated solutions. With Azure certification and experience in CI/CD pipelines, I ensure applications are production-ready and efficiently deployed.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Tech stack:</span>
                        {labelsThird.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Expertise;