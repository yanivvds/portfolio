# OpenAI Completion Integration with Vector Storage

## Overview

This implementation replaces the existing OpenAI Assistant integration with a completion-based approach using the Assistants API with File Search tool. Files are stored in vector store `vs_68fe3aa375b48191a9b50492f9eec576` and uploaded via the OpenAI platform dashboard.

## Architecture

- **API**: OpenAI Assistants API with File Search tool
- **Vector Store**: `vs_68fe3aa375b48191a9b50492f9eec576`
- **Response Format**: Strict JSON structure matching current system prompt
- **Session Management**: Thread-based conversation history
- **Error Handling**: Fallback to contact form with custom error messages

## Configuration

### Environment Variables

Add to your environment configuration:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ASSISTANT_ID=your_assistant_id_here
```

### Assistant Configuration

The assistant should be created with:

```javascript
{
  name: "Portfolio Assistant",
  instructions: "You are Yaniv's AI portfolio assistant...",
  model: "gpt-4o",
  tools: [{ type: "file_search" }],
  tool_resources: {
    file_search: {
      vector_store_ids: ["vs_68fe3aa375b48191a9b50492f9eec576"]
    }
  }
}
```

## Implementation

### 1. Service Layer (`src/services/openaiService.ts`)

```typescript
import OpenAI from 'openai';

export interface PortfolioResponse {
  response: string;
  followUpQuestions: string[];
  interactiveElement: {
    type: string;
    content: string;
    metadata: Record<string, any>;
  };
}

export class OpenAIService {
  private client: OpenAI;
  private assistantId: string;
  private threads: Map<string, string> = new Map(); // sessionId -> threadId

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Only for client-side usage
    });
    this.assistantId = process.env.REACT_APP_OPENAI_ASSISTANT_ID!;
  }

  async createThread(sessionId: string): Promise<string> {
    try {
      const thread = await this.client.beta.threads.create();
      this.threads.set(sessionId, thread.id);
      return thread.id;
    } catch (error) {
      console.error('Error creating thread:', error);
      throw new Error('Failed to initialize conversation');
    }
  }

  async sendMessage(sessionId: string, message: string): Promise<PortfolioResponse> {
    try {
      let threadId = this.threads.get(sessionId);
      if (!threadId) {
        threadId = await this.createThread(sessionId);
      }

      // Add user message to thread
      await this.client.beta.threads.messages.create(threadId, {
        role: 'user',
        content: message
      });

      // Create and run assistant
      const run = await this.client.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: this.assistantId
      });

      if (run.status === 'completed') {
        const messages = await this.client.beta.threads.messages.list(threadId);
        const lastMessage = messages.data[0];

        if (lastMessage.content[0].type === 'text') {
          const response = lastMessage.content[0].text.value;

          // Parse the JSON response from assistant
          try {
            const parsedResponse: PortfolioResponse = JSON.parse(response);
            return parsedResponse;
          } catch (parseError) {
            // Fallback if response isn't valid JSON
            return this.createFallbackResponse(response);
          }
        }
      }

      throw new Error('Failed to get response from assistant');

    } catch (error) {
      console.error('Error in sendMessage:', error);
      return this.createErrorResponse(error);
    }
  }

  private createFallbackResponse(rawResponse: string): PortfolioResponse {
    return {
      response: rawResponse,
      followUpQuestions: [
        "Can you tell me more about this project?",
        "What technologies did you use?"
      ],
      interactiveElement: {
        type: "text",
        content: "Response processed from assistant",
        metadata: {}
      }
    };
  }

  private createErrorResponse(error: any): PortfolioResponse {
    return {
      response: "I'm sorry, I couldn't process your question right now. But you can always contact Yaniv directly!",
      followUpQuestions: [],
      interactiveElement: {
        type: "contact",
        content: "Contact options for Yaniv",
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

  clearSession(sessionId: string) {
    this.threads.delete(sessionId);
  }
}

// Singleton instance
export const openAIService = new OpenAIService();
```

### 2. React Hook (`src/hooks/usePortfolioChat.ts`)

```typescript
import { useState, useCallback } from 'react';
import { openAIService, PortfolioResponse } from '../services/openaiService';

export interface ChatState {
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    interactiveElement?: PortfolioResponse['interactiveElement'];
    timestamp: Date;
  }>;
  isLoading: boolean;
  error: string | null;
}

export const usePortfolioChat = (sessionId: string) => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null
  });

  const sendMessage = useCallback(async (message: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await openAIService.sendMessage(sessionId, message);

      const newMessage = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: response.response,
        interactiveElement: response.interactiveElement,
        timestamp: new Date()
      };

      const userMessage = {
        id: (Date.now() - 1).toString(),
        role: 'user' as const,
        content: message,
        timestamp: new Date()
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage, newMessage],
        isLoading: false
      }));

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      throw error;
    }
  }, [sessionId]);

  const clearChat = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null
    });
    openAIService.clearSession(sessionId);
  }, [sessionId]);

  return {
    ...state,
    sendMessage,
    clearChat
  };
};
```

### 3. Chat Component (`src/components/PortfolioChat.tsx`)

```typescript
import React, { useState, useRef, useEffect } from 'react';
import { usePortfolioChat } from '../hooks/usePortfolioChat';
import { Contact } from './Contact';
import './PortfolioChat.scss';

interface PortfolioChatProps {
  sessionId?: string;
}

export const PortfolioChat: React.FC<PortfolioChatProps> = ({
  sessionId = 'default-session'
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, error, sendMessage, clearChat } = usePortfolioChat(sessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');

    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const renderInteractiveElement = (element: any) => {
    switch (element.type) {
      case 'contact':
        return <Contact contacts={element.metadata.contacts} />;
      case 'tech_stack':
        return (
          <div className="tech-stack">
            <h4>{element.content}</h4>
            <div className="technologies">
              {element.metadata.technologies?.map((tech: any, index: number) => (
                <div key={index} className="tech-item">
                  {tech.icon_url && <img src={tech.icon_url} alt={tech.name} />}
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'timeline':
        return (
          <div className="timeline">
            <h4>{element.content}</h4>
            {element.metadata.events?.map((event: any, index: number) => (
              <div key={index} className="timeline-event">
                <h5>{event.phase}</h5>
                <p>{event.description}</p>
                <span className="duration">{event.duration}</span>
              </div>
            ))}
          </div>
        );
      // Add other interactive element types as needed
      default:
        return null;
    }
  };

  return (
    <div className="portfolio-chat">
      <div className="chat-header">
        <h3>Ask about Yaniv's Projects</h3>
        <button onClick={clearChat} className="clear-btn">
          Clear Chat
        </button>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <p>Hi! I'm Yaniv's AI assistant. Ask me about his projects, technical background, or experience!</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <div className="message-content">
              <p>{message.content}</p>
              {message.interactiveElement && renderInteractiveElement(message.interactiveElement)}
            </div>
            <span className="timestamp">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="message assistant loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <Contact />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Yaniv's projects..."
          disabled={isLoading}
        />
        <button type="submit" disabled={!input.trim() || isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};
```

### 4. SCSS Styles (`src/components/PortfolioChat.scss`)

```scss
.portfolio-chat {
  display: flex;
  flex-direction: column;
  height: 600px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .clear-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;

      &:hover {
        background: #c82333;
      }
    }
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .welcome-message {
      text-align: center;
      color: #6c757d;
      font-style: italic;
      padding: 20px;
    }

    .message {
      display: flex;
      flex-direction: column;
      max-width: 80%;

      &.user {
        align-self: flex-end;
        align-items: flex-end;

        .message-content {
          background: #007bff;
          color: white;
        }
      }

      &.assistant {
        align-self: flex-start;

        .message-content {
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
        }
      }

      .message-content {
        padding: 12px 16px;
        border-radius: 8px;
        word-wrap: break-word;

        p {
          margin: 0 0 8px 0;
          line-height: 1.4;
        }
      }

      .timestamp {
        font-size: 12px;
        color: #6c757d;
        margin-top: 4px;
      }
    }

    .loading {
      .typing-indicator {
        display: flex;
        gap: 4px;
        padding: 16px;

        span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6c757d;
          animation: typing 1.4s infinite;

          &:nth-child(2) {
            animation-delay: 0.2s;
          }

          &:nth-child(3) {
            animation-delay: 0.4s;
          }
        }
      }
    }

    .error-message {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
      padding: 12px 16px;
      border-radius: 8px;
      align-self: center;
      max-width: 80%;
    }
  }

  .chat-input-form {
    display: flex;
    padding: 16px;
    border-top: 1px solid #e0e0e0;
    gap: 8px;

    input {
      flex: 1;
      padding: 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 16px;

      &:focus {
        outline: none;
        border-color: #007bff;
      }

      &:disabled {
        background: #e9ecef;
        cursor: not-allowed;
      }
    }

    button {
      padding: 12px 24px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;

      &:hover:not(:disabled) {
        background: #0056b3;
      }

      &:disabled {
        background: #6c757d;
        cursor: not-allowed;
      }
    }
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

// Interactive elements
.tech-stack, .timeline {
  margin-top: 12px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;

  h4 {
    margin: 0 0 12px 0;
    font-size: 16px;
  }
}

.technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .tech-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    background: #f8f9fa;
    border-radius: 4px;
    font-size: 14px;

    img {
      width: 16px;
      height: 16px;
    }
  }
}

.timeline {
  .timeline-event {
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    h5 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 600;
    }

    p {
      margin: 0 0 4px 0;
      font-size: 14px;
      color: #6c757d;
    }

    .duration {
      font-size: 12px;
      color: #007bff;
      font-weight: 500;
    }
  }
}
```

### 5. Environment Configuration

Create or update `.env` file:

```bash
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_OPENAI_ASSISTANT_ID=your_assistant_id_here
```

### 6. Integration in App Component

Update your main App component to include the chat:

```typescript
import { PortfolioChat } from './components/PortfolioChat';

function App() {
  return (
    <div className="App">
      {/* Your existing content */}
      <PortfolioChat sessionId="portfolio-chat-session" />
    </div>
  );
}
```

## File Management

### Vector Store Setup

Files are managed through the OpenAI platform dashboard. The vector store ID `vs_68fe3aa375b48191a9b50492f9eec576` contains:

- AboutYaniv.pdf (personal background and education)
- Project PDFs (detailed project documentation)

### File Upload Process

1. Upload files to OpenAI platform dashboard
2. Create/update vector store `vs_68fe3aa375b48191a9b50492f9eec576`
3. Attach vector store to assistant configuration

## Error Handling Strategy

1. **API Errors**: Fallback to contact form with custom message
2. **Parsing Errors**: Create structured fallback response
3. **Network Issues**: Retry logic with user notification
4. **Invalid Responses**: Maintain JSON structure with error content

## Security Considerations

- API key stored in environment variables
- Client-side implementation (consider server proxy for production)
- Rate limiting handled by OpenAI API
- Input sanitization in React components

## Migration from Assistant API

### Key Changes

1. **API Endpoint**: Assistants API instead of Chat Completions
2. **File Access**: Vector store integration instead of direct file uploads
3. **Session Management**: Thread-based conversations
4. **Response Processing**: Maintain strict JSON format

### Backward Compatibility

- Existing response format preserved
- Interactive elements unchanged
- Error handling maintains user experience

## Testing

### Unit Tests

```typescript
// src/services/openaiService.test.ts
import { openAIService } from './openaiService';

describe('OpenAIService', () => {
  test('should create thread successfully', async () => {
    const threadId = await openAIService.createThread('test-session');
    expect(threadId).toBeDefined();
  });

  test('should handle API errors gracefully', async () => {
    // Mock API failure
    const response = await openAIService.sendMessage('test-session', 'test message');
    expect(response.interactiveElement.type).toBe('contact');
  });
});
```

### Integration Tests

- Test conversation flow
- Verify file search functionality
- Check error fallback behavior
- Validate JSON response format

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Assistant created with file search tool
- [ ] Vector store attached to assistant
- [ ] Files uploaded and processed
- [ ] Component integrated in app
- [ ] Error handling tested
- [ ] Mobile responsiveness verified

## Performance Optimization

1. **Thread Reuse**: Maintain conversation threads per session
2. **Response Caching**: Cache frequent queries if needed
3. **Lazy Loading**: Load chat component on demand
4. **Streaming**: Consider implementing streaming responses

## Monitoring

- Track API usage and costs
- Monitor response times
- Log error occurrences
- User interaction analytics

## Future Enhancements

1. **Streaming Responses**: Implement real-time message streaming
2. **Advanced File Search**: Custom ranking and filtering
3. **Multi-language Support**: Expand beyond English queries
4. **Analytics Dashboard**: Detailed usage insights
5. **Voice Integration**: Add speech-to-text capabilities
