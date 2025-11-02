import React, {useState, useEffect} from "react";
import {
  Main,
  Timeline,
  Expertise,
  Project,
  Contact,
  Navigation,
  Footer,
  Lanyard,
} from "./index";
import FadeIn from './FadeIn';
import '../index.scss';

function TestPage() {
    const [mode, setMode] = useState<string>('dark');

    const handleModeChange = () => {
        if (mode === 'dark') {
            setMode('light');
        } else {
            setMode('dark');
        }
    }

    useEffect(() => {
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
      }, []);

    return (
    <div className={`main-container ${mode === 'dark' ? 'dark-mode' : 'light-mode'}`}>
        <Navigation parentToChild={{mode}} modeChange={handleModeChange}/>
        <FadeIn transitionDuration={700}>
            <Lanyard />
            <Expertise/>
            <Timeline/>
            <Project parentToChild={{mode}}/>
            <Contact parentToChild={{mode}}/>
        </FadeIn>
        <Footer />
    </div>
    );
}

export default TestPage;