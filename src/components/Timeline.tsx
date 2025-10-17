import React from "react";
import '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '../assets/styles/Timeline.scss'

function Timeline() {
  return (
    <div id="history">
      <div className="items-container">
        <h1>Career History</h1>
        <VerticalTimeline>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'white', color: 'rgb(39, 40, 34)' }}
            contentArrowStyle={{ borderRight: '7px solid  white' }}
            date="Jan 2025 - Present"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">Junior AI Developer</h3>
            <h4 className="vertical-timeline-element-subtitle">Kalff, Amsterdam Area</h4>
            <p>
              Building an AI-powered coaching platform for real-time performance insights and personalized training for call center agents. Developed full-stack platform with Next.js, Node.js, and MS SQL Server, implemented NLP pipelines, and created analytics dashboards.
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Sep 2025 - Jan 2026"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">Minor in Managing Digital Innovation</h3>
            <h4 className="vertical-timeline-element-subtitle">Vrije Universiteit Amsterdam (VU Amsterdam)</h4>
            <p>
              Studying digital innovation management and its applications in business and technology.
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Aug 2023 - Jul 2026"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">Bachelor's in Artificial Intelligence</h3>
            <h4 className="vertical-timeline-element-subtitle">University of Amsterdam</h4>
            <p>
              Studying Artificial Intelligence with focus on machine learning algorithms, web development, and AI applications.
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Jan 2023 - Aug 2023"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">Marketing Manager</h3>
            <h4 className="vertical-timeline-element-subtitle">Shuffll</h4>
            <p>
              Managed marketing strategies, developed website and blog with SEO optimization, resulting in increased traffic and featured snippets on Google.
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="Oct 2022 - Jan 2023"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">Business Development Intern</h3>
            <h4 className="vertical-timeline-element-subtitle">Shuffll</h4>
            <p>
              Researched and approached potential investors and clients, contributed to product strategy and AI-driven video formats.
            </p>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </div>
    </div>
  );
}

export default Timeline;