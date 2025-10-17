import React, { useRef, useState } from 'react';
import '../assets/styles/Contact.scss';
// import emailjs from '@emailjs/browser';
import SendIcon from '@mui/icons-material/Send';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

function Contact({ parentToChild }: { parentToChild?: { mode: string } }) {
  const mode = parentToChild?.mode || 'dark';

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [nameError, setNameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<boolean>(false);
  
  const form = useRef<HTMLFormElement>(null);
  
  // Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
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

  const suggestedQuestions = [
    "What are Yaniv's main skills?",
    "Tell me about his education",
    "What experience does he have?",
    "What projects has he worked on?",
    "How can I contact Yaniv?"
  ];

  const contactOptions = [
    {
      id: 'email',
      icon: <EmailIcon />,
      title: 'Email',
      subtitle: 'Drop me a line',
      value: 'yanivvds@gmail.com',
      link: 'mailto:yanivvds@gmail.com',
      color: '#FF6B6B'
    },
    {
      id: 'linkedin',
      icon: <LinkedInIcon />,
      title: 'LinkedIn',
      subtitle: 'Let\'s connect',
      value: '/in/yanivvds',
      link: 'https://www.linkedin.com/in/yanivvds/',
      color: '#0077B5'
    },
    {
      id: 'github',
      icon: <GitHubIcon />,
      title: 'GitHub',
      subtitle: 'Check out my code',
      value: '/yanivvds',
      link: 'https://github.com/yanivvds',
      color: '#333'
    }
  ];

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    setNameError(name === '');
    setEmailError(email === '');
    setMessageError(message === '');

    /* Uncomment below if you want to enable the emailJS */
    // if (name !== '' && email !== '' && message !== '') {
    //   var templateParams = {
    //     name: name,
    //     email: email,
    //     message: message
    //   };

    //   console.log(templateParams);
    //   emailjs.send('service_id', 'template_id', templateParams, 'api_key').then(
    //     (response) => {
    //       console.log('SUCCESS!', response.status, response.text);
    //     },
    //     (error) => {
    //       console.log('FAILED...', error);
    //     },
    //   );
    //   setName('');
    //   setEmail('');
    //   setMessage('');
    // }
  };

  // Simple chatbot responses
  const getChatbotResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('experience') || message.includes('work')) {
      return "Yaniv is a Junior AI Developer at Kalff, where he builds AI-powered coaching platforms. He previously worked as a Marketing Manager at Shuffll and has experience in business development. He's currently studying Artificial Intelligence at the University of Amsterdam.";
    }
    
    if (message.includes('education') || message.includes('study') || message.includes('university')) {
      return "Yaniv is pursuing a Bachelor's degree in Artificial Intelligence at the University of Amsterdam (graduating 2026). He also has a Minor in Managing Digital Innovation from Vrije Universiteit Amsterdam.";
    }
    
    if (message.includes('skills') || message.includes('technologies')) {
      return "Yaniv specializes in AI/ML technologies including Python, PyTorch, and OpenAI API integration. He also works with full-stack development using Next.js, TypeScript, React Native, and cloud platforms like Azure.";
    }
    
    if (message.includes('projects') || message.includes('work')) {
      return "Yaniv is currently developing an AI-powered coaching platform at Kalff that uses NLP for call center agent performance insights. He has experience with real-time audio processing and full-stack web applications.";
    }
    
    if (message.includes('contact') || message.includes('reach')) {
      return "You can reach Yaniv through email at yanivvds@gmail.com, connect on LinkedIn, or check out his GitHub profile. Feel free to send him a message!";
    }
    
    return "I'd be happy to tell you more about Yaniv's background, skills, or projects. You can ask about his experience, education, technologies he works with, or how to get in touch!";
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: chatInput,
      role: 'user',
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);
    setShowSuggestions(false); // Hide suggestions after first interaction

    // Simulate AI response
    setTimeout(() => {
      const response = getChatbotResponse(chatInput);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (question: string) => {
    // Simulate user clicking on suggestion
    const userMessage = {
      id: Date.now().toString(),
      content: question,
      role: 'user',
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setShowSuggestions(false);

    // Simulate AI response
    setTimeout(() => {
      const response = getChatbotResponse(question);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      <div id="contact">
        <div className="items-container">
          <div className="contact_wrapper">
            <h1>Let's Connect</h1>
            <p>Ready to collaborate on something amazing? Reach out through any of these channels!</p>
            
            <div className="contact-cards-container">
              {contactOptions.map((option) => (
                <div
                  key={option.id}
                  className={`contact-card ${hoveredCard === option.id ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredCard(option.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => window.open(option.link, '_blank')}
                  style={{
                    '--card-color': option.color
                  } as React.CSSProperties & { [key: string]: string }}
                >
                  <div className="contact-card-icon">
                    {option.icon}
                  </div>
                  <div className="contact-card-content">
                    <h3>{option.title}</h3>
                    <p className="contact-card-subtitle">{option.subtitle}</p>
                    <p className="contact-card-value">{option.value}</p>
                  </div>
                  <div className="contact-card-arrow">
                    <SendIcon />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="contact-cta">
              <p>Or feel free to connect with me on social media for updates on my latest projects!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Button */}
      <button 
        className={`chatbot-toggle ${isChatOpen ? 'active' : ''}`}
        onClick={() => setIsChatOpen(!isChatOpen)}
        aria-label="Open chat assistant"
      >
        {isChatOpen ? <CloseIcon /> : <ChatIcon />}
      </button>

      {/* Chatbot Modal */}
      {isChatOpen && (
        <div className="chatbot-modal-overlay" onClick={() => setIsChatOpen(false)}>
          <div className={`chatbot-modal ${mode}`} onClick={(e) => e.stopPropagation()}>
            <div className="chatbot-header">
              <h3>AI Assistant</h3>
              <button 
                className="chatbot-close"
                onClick={() => setIsChatOpen(false)}
                aria-label="Close chat"
              >
                <CloseIcon />
              </button>
            </div>
            
            <div className="chatbot-messages">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`chatbot-message ${msg.role}`}>
                  <div className="chatbot-message-content">
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="chatbot-message assistant typing">
                  <div className="chatbot-message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {showSuggestions && (
              <div className="chatbot-suggestions">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="chatbot-suggestion-chip"
                    onClick={() => handleSuggestionClick(question)}
                    disabled={isTyping}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
            
            <form className="chatbot-input-form" onSubmit={handleChatSubmit}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me about Yaniv's background..."
                disabled={isTyping}
              />
              <button 
                type="submit" 
                disabled={!chatInput.trim() || isTyping}
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Contact;