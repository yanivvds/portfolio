import React, {useState, useEffect} from "react";
import {
  Main,
  Timeline,
  Expertise,
  Project,
  Contact,
  Navigation,
  Footer,
} from "./components";
import FadeIn from './components/FadeIn';
import './index.scss';
import Threads from './components/Threads';

function App() {
    const [mode, setMode] = useState<string>('dark');

    const handleModeChange = () => {
        if (mode === 'dark') {
            setMode('light');
        } else {
            setMode('dark');
        }
    }

    // Chatbot state
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<any[]>([
        {
            id: '1',
            content: "Hi! I'm Yaniv's AI assistant. I can tell you about his background, projects, or answer questions about his work. What would you like to know?",
            role: 'assistant',
            timestamp: new Date()
        }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [currentProjectContext, setCurrentProjectContext] = useState<string | null>(null);

    const suggestedQuestions = [
        "What are Yaniv's main skills?",
        "Tell me about his education",
        "What kind of roles or companies is Yaniv interested in?",
        "What are some of Yaniv's favorite side projects?",
        "What's Yaniv's most unexpected hobby?",
        "If Yaniv could build any AI-powered product, what would it be?",
        "How can I contact Yaniv?"
    ];

    // OpenAI API integration
    const getChatbotResponse = async (userMessage: string) => {
        try {
            const response = await fetch('https://api.openai.com/v1/threads/runs', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                    'OpenAI-Beta': 'assistants=v2'
                },
                body: JSON.stringify({
                    assistant_id: process.env.REACT_APP_OPENAI_ASSISTANT_ID,
                    thread: {
                        messages: [{
                            role: 'user',
                            content: currentProjectContext
                                ? `About the ${currentProjectContext} project: ${userMessage}`
                                : userMessage
                        }]
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from OpenAI');
            }

            const data = await response.json();
            const runId = data.id;
            const threadId = data.thread_id;

            // Poll for completion
            let runStatus = 'queued';
            let attempts = 0;
            const maxAttempts = 30; // 30 seconds max

            while (runStatus !== 'completed' && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                attempts++;

                const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                        'OpenAI-Beta': 'assistants=v2'
                    }
                });

                const statusData = await statusResponse.json();
                runStatus = statusData.status;

                if (runStatus === 'failed') {
                    throw new Error('OpenAI assistant failed to respond');
                }
            }

            if (runStatus !== 'completed') {
                throw new Error('Response timeout');
            }

            // Get the response
            const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    'OpenAI-Beta': 'assistants=v2'
                }
            });

            const messagesData = await messagesResponse.json();
            const assistantMessage = messagesData.data[0].content[0].text.value;

            // Try to parse as JSON, fallback to plain text
            try {
                const parsedResponse = JSON.parse(assistantMessage);
                return parsedResponse;
            } catch {
                // Fallback for non-JSON responses
                return {
                    response: assistantMessage,
                    followUpQuestions: [],
                    interactiveElement: { type: 'text', content: '' }
                };
            }

        } catch (error) {
            console.error('OpenAI API error:', error);
            return {
                response: "Sorry, I'm having trouble connecting right now. Please try again later.",
                followUpQuestions: [],
                interactiveElement: { type: 'text', content: '' }
            };
        }
    };

    // Generate detailed project introduction message
    const getProjectIntroductionMessage = (projectName: string) => {
        if (projectName === 'general') {
            return `Hi! I'm Yaniv's AI assistant. I can tell you about his background, projects, or answer questions about his work. What would you like to know?`;
        }
        // Only mention confidentiality for specific projects
        const confidentialProjects = [
            'Kalff Fundraising Dashboard',
            'VibeGroup Recruitment Algorithm',
            'KPN Easy Mode'
        ];

        const base = `Hi! I'm Yaniv's AI assistant. I can tell you about the ${projectName} project.`;

        const confidentiality = confidentialProjects.includes(projectName)
            ? " Some details are confidential, but I can share technical highlights."
            : '';

        return `${base}${confidentiality} Here are some questions you can ask:\n\n• What tech stack was used?\n• What problem does this solve?\n• What was Yaniv's favorite part?\n• What challenges were overcome?`;
    };

    const openChatWithMessage = async (message: string, projectName?: string) => {
        setIsChatOpen(true);

        // Set project context if provided
        if (projectName) {
            setCurrentProjectContext(projectName);
        }

        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            content: message,
            role: 'user',
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, userMessage]);
        setIsTyping(true);
        setShowSuggestions(false);

                // Show default introduction message instead of calling OpenAI immediately
        setTimeout(() => {
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                content: getProjectIntroductionMessage(projectName || 'general'),
                role: 'assistant',
                timestamp: new Date(),
                followUpQuestions: [
                    "What tech stack was used?",
                    "What problem does this solve?",
                    "What was Yaniv's favorite part?",
                    "What challenges were overcome?"
                ],
                interactiveElement: { type: 'text', content: '' }
            };

            setChatMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1000);
    };        useEffect(() => {
                window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
            }, []);
    const handleSendMessage = async (message: string) => {
        if (message.trim()) {
            // Add user message
            const userMessage = {
                id: Date.now().toString(),
                content: message.trim(),
                role: 'user',
                timestamp: new Date()
            };

            setChatMessages(prev => [...prev, userMessage]);
            setChatInput('');
            setIsTyping(true);
            setShowSuggestions(false);

            // Get AI response using OpenAI API
            const aiResponse = await getChatbotResponse(message.trim());

            // Handle different response formats
            let responseContent = '';
            let followUpQuestions: string[] = [];
            let interactiveElement = null;

            if (typeof aiResponse === 'object' && aiResponse.response) {
                responseContent = aiResponse.response;
                followUpQuestions = aiResponse.followUpQuestions || [];
                interactiveElement = aiResponse.interactiveElement;
            } else {
                responseContent = aiResponse;
            }

            const aiMessage = {
                id: (Date.now() + 1).toString(),
                content: responseContent,
                role: 'assistant',
                timestamp: new Date(),
                followUpQuestions,
                interactiveElement
            };

            setChatMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }
    };

    return (
    <div className={`main-container ${mode === 'dark' ? 'dark-mode' : 'light-mode'}`}>
        <Navigation parentToChild={{mode}} modeChange={handleModeChange}/>
        <FadeIn transitionDuration={700}>
            <Main/>
            <Expertise/>
            <Timeline/>
            <Project parentToChild={{mode}} openChatWithMessage={openChatWithMessage}/>
            <Contact 
                parentToChild={{mode}} 
                chatProps={{
                    isChatOpen,
                    setIsChatOpen,
                    chatMessages,
                    setChatMessages,
                    chatInput,
                    setChatInput,
                    isTyping,
                    setIsTyping,
                    showSuggestions,
                    setShowSuggestions,
                    suggestedQuestions,
                    getChatbotResponse,
                    handleSuggestionClick: async (question: string) => {
                        // Add user message
                        const userMessage = {
                            id: Date.now().toString(),
                            content: question,
                            role: 'user',
                            timestamp: new Date()
                        };

                        setChatMessages(prev => [...prev, userMessage]);
                        setIsTyping(true);
                        setShowSuggestions(false);

                        // Get AI response using OpenAI API
                        const aiResponse = await getChatbotResponse(question);

                        // Handle different response formats
                        let responseContent = '';
                        let followUpQuestions: string[] = [];
                        let interactiveElement = null;

                        if (typeof aiResponse === 'object' && aiResponse.response) {
                            responseContent = aiResponse.response;
                            followUpQuestions = aiResponse.followUpQuestions || [];
                            interactiveElement = aiResponse.interactiveElement;
                        } else {
                            responseContent = aiResponse;
                        }

                        const aiMessage = {
                            id: (Date.now() + 1).toString(),
                            content: responseContent,
                            role: 'assistant',
                            timestamp: new Date(),
                            followUpQuestions,
                            interactiveElement
                        };

                        setChatMessages(prev => [...prev, aiMessage]);
                        setIsTyping(false);
                    },
                    handleSendMessage
                }}
            />
        </FadeIn>
        <Footer />
    </div>
    );
}

export default App;