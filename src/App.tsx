import React, {useState, useEffect, useMemo} from "react";
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
    // Multiple sets of loading messages to rotate through
    const loadingMessageSets = useMemo(() => [
        [
            "Thinking about your question...",
            "Searching through Yaniv's project files...",
            "Analyzing the best way to answer...",
            "Crafting a personalized response...",
            "Almost ready with the answer!"
        ],
        [
            "Processing your inquiry...",
            "Scanning through project documentation...",
            "Evaluating the context...",
            "Formulating a thoughtful response...",
            "Finalizing the answer..."
        ],
        [
            "Considering your question...",
            "Reviewing relevant project details...",
            "Assessing the information...",
            "Composing a comprehensive answer...",
            "Completing the response..."
        ],
        [
            "Reflecting on your query...",
            "Exploring project archives...",
            "Examining the details...",
            "Developing a detailed response...",
            "Wrapping up the answer..."
        ]
    ], []);

    const [questionCount, setQuestionCount] = useState(0);
    const [currentLoadingMessage, setCurrentLoadingMessage] = useState<string>('');

    // Get the current loading message set based on question count
    const loadingMessages = loadingMessageSets[questionCount % loadingMessageSets.length];

    // Simple response cache for common questions
    const [responseCache, setResponseCache] = useState<Record<string, any>>({});

    // Cycle through loading messages only once while AI is thinking
    useEffect(() => {
        let messageInterval: NodeJS.Timeout;
        let messageIndex = 0;
        let hasCompletedCycle = false;

        if (isTyping && loadingMessages.length > 0 && !hasCompletedCycle) {
            setCurrentLoadingMessage(loadingMessages[0]);
            messageInterval = setInterval(() => {
                messageIndex++;
                if (messageIndex < loadingMessages.length) {
                    const newMessage = loadingMessages[messageIndex];
                    setCurrentLoadingMessage(newMessage);

                    // Update any streaming messages that are still showing loading text
                    setChatMessages(prevMessages =>
                        prevMessages.map(msg =>
                            msg.isStreaming && (msg.content?.includes('Thinking') || msg.content?.includes('...') ||
                                             msg.content?.includes('Processing') || msg.content?.includes('Considering') ||
                                             msg.content?.includes('Reflecting'))
                                ? { ...msg, content: newMessage }
                                : msg
                        )
                    );
                } else {
                    // Stop the interval when we've gone through all messages once
                    hasCompletedCycle = true;
                    if (messageInterval) {
                        clearInterval(messageInterval);
                    }
                }
            }, 2500); // Change message every 2.5 seconds
        }

        return () => {
            if (messageInterval) {
                clearInterval(messageInterval);
            }
        };
    }, [isTyping, loadingMessages]);

    // Reset loading message when typing stops
    useEffect(() => {
        if (!isTyping) {
            setCurrentLoadingMessage('');
        }
    }, [isTyping]);

    const suggestedQuestions = [
        "What are Yaniv's main skills?",
        "Tell me about his education",
        "What kind of roles or companies is Yaniv interested in?",
        "What are some of Yaniv's favorite side projects?",
        "What's Yaniv's most unexpected hobby?",
        "If Yaniv could build any AI-powered product, what would it be?",
        "How can I contact Yaniv?"
    ];

    // System prompt for AI assistant
    const systemPrompt = `You are **Yaniv's AI portfolio assistant**, helping users learn about his projects and technical background.
You have access to detailed project PDFs and personal information in AboutYaniv.pdf.
---
## ROLE
- Answer questions about Yaniv's projects using the provided PDF context and DONT hallucinate.
- For study related questions always refer to AboutYaniv.pdf
- Provide technical insights while respecting confidentiality.
- Be professional, helpful, and engaging.
- Focus on technical highlights, challenges, and learnings.
---

## RESPONSE FORMAT (STRICT)
You **must ALWAYS** respond **only** with **valid JSON**, following this **exact structure** — never include explanations, markdown, or extra text outside the JSON.
{
  "response": "Keep it short and conversational (1-2 sentences max) - be direct like you're chatting with a friend, include 0 or 1 direct quotes, and be engaging without over-analyzing or explaining.",
  "followUpQuestions": [
    "What technologies were used in this project?",
    "Can you show me the project architecture?"
  ],
  "interactiveElement": {
    "type": "text|none|contact|tech_stack|timeline|code_snippet|feature_highlight|architecture|metrics|demo|contributors|links|roadmap|skills|case_study",
    "content": "Content relevant to the selected type.",
    "metadata": {
      "additional data specific to the element type"
    }
  }
}

If the user asks a question that doesn't require an interactive element, set either:
"interactiveElement": {
  "type": "text",
  "content": "No interactive content required.",
  "metadata": {}
}

or explicitly use the \`none\` type to indicate the assistant intentionally omits any visualization:
"interactiveElement": {
  "type": "none",
  "content": "",
  "metadata": {}
}

**Important enforcement rules:**
- Never wrap JSON in code blocks.
- Dont provide information that is not related to Yaniv or his projects (which are in the pdf files)
- If youre not sure about an answer, tell the user you can't answer it but that he can always contact Yaniv personally (and than show the contact cards visualization)
- Never include markdown, explanations, or text before or after the JSON.
- Always use valid JSON syntax (double quotes, commas, brackets).
- Ensure all keys (\`response\`, \`followUpQuestions\`, \`interactiveElement\`) are present.
- If unsure which \`interactiveElement\` type fits, default to \`"text"\`.
- Suggest engaging follow-up questions related to the topic that will use a different visualization than the one you just used.
- Try to make follow-up questions where you know you have the answer to in the pdfs/files that you have
---

## INTERACTIVE ELEMENT TYPES
### 1. tech_stack
Used for technology-related questions. Prefer returning small icon URLs (icon_url) or icon identifiers rather than emojis when possible. Example:
{
  "type": "tech_stack",
  "content": "Technologies used in this project.",
  "metadata": {
    "technologies": [
      {"name": "React", "category": "Frontend", "icon": "react", "icon_url": "https://cdn.simpleicons.org/react/61DAFB"},
      {"name": "TypeScript", "category": "Language", "icon": "typescript", "icon_url": "https://cdn.simpleicons.org/typescript/3178C6"}
    ]
  }
}

### 2. timeline
Used for questions about development phases or process. Provide structured events and prefer concise descriptions. Example:
{
  "type": "timeline",
  "content": "Project development timeline.",
  "metadata": {
    "events": [
      {"phase": "Planning", "duration": "2 weeks", "description": "Requirements gathering.", "icon_url": "https://cdn.simpleicons.org/figma/F24E1E"},
      {"phase": "Development", "duration": "6 weeks", "description": "Core implementation.", "icon_url": "https://cdn.simpleicons.org/github/181717"}
    ]
  }
}

### 3. code_snippet
Used for implementation or algorithm examples. Return the language and code, and keep snippets short (<= 30 lines) with a one-line explanation. Example:
{
  "type": "code_snippet",
  "content": "Key implementation example.",
  "metadata": {
    "language": "typescript",
    "code": "const example = () => { return 'highlight'; }",
    "explanation": "This demonstrates the reusable component logic."
  }
}

### 4. feature_highlight
Used for highlighting key features or technical achievements. Prefer including an optional small icon_url for branding. Example:
{
  "type": "feature_highlight",
  "content": "Most impressive feature.",
  "metadata": {
    "title": "Real-time Collaboration",
    "challenge": "Handling concurrent edits.",
    "solution": "Operational transforms.",
    "impact": "Seamless user experience.",
    "icon_url": "https://cdn.simpleicons.org/socketdotio/010101"
  }
}

### 5. architecture
Used to convey system architecture or component diagrams. Prefer returning a short list of components and an optional \`image_url\` (diagram) or \`diagram_svg\` when available. Example:
{
  "type": "architecture",
  "content": "High-level architecture.",
  "metadata": {
    "components": [
      {"name": "Frontend (React)", "role": "UI", "icon_url": "https://cdn.simpleicons.org/react/61DAFB"},
      {"name": "API (Node.js)", "role": "Backend", "icon_url": "https://cdn.simpleicons.org/node-dot-js/339933"}
    ],
    "image_url": "https://example.com/architecture.png"
  }
}

### 6. metrics
Used to present key performance indicators or impact metrics. Return an array of metric objects with label/value and optional unit or delta. Example:
{
  "type": "metrics",
  "content": "Project impact metrics.",
  "metadata": {
    "metrics": [
      {"label": "DAUs", "value": "12,400", "unit": "users"},
      {"label": "Performance", "value": "120ms", "unit": "p95"}
    ]
  }
}

### 7. demo
Used to embed a demo, GIF, or short video. Prefer \`video_url\` or \`gif_url\` in metadata and a short caption. Example:
{
  "type": "demo",
  "content": "Short demo clip.",
  "metadata": { "video_url": "https://example.com/demo.mp4", "gif_url": "https://example.com/demo.gif" }
}

### 8. contributors
Used to list contributors or team members with roles and optional avatars. Example:
{
  "type": "contributors",
  "content": "Team members.",
  "metadata": {
    "people": [
      {"name": "Yaniv", "role": "Lead Developer", "avatar_url": "https://example.com/avatar.jpg"},
      {"name": "Alex", "role": "Data Scientist"}
    ]
  }
}

### 9. links
Used to provide relevant links (repo, live demo, docs). Return \`title\` and \`url\` pairs. Example:
{
  "type": "links",
  "content": "Useful links.",
  "metadata": {
    "links": [
      {"title": "GitHub repo", "url": "https://github.com/..."},
      {"title": "Live demo", "url": "https://example.com"}
    ]
  }
}

### 10. roadmap
Used to show planned future work or roadmap items (similar to timeline but forward-looking). Example:
{
  "type": "roadmap",
  "content": "Planned roadmap.",
  "metadata": {
    "items": [
      {"milestone": "v2 - Collaboration", "eta": "Q3 2024", "details": "Realtime sync"}
    ]
  }
}

### 11. skills
Used to present skill proficiencies across categories; return normalized scores (0-100) per skill or category to drive a radar chart or bar chart. Never show skills less than 70. Example:
{
  "type": "skills",
  "content": "Skill proficiencies (0-100).",
  "metadata": {
    "skills": [
      {"label": "Frontend", "score": 90},
      {"label": "Backend", "score": 75},
      {"label": "Data", "score": 70},
      {"label": "DevOps", "score": 90},
      {"label": "Testing", "score": 80}
    ]
  }
}

### 12. case_study
Short, interview-friendly case studies formatted as problem → solution → result. Include an optional metric. Example:
{
  "type": "case_study",
  "content": "Short case study summary.",
  "metadata": {
    "title": "Reduced load time by 40%",
    "problem": "Slow initial load impacting engagement.",
    "solution": "Implemented code-splitting and critical CSS inlining.",
    "result": "40% faster TTI, 12% increase in retention.",
    "metric": {"label": "TTI", "before": "3.2s", "after": "1.9s"}
  }
}

  ### 13. contact
  Use this when the user asks how to reach Yaniv or when you want to present contact channels (email, LinkedIn, GitHub, calendar link, etc.). Prefer returning structured contact objects with labels and links so the UI can render clickable cards. Example:
  {
    "type": "contact",
    "content": "Ways to contact Yaniv",
    "metadata": {
      "contacts": [
        {"id":"email","title":"Email","subtitle":"Drop me a line","value":"yanivvds@gmail.com","link":"mailto:yanivvds@gmail.com"},
        {"id":"linkedin","title":"LinkedIn","subtitle":"Let's connect","value":"/in/yanivvds","link":"https://www.linkedin.com/in/yanivvds/"}
      ]
    }
  }

---
## BEHAVIORAL GUIDELINES
- Keep responses SHORT and CONVERSATIONAL (2-3 sentences max) - like you're chatting with a friend about Yaniv.
- Include 1-2 direct quotes from source material to make answers feel authentic and genuine.
- Reference where information comes from (like "as Yaniv mentions in his about section" or "from the project documentation").
- Use engaging language and personality while staying professional.
- NEVER over-analyze, explain, or qualify statements - trust the source material and present it directly.
- For hobby/personal questions, be straightforward and fun - don't debate or analyze what's "most unexpected" if it's clearly stated.
- Highlight **Yaniv's technical skills**, **creative problem-solving**, and **impactful results**.
- Use project PDF context when available.
- Suggest engaging follow-up questions related to the topic that will use a different visualization than the one you just used.
- Try to make follow-up questions where you know you have the answer to in the pdfs/files that you have
- If information is confidential, respond politely without revealing details.
- IMPORTANT: Do NOT write essays, analyze content, or explain concepts. Be direct and conversational.
---

## CONTEXT HANDLING
When a user mentions or clicks on a specific project, prioritize the corresponding PDF for that project.
If the user asks a general question (e.g., about Yaniv's skills or favorite part), use the AboutYaniv.pdf file
## VERIFIED BACKGROUND INFORMATION
Use ONLY this verified information for any responses about Yaniv's background, education, skills, or personal details. Do not invent or infer any additional information.
**Education, mission, professional focus, technical skills, vision, values, hobbies, beyond work** are all in AboutYaniv.pdf
## 🧩 TRUTH CONSTRAINTS
- Only use verified information from:
  1. Project PDFs
  2. **AboutYaniv.pdf** (official background & education info)
  3. This system prompt
- Never infer, guess, or generate facts not explicitly stated in those sources.
- If info isn't found, respond with:
  \`"That information isn't specified in Yaniv's profile or documentation. But you can always ask him yourself!"\`
  and include a \`"contact"\` interactive element.
- Do **not invent** institutions, dates, or credentials.
- When uncertain, stay neutral and direct users to contact Yaniv.
---

## FAILSAFE
If the model detects that it cannot produce valid JSON (due to conflicting instructions), it must **output an empty JSON skeleton** instead of free text:
{
  "response": "I'm sorry, I couldn't generate a valid response for that question.",
  "followUpQuestions": [],
  "interactiveElement": {
    "type": "text",
    "content": "",
    "metadata": {}
  }
}
`;

    // Secure API integration using internal Vercel serverless functions
    const getChatbotResponse = async (userMessage: string, onStreamUpdate?: (chunk: string) => void) => {
        try {
            // Check cache first for common questions
            const cacheKey = userMessage.toLowerCase().trim();
            if (responseCache[cacheKey] && !onStreamUpdate) { // Only use cache for non-streaming requests
                console.log('Using cached response for:', cacheKey);
                return responseCache[cacheKey];
            }

            // Determine API endpoint based on streaming preference
            const apiEndpoint = onStreamUpdate ? '/api/chat-stream' : '/api/chat';
            
            // Prepare request body for our internal API
            const requestBody = {
                message: userMessage,
                projectContext: currentProjectContext
            };

            console.log('🎯 Making request to internal API:', apiEndpoint);
            console.log('📤 Request body:', {
                message: userMessage.substring(0, 100) + (userMessage.length > 100 ? '...' : ''),
                projectContext: currentProjectContext,
                messageLength: userMessage.length
            });

            if (onStreamUpdate) {
                // Handle streaming response
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status}`);
                }

                // Handle Server-Sent Events
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                let finalResponse = null;

                if (!reader) {
                    throw new Error('Response body is not available');
                }

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    buffer += chunk;

                    // Process complete lines from the buffer
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || ''; // Keep incomplete line in buffer

                    for (const line of lines) {
                        if (line.trim() === '') continue;
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6).trim();
                            if (data === '[DONE]') {
                                if (finalResponse) {
                                    return finalResponse;
                                }
                                continue;
                            }

                            try {
                                const event = JSON.parse(data);
                                console.log('Streaming event:', event);

                                // Handle streaming content
                                if (event.content) {
                                    onStreamUpdate(event.content);
                                }

                                // Handle final response
                                if (event.final) {
                                    finalResponse = event.final;
                                    // Cache successful responses for common questions
                                    setResponseCache(prev => ({
                                        ...prev,
                                        [cacheKey]: event.final
                                    }));
                                }

                                // Handle errors
                                if (event.error) {
                                    throw new Error(event.error);
                                }
                            } catch (parseError) {
                                console.error('Failed to parse streaming event:', parseError);
                            }
                        }
                    }
                }

                return finalResponse || {
                    response: "I received your message but had trouble with the streaming response. Please try again.",
                    followUpQuestions: ["How can I contact Yaniv?"],
                    interactiveElement: {
                        type: 'contact',
                        content: 'Ways to contact Yaniv',
                        metadata: {
                            contacts: [
                                {
                                    id: "email",
                                    title: "Email",
                                    subtitle: "Drop me a line",
                                    value: "yanivvds@gmail.com",
                                    link: "mailto:yanivvds@gmail.com"
                                }
                            ]
                        }
                    }
                };

            } else {
                // Handle non-streaming response
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status}`);
                }

                const data = await response.json();
                
                // Cache successful responses for common questions
                setResponseCache(prev => ({
                    ...prev,
                    [cacheKey]: data
                }));

                return data;
            }

        } catch (error) {
            console.error('🚨 INTERNAL API ERROR:', error);
            console.error('🚨 Error type:', typeof error);
            console.error('🚨 Error message:', error instanceof Error ? error.message : 'Unknown error');
            console.error('🚨 Error stack:', error instanceof Error ? error.stack : 'No stack trace');

            // Enhanced error handling with fallback to contact
            return {
                response: "I'm having trouble connecting right now, but you can always reach out to Yaniv directly!",
                followUpQuestions: ["What's the best way to contact Yaniv?"],
                interactiveElement: {
                    type: 'contact',
                    content: 'Ways to contact Yaniv',
                    metadata: {
                        contacts: [
                            {
                                id: "email",
                                title: "Email",
                                subtitle: "Drop me a line",
                                value: "yanivvds@gmail.com",
                                link: "mailto:yanivvds@gmail.com"
                            },
                            {
                                id: "linkedin",
                                title: "LinkedIn",
                                subtitle: "Let's connect",
                                value: "/in/yanivvds",
                                link: "https://www.linkedin.com/in/yanivvds/"
                            }
                        ]
                    }
                }
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

        // Increment question count to rotate loading message sets
        setQuestionCount(prev => prev + 1);

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
        }, 500);

        setTimeout(() => {
            window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        }, 100);
    };

    const handleSendMessage = async (message: string) => {
        if (message.trim()) {
            // Increment question count to rotate loading message sets
            setQuestionCount(prev => prev + 1);

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

            // Create streaming AI message
            const aiMessageId = (Date.now() + 1).toString();
            const streamingAiMessage = {
                id: aiMessageId,
                content: currentLoadingMessage || 'Thinking...',
                role: 'assistant',
                timestamp: new Date(),
                followUpQuestions: [],
                interactiveElement: null,
                isStreaming: true
            };

            setChatMessages(prev => [...prev, streamingAiMessage]);

            // Track if we've started streaming actual content
            let hasStartedStreaming = false;

            // Get AI response using OpenAI API with streaming
            const aiResponse = await getChatbotResponse(message.trim(), (chunk: string) => {
                // Update streaming message content progressively
                setChatMessages(prevMessages =>
                    prevMessages.map(msg => {
                        if (msg.id === aiMessageId) {
                            const currentContent = msg.content || '';
                            let newContent;

                            if (!hasStartedStreaming && currentContent.includes('Thinking')) {
                                // First chunk - replace loading message with streaming content
                                newContent = chunk;
                                hasStartedStreaming = true;
                            } else {
                                // Subsequent chunks - append to existing content
                                newContent = currentContent + chunk;
                            }

                            return { ...msg, content: newContent };
                        }
                        return msg;
                    })
                );
            });

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

            // Update the final message with complete response
            const finalAiMessage = {
                id: aiMessageId,
                content: responseContent,
                role: 'assistant',
                timestamp: new Date(),
                followUpQuestions,
                interactiveElement,
                isStreaming: false
            };

            setChatMessages(prev => prev.map(msg =>
                msg.id === aiMessageId ? finalAiMessage : msg
            ));
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
                    currentLoadingMessage,
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

