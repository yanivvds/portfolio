import React, { useRef, useState, useEffect } from 'react';
import '../assets/styles/Contact.scss';
// import emailjs from '@emailjs/browser';
import SendIcon from '@mui/icons-material/Send';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TechStackVisualization from './visualizations/TechStackVisualization';

function Contact({ parentToChild, chatProps }: { 
  parentToChild?: { mode: string }, 
  chatProps?: {
    isChatOpen: boolean;
    setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
    chatMessages: any[];
    setChatMessages: React.Dispatch<React.SetStateAction<any[]>>;
    chatInput: string;
    setChatInput: React.Dispatch<React.SetStateAction<string>>;
    isTyping: boolean;
    setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
    showSuggestions: boolean;
    setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
    suggestedQuestions: string[];
    getChatbotResponse: (message: string) => Promise<any>;
    handleSuggestionClick: (question: string) => void;
    handleSendMessage: (message: string) => void;
    currentLoadingMessage: string;
  }
}) {
  const mode = parentToChild?.mode || 'dark';
  const isDarkMode = mode === 'dark';

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Shared styles for consistent visualization appearance
  const visualizationStyles = {
    container: {
      margin: '12px 0',
      padding: '16px',
      background: isDarkMode ? 'rgba(17,24,39,0.6)' : '#fff',
      borderRadius: '12px',
      boxShadow: isDarkMode ? '0 8px 32px rgba(15,23,42,0.6)' : '0 8px 32px rgba(15,23,42,0.08)',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.06)'}`
    },
    title: {
      margin: '0 0 16px 0',
      color: isDarkMode ? '#e9d5ff' : '#7c3aed',
      fontSize: '16px',
      fontWeight: 600
    },
    cardBase: {
      padding: '12px 16px',
      borderRadius: '8px',
      background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      transition: 'all 0.2s ease'
    }
  };
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [nameError, setNameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<boolean>(false);
  
  const form = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hiddenVisualizations, setHiddenVisualizations] = useState<Record<string, boolean>>({});

  const toggleVisualization = (messageId: string) => {
    setHiddenVisualizations(prev => ({ ...prev, [messageId]: !prev[messageId] }));
  };
  
  // Chatbot state from props
  const {
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
    handleSuggestionClick,
    handleSendMessage,
    currentLoadingMessage
  } = chatProps || {
    isChatOpen: false,
    setIsChatOpen: () => {},
    chatMessages: [],
    setChatMessages: () => {},
    chatInput: '',
    setChatInput: () => {},
    isTyping: false,
    setIsTyping: () => {},
    showSuggestions: true,
    setShowSuggestions: () => {},
    suggestedQuestions: [],
    getChatbotResponse: () => Promise.resolve(''),
    handleSuggestionClick: () => {},
    handleSendMessage: () => {},
    currentLoadingMessage: ''
  };

  // Render message content with clickable suggestions and interactive elements
  const renderMessageContent = (message: any) => {
    const content = typeof message === 'string' ? message : message.content || '';
    const followUpQuestions = message.followUpQuestions || [];
    const interactiveElement = message.interactiveElement;
    const isStreaming = message.isStreaming;

    // Check if this is an initial introduction message with bullet points
    const hasBulletQuestions = content.includes("• What tech stack was used?") && content.includes("Here are some questions you can ask:");

    // Handle interactive elements
    const renderInteractiveElement = () => {
      if (!interactiveElement) return null;

      // If assistant intentionally specifies no interactive content, don't render a visualization
      if (interactiveElement.type === 'text') {
        const textContent = interactiveElement.content || '';
        if (!textContent || textContent === 'No interactive content required.') return null;

        // For 'text' interactiveElement we simply render the content as-is.
        return (
          <div style={{ margin: '12px 0', color: isDarkMode ? '#cbd5e1' : '#374151' }}>
            {interactiveElement.content}
          </div>
        );
      }

  // allow collapsing per-message visualizations
      const messageId = message.id || (message.timestamp ? String(message.timestamp) : undefined);
      const isHidden = messageId ? !!hiddenVisualizations[messageId] : false;

      const renderInner = () => {
  switch (interactiveElement.type) {
        case 'tech_stack':
          return (
            <TechStackVisualization
              technologies={interactiveElement.metadata?.technologies || []}
              title={interactiveElement.content}
              isDarkMode={isDarkMode}
            />
          );

        case 'timeline':
          return (
            <div style={visualizationStyles.container}>
              <h4 style={visualizationStyles.title}>{interactiveElement.content}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {interactiveElement.metadata?.events?.map((event: any, index: number) => (
                  <div key={index} style={{
                    ...visualizationStyles.cardBase,
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isDarkMode ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.1)',
                      borderRadius: '10px',
                      flexShrink: 0
                    }}>
                      {event.icon_url ? (
                        <img src={event.icon_url} alt="event icon" style={{ width: 24, height: 24, borderRadius: 6 }} />
                      ) : (
                        <div style={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          background: isDarkMode ? '#a78bfa' : '#7c3aed' 
                        }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        fontWeight: 600, 
                        color: isDarkMode ? '#f3e8ff' : '#111827',
                        marginBottom: '4px',
                        fontSize: '15px'
                      }}>
                        {event.phase}
                        {event.duration && (
                          <span style={{ 
                            fontWeight: 500, 
                            color: isDarkMode ? '#c7b3f8' : '#6b21a8',
                            marginLeft: '8px',
                            fontSize: '14px'
                          }}>
                            · {event.duration}
                          </span>
                        )}
                      </div>
                      <div style={{ 
                        color: isDarkMode ? '#cbd5e1' : '#374151',
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}>
                        {event.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        case 'code_snippet':
          return (
            <div style={{
              ...visualizationStyles.container,
              padding: 0,
              overflow: 'hidden'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '14px 16px',
                background: isDarkMode ? 'rgba(15,23,42,0.8)' : '#f8fafc',
                borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
              }}>
                <div style={{ 
                  fontWeight: 600, 
                  color: isDarkMode ? '#e9d5ff' : '#111827',
                  fontSize: '15px'
                }}>
                  {interactiveElement.content}
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {interactiveElement.metadata?.language && (
                    <div style={{ 
                      fontSize: 12, 
                      color: isDarkMode ? '#c7b3f8' : '#6b21a8', 
                      padding: '4px 10px', 
                      borderRadius: 6, 
                      background: isDarkMode ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.1)',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {interactiveElement.metadata.language}
                    </div>
                  )}
                  <button 
                    onClick={() => { 
                      try { 
                        navigator.clipboard.writeText(interactiveElement.metadata?.code || ''); 
                      } catch(e){} 
                    }} 
                    style={{ 
                      border: 'none', 
                      background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      color: isDarkMode ? '#cbd5e1' : '#374151', 
                      cursor: 'pointer',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 500,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
              <pre style={{ 
                margin: 0, 
                padding: 16, 
                background: isDarkMode ? 'rgba(8,16,34,0.8)' : '#fff', 
                color: isDarkMode ? '#dbeafe' : '#0f1724', 
                fontSize: 13, 
                overflow: 'auto',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                lineHeight: 1.5
              }}>
                <code>{interactiveElement.metadata?.code}</code>
              </pre>
              {interactiveElement.metadata?.explanation && (
                <div style={{ 
                  padding: '12px 16px', 
                  background: isDarkMode ? 'rgba(7,16,35,0.6)' : '#f9fafb', 
                  color: isDarkMode ? '#9fb4ff' : '#374151',
                  fontSize: '14px',
                  borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
                }}>
                  {interactiveElement.metadata.explanation}
                </div>
              )}
            </div>
          );

        case 'feature_highlight':
          return (
            <div style={{
              margin: '12px 0',
              padding: 12,
              borderRadius: 12,
              background: isDarkMode ? 'linear-gradient(180deg, rgba(15,23,42,0.6), rgba(12,18,32,0.6))' : '#fff',
              boxShadow: isDarkMode ? '0 10px 30px rgba(2,6,23,0.6)' : '0 6px 18px rgba(15,23,42,0.06)',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.02)' : '1px solid rgba(15,23,42,0.04)'
            }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {interactiveElement.metadata?.icon_url ? (
                  <img src={interactiveElement.metadata.icon_url} alt="feature icon" style={{ width: 44, height: 44, borderRadius: 8 }} />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: isDarkMode ? '#7c3aed' : '#ede9fe' }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: isDarkMode ? '#f3e8ff' : '#0f1724' }}>{interactiveElement.metadata?.title || interactiveElement.content}</div>
                  <div style={{ marginTop: 6, color: isDarkMode ? '#cbd5e1' : '#374151' }}>{interactiveElement.metadata?.challenge}</div>
                </div>
              </div>
              <div style={{ marginTop: 10, display: 'grid', gap: 6, color: isDarkMode ? '#cbd5e1' : '#374151' }}>
                <div><strong>Solution:</strong> {interactiveElement.metadata?.solution}</div>
                <div><strong>Impact:</strong> {interactiveElement.metadata?.impact}</div>
              </div>
            </div>
          );

        case 'architecture':
          return (
            <div style={{ margin: '12px 0' }}>
              <h4 style={{ margin: '0 0 8px 0', color: isDarkMode ? '#e9d5ff' : '#7c3aed' }}>{interactiveElement.content}</h4>
              {interactiveElement.metadata?.image_url && (
                <img src={interactiveElement.metadata.image_url} alt="architecture diagram" style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
              )}
              <div style={{ display: 'grid', gap: 8 }}>
                {interactiveElement.metadata?.components?.map((c: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {c.icon_url ? <img src={c.icon_url} alt="comp" style={{ width: 20, height: 20, borderRadius: 4 }} /> : <div style={{ width: 10, height: 10, borderRadius: 2, background: isDarkMode ? '#a78bfa' : '#7c3aed' }} />}
                    <div>
                      <div style={{ fontWeight: 700, color: isDarkMode ? '#f3e8ff' : '#0f1724' }}>{c.name}</div>
                      {c.role && <div style={{ fontSize: 13, color: isDarkMode ? '#cbd5e1' : '#374151' }}>{c.role}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        case 'metrics':
          return (
            <div style={{ margin: '12px 0' }}>
              <h4 style={{ margin: '0 0 8px 0', color: isDarkMode ? '#e9d5ff' : '#7c3aed' }}>{interactiveElement.content}</h4>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {interactiveElement.metadata?.metrics?.map((m: any, i: number) => (
                  <div key={i} style={{ padding: '8px 12px', borderRadius: 10, background: isDarkMode ? 'rgba(255,255,255,0.02)' : '#fff', boxShadow: isDarkMode ? '0 6px 18px rgba(2,6,23,0.6)' : '0 6px 18px rgba(15,23,42,0.04)' }}>
                    <div style={{ fontSize: 12, color: isDarkMode ? '#cbd5e1' : '#6b7280' }}>{m.label}</div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: isDarkMode ? '#f3e8ff' : '#111827' }}>{m.value} {m.unit || ''}</div>
                  </div>
                ))}
              </div>
            </div>
          );

        case 'demo':
          return (
            <div style={{ margin: '12px 0' }}>
              <h4 style={{ margin: '0 0 8px 0', color: isDarkMode ? '#e9d5ff' : '#7c3aed' }}>{interactiveElement.content}</h4>
              {interactiveElement.metadata?.video_url ? (
                <video controls style={{ width: '100%', borderRadius: 8 }} src={interactiveElement.metadata.video_url} />
              ) : interactiveElement.metadata?.gif_url ? (
                <img src={interactiveElement.metadata.gif_url} alt="demo" style={{ width: '100%', borderRadius: 8 }} />
              ) : null}
            </div>
          );

        case 'contributors':
          return (
            <div style={{ margin: '12px 0' }}>
              <h4 style={{ margin: '0 0 8px 0', color: isDarkMode ? '#e9d5ff' : '#7c3aed' }}>{interactiveElement.content}</h4>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {interactiveElement.metadata?.people?.map((p: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 10px', borderRadius: 10, background: isDarkMode ? 'rgba(255,255,255,0.02)' : '#fff' }}>
                    {p.avatar_url ? <img src={p.avatar_url} alt={p.name} style={{ width: 36, height: 36, borderRadius: 8 }} /> : <div style={{ width: 36, height: 36, borderRadius: 8, background: '#ddd' }} />}
                    <div>
                      <div style={{ fontWeight: 700 }}>{p.name}</div>
                      <div style={{ fontSize: 13, color: isDarkMode ? '#cbd5e1' : '#6b7280' }}>{p.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        case 'links':
          return (
            <div style={{ margin: '12px 0' }}>
              <h4 style={{ margin: '0 0 8px 0', color: isDarkMode ? '#e9d5ff' : '#7c3aed' }}>{interactiveElement.content}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {interactiveElement.metadata?.links?.map((l: any, i: number) => (
                  <a key={i} href={l.url} target="_blank" rel="noreferrer" style={{ color: isDarkMode ? '#c7b3f8' : '#5b21b6' }}>{l.title}</a>
                ))}
              </div>
            </div>
          );

        case 'roadmap':
          return (
            <div style={{ margin: '12px 0' }}>
              <h4 style={{ margin: '0 0 8px 0', color: isDarkMode ? '#e9d5ff' : '#7c3aed' }}>{interactiveElement.content}</h4>
              <div style={{ display: 'grid', gap: 8 }}>
                {interactiveElement.metadata?.items?.map((it: any, i: number) => (
                  <div key={i} style={{ padding: 10, borderRadius: 8, background: isDarkMode ? 'rgba(255,255,255,0.02)' : '#fff' }}>
                    <div style={{ fontWeight: 700 }}>{it.milestone} <span style={{ fontWeight: 600, color: isDarkMode ? '#c7b3f8' : '#6b21a8' }}>· {it.eta}</span></div>
                    <div style={{ color: isDarkMode ? '#cbd5e1' : '#374151' }}>{it.details}</div>
                  </div>
                ))}
              </div>
            </div>
          );

        case 'skills': {
          const skills = interactiveElement.metadata?.skills || [];
          return (
            <div style={{ margin: '12px 0' }}>
              <h4 style={{ margin: '0 0 8px 0', color: isDarkMode ? '#e9d5ff' : '#7c3aed' }}>{interactiveElement.content}</h4>
              {skills.length === 0 ? null : (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <svg width={220} height={220} viewBox="0 0 220 220">
                    <g transform="translate(110,110)">
                      {[20,40,60,80,100].map((scale) => {
                        const points = skills.map((s: any, i: number) => {
                          const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
                          const r = 80 * (scale / 100);
                          const x = Math.cos(angle) * r;
                          const y = Math.sin(angle) * r;
                          return `${x},${y}`;
                        }).join(' ');
                        return <polygon key={scale} points={points} fill="none" stroke={isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)'} strokeWidth={1} />;
                      })}
                      {(function(){
                        const points = skills.map((s: any, i: number) => {
                          const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
                          const r = 80 * ((s.score || 0) / 100);
                          const x = Math.cos(angle) * r;
                          const y = Math.sin(angle) * r;
                          return `${x},${y}`;
                        }).join(' ');
                        return <polygon points={points} fill={isDarkMode ? 'rgba(124,58,237,0.18)' : 'rgba(124,58,237,0.12)'} stroke={isDarkMode ? '#c4b5fd' : '#7c3aed'} strokeWidth={1.5} />;
                      })()}
                      {skills.map((s: any, i: number) => {
                        const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
                        const x = Math.cos(angle) * 92;
                        const y = Math.sin(angle) * 92;
                        return (
                          <text key={i} x={x} y={y} fontSize={10} textAnchor={x > 20 ? 'start' : x < -20 ? 'end' : 'middle'} fill={isDarkMode ? '#e6e6f0' : '#374151'}>
                            {s.label}
                          </text>
                        );
                      })}
                    </g>
                  </svg>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {skills.map((s: any, i: number) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: isDarkMode ? '#c4b5fd' : '#7c3aed' }} />
                        <div style={{ fontSize: 13, color: isDarkMode ? '#cbd5e1' : '#374151' }}>{s.label}: <strong style={{ color: isDarkMode ? '#f3e8ff' : '#111827' }}>{s.score}</strong></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }

        case 'case_study': {
          return (
            <div style={{ margin: '12px 0' }}>
              <div style={{ padding: 12, borderRadius: 10, background: isDarkMode ? 'rgba(17,24,39,0.6)' : '#fff', boxShadow: isDarkMode ? '0 6px 18px rgba(2,6,23,0.6)' : '0 6px 18px rgba(15,23,42,0.04)' }}>
                <div style={{ fontWeight: 800, color: isDarkMode ? '#e9d5ff' : '#111827', fontSize: 16 }}>{interactiveElement.metadata?.title || interactiveElement.content}</div>
                {interactiveElement.metadata?.problem && <div style={{ marginTop: 8, color: isDarkMode ? '#cbd5e1' : '#374151' }}><strong>Problem:</strong> {interactiveElement.metadata.problem}</div>}
                {interactiveElement.metadata?.solution && <div style={{ marginTop: 6, color: isDarkMode ? '#cbd5e1' : '#374151' }}><strong>Solution:</strong> {interactiveElement.metadata.solution}</div>}
                {interactiveElement.metadata?.result && <div style={{ marginTop: 6, color: isDarkMode ? '#9fb4ff' : '#111827' }}><strong>Result:</strong> {interactiveElement.metadata.result}</div>}
                {interactiveElement.metadata?.metric && (
                  <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 8, background: isDarkMode ? 'rgba(255,255,255,0.02)' : '#f8fafc', display: 'inline-block' }}>
                    <div style={{ fontSize: 12, color: isDarkMode ? '#cbd5e1' : '#6b7280' }}>{interactiveElement.metadata.metric.label}</div>
                    <div style={{ fontWeight: 800, color: isDarkMode ? '#f3e8ff' : '#111827' }}>{interactiveElement.metadata.metric.before} → {interactiveElement.metadata.metric.after}</div>
                  </div>
                )}
              </div>
            </div>
          );
        }

          case 'contact': {
            // Always show hardcoded contact buttons: LinkedIn, Email, GitHub
            const items = [
              { id: 'linkedin', title: 'LinkedIn', subtitle: "Let's connect", link: 'https://www.linkedin.com/in/yanivvds/', color: '#0A66C2' },
              { id: 'email', title: 'Email', subtitle: 'Drop me a line', link: 'mailto:yanivvds@gmail.com', color: '#ffffffff' },
              { id: 'github', title: 'GitHub', subtitle: 'Check out my code', link: 'https://github.com/yanivvds', color: '#111827' }
            ];

            return (
              <div style={{ margin: '12px 0' }}>
                <h4 style={{ margin: '0 0 8px 0', color: isDarkMode ? '#e9d5ff' : '#7c3aed' }}>{interactiveElement.content || 'Contact'}</h4>
                <div className="chat-contact-visualization">
                  {items.map((c: any, i: number) => (
                    <a
                      key={i}
                      className="chat-contact-button"
                      href={c.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={c.title}
                      style={{ ['--card-color' as any]: c.color || (isDarkMode ? '#8b5cf6' : '#7c3aed') } as React.CSSProperties & { [key: string]: string }}
                    >
                      <div className="icon-wrap" style={{ background: c.color }}>
                        {c.id === 'linkedin' ? (
                          <LinkedInIcon style={{ fontSize: 28, color: '#fff' }} />
                        ) : c.id === 'email' ? (
                          // Use a white Gmail SVG icon so it shows on the red background
                          <img src="https://img.icons8.com/?size=100&id=P7UIlhbpWzZm&format=png&color=000000" alt="Gmail" style={{ width: 28, height: 28 }} />
                        ) : c.id === 'github' ? (
                          <GitHubIcon style={{ fontSize: 28, color: '#fff' }} />
                        ) : (
                          <SendIcon style={{ fontSize: 28 }} />
                        )}
                      </div>
                      <div className="label-wrap">
                        <div className="label">{c.title}</div>
                        <div className="sub">{c.subtitle}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          }

        default:
          // graceful fallback: pretty-print metadata or content so we still show something useful
          return (
            <div style={{
              margin: '12px 0',
              padding: '12px',
              background: isDarkMode ? 'rgba(139, 92, 246, 0.06)' : 'rgba(124, 58, 237, 0.04)',
              borderRadius: '8px',
              border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.12)' : 'rgba(124, 58, 237, 0.08)'}`,
              fontSize: '13px',
              color: isDarkMode ? '#cbd5e1' : '#374151'
            }}>
              <strong style={{ display: 'block', marginBottom: '8px', color: isDarkMode ? '#8b5cf6' : '#7c3aed' }}>
                {interactiveElement.content || 'Details'}
              </strong>
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{JSON.stringify(interactiveElement.metadata || {}, null, 2)}</pre>
            </div>
          );
      }
      };

      return (
        <div style={{ margin: '12px 0' }}>
          {messageId && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
              <button
                onClick={() => toggleVisualization(messageId)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isDarkMode ? '#94a3b8' : '#4b5563',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
                aria-label={isHidden ? 'Show visualization' : 'Hide visualization'}
              >
                {isHidden ? 'Show visualization' : 'Hide visualization'}
              </button>
            </div>
          )}

          {!isHidden && renderInner()}
        </div>
      );
    };

    // Function to highlight project names in purple
    const highlightProjectName = (text: string) => {
      const projectNames = [
        'Kalff Fundraising Dashboard',
        'KPN Easy Mode',
        'VibeGroup Recruitment Algorithm',
        'TagJeTafel',
        'Travel Insider Tips',
        'Task Management API'
      ];

      let highlightedText = text;
      projectNames.forEach(projectName => {
        const regex = new RegExp(`(${projectName})`, 'gi');
        highlightedText = highlightedText.replace(regex, `<span style="color: ${isDarkMode ? '#a855f7' : '#7c3aed'}; font-weight: 600;">$1</span>`);
      });

      return highlightedText;
    };

    // If this is an initial introduction message with questions, render them as buttons
    if (hasBulletQuestions) {
      const parts = content.split("Here are some questions you can ask:");
      const introText = parts[0] + "Here are some questions you can ask:";
      const questionsText = parts[1] || "";
      const questions = questionsText.split("• ").filter((q: string) => q.trim()).map((q: string) => q.replace("?", "").trim() + "?");

      return (
        <div>
          <div dangerouslySetInnerHTML={{ __html: highlightProjectName(introText) }} />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            margin: '16px 0',
            padding: '0'
          }}>
            {questions.map((question: string, index: number) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(question)}
                style={{
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))'
                    : 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(139, 92, 246, 0.1))',
                  border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(124, 58, 237, 0.3)'}`,
                  borderRadius: '8px',
                  color: isDarkMode ? '#8b5cf6' : '#7c3aed',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  fontWeight: '500',
                  padding: '10px 14px',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.2))'
                    : 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(139, 92, 246, 0.2))';
                  e.currentTarget.style.borderColor = isDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(124, 58, 237, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = isDarkMode
                    ? '0 4px 12px rgba(139, 92, 246, 0.15)'
                    : '0 4px 12px rgba(124, 58, 237, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))'
                    : 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(139, 92, 246, 0.1))';
                  e.currentTarget.style.borderColor = isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(124, 58, 237, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span>{question}</span>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(124, 58, 237, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '8px',
                  transition: 'all 0.2s ease'
                }}>
                  <ArrowForwardIcon style={{
                    fontSize: '12px',
                    color: isDarkMode ? '#8b5cf6' : '#7c3aed'
                  }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: highlightProjectName(content) }} />
        {isStreaming && !content.includes('Thinking') && !content.includes('...') && (
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '16px',
            background: `linear-gradient(45deg, ${isDarkMode ? '#8b5cf6' : '#7c3aed'}, ${isDarkMode ? '#a855f7' : '#8b5cf6'})`,
            borderRadius: '2px',
            marginLeft: '4px',
            animation: 'blink 1.2s infinite'
          }} />
        )}
        {renderInteractiveElement()}
        {followUpQuestions.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            margin: '16px 0',
            padding: '0'
          }}>
            {followUpQuestions.map((question: string, index: number) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(question)}
                style={{
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))'
                    : 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(139, 92, 246, 0.1))',
                  border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(124, 58, 237, 0.3)'}`,
                  borderRadius: '8px',
                  color: isDarkMode ? '#8b5cf6' : '#7c3aed',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  fontWeight: '500',
                  padding: '10px 14px',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.2))'
                    : 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(139, 92, 246, 0.2))';
                  e.currentTarget.style.borderColor = isDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(124, 58, 237, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = isDarkMode
                    ? '0 4px 12px rgba(139, 92, 246, 0.15)'
                    : '0 4px 12px rgba(124, 58, 237, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))'
                    : 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(139, 92, 246, 0.1))';
                  e.currentTarget.style.borderColor = isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(124, 58, 237, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span>{question}</span>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(124, 58, 237, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '8px',
                  transition: 'all 0.2s ease'
                }}>
                  <ArrowForwardIcon style={{
                    fontSize: '12px',
                    color: isDarkMode ? '#8b5cf6' : '#7c3aed'
                  }} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

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

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    handleSendMessage(chatInput);
  };

  return (
    <>
      <div id="contact">
        <div className="items-container">
          <div className={`contact_wrapper ${isDarkMode ? 'dark' : 'light'}`}>
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
                    {renderMessageContent(msg)}
                  </div>
                </div>
              ))}
              {isTyping && !chatMessages.some(msg => msg.isStreaming) && (
                <div className="chatbot-message assistant typing">
                  <div className="chatbot-message-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      {currentLoadingMessage && (
                        <div style={{
                          color: isDarkMode ? '#cbd5e1' : '#6b7280',
                          fontSize: '14px',
                          fontStyle: 'italic',
                          opacity: 0.8
                        }}>
                          {currentLoadingMessage}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
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