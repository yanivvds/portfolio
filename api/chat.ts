// Vercel serverless function types
interface VercelRequest {
  method?: string;
  body: any;
  query: { [key: string]: string | string[] };
  headers: { [key: string]: string };
}

// Global fetch declaration for Vercel
declare const fetch: any;

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (object: any) => VercelResponse;
  send: (body: any) => VercelResponse;
  setHeader: (name: string, value: string) => VercelResponse;
}

// CORS headers for Vercel
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🔥 API Handler called');
  console.log('📨 Request method:', req.method);
  console.log('📨 Request headers:', JSON.stringify(req.headers, null, 2));
  console.log('📨 Request body keys:', req.body ? Object.keys(req.body) : 'No body');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('🔄 Handling CORS preflight request');
    return res.status(200).json({});
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('✅ Starting API request processing');
  try {
    const { message, projectContext } = req.body;

    console.log('📝 Extracted from body:', { message: message?.substring(0, 100) + '...', projectContext });
    console.log('🔑 OPENAI_API_KEY available:', !!process.env.OPENAI_API_KEY);
    console.log('🔑 OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length);

    if (!message) {
      console.log('❌ No message provided in request body');
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('✅ Message validation passed');

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

or explicitly use the 
"interactiveElement": {
  "type": "none",
  "content": "",
  "metadata": {}
}

**Important enforcement rules:**
- Never wrap JSON in code blocks.
- Dont provide information that is not related to Yaniv or his projects (which are in the pdf files)
- If youre not sure about an answer, tell the user you can't answer it but that he can always contact Yaniv personally (and than show the contact cards visualization)

## INTERACTIVE ELEMENT TYPES

### Interactive Element Types Available:
1. **contact** - Contact Information (show when users ask about contacting Yaniv)
2. **tech_stack** - Technology Stack (show when discussing technologies/tools)
3. **timeline** - Project Timeline (show when discussing project phases/milestones)
4. **code_snippet** - Code Examples (show when discussing technical implementations)
5. **feature_highlight** - Feature Showcase (show when discussing specific features)
6. **architecture** - System Architecture (show when discussing system design)
7. **metrics** - Performance/Analytics (show when discussing performance/outcomes)
8. **demo** - Live Demo/Preview (show when users want to see projects in action)
9. **skills** - Skills & Expertise (show when discussing Yaniv's skills/expertise)

Always choose the most relevant interactive element type based on the user's question and context.
`;

    console.log('🤖 Making request to OpenAI Responses API...');
    console.log('🔧 Request headers:', {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY ? 'Bearer ***' + process.env.OPENAI_API_KEY.slice(-4) : 'MISSING'}`,
      'Content-Type': 'application/json'
    });

    // Use Responses API with file search
    const userContent = projectContext
      ? `About the ${projectContext} project: ${message}`
      : message;

    const responsesRequestBody = {
      model: "gpt-5-mini",
      instructions: systemPrompt,
      input: userContent,
      tools: [{
        type: "file_search",
        vector_store_ids: ["vs_68fe3aa375b48191a9b50492f9eec576"]
      }],
      max_output_tokens: 5000
    };

    console.log('📤 Request body structure:', {
      model: responsesRequestBody.model,
      inputLength: responsesRequestBody.input.length,
      tools: responsesRequestBody.tools.length
    });

    console.log('🌐 Initiating fetch to OpenAI Responses API...');
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(responsesRequestBody)
    });

    console.log('📥 OpenAI response status:', response.status);
    console.log('📥 OpenAI response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API Error:', errorText);
      console.error('❌ Response status:', response.status);
      console.error('❌ Response headers:', Object.fromEntries(response.headers.entries()));

      // Return error response instead of falling back
      return res.status(500).json({
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
              },
              {
                id: "github",
                title: "GitHub",
                subtitle: "Check out my code",
                value: "@yanivvds",
                link: "https://github.com/yanivvds"
              }
            ]
          }
        }
      });
    }

    console.log('📦 Parsing OpenAI Responses API response...');
    const data = await response.json();
    console.log('✅ OpenAI Responses API response received successfully');
    console.log('📊 Response data keys:', Object.keys(data));
    console.log('📊 Output field:', JSON.stringify(data.output, null, 2));

    // Extract the content from the output array
    let content = '';
    if (data.output && Array.isArray(data.output)) {
      // Find the message item in the output array
      const messageItem = data.output.find((item: any) => item.type === 'message');
      if (messageItem && messageItem.content && messageItem.content[0]) {
        content = messageItem.content[0].text || '';
      }
    }
    console.log('💬 Raw content length:', content.length);
    console.log('💬 Raw content preview:', content.substring(0, 200) + '...');

    try {
      console.log('🔄 Attempting to parse JSON response...');
      const parsedResponse = JSON.parse(content);
      console.log('✅ JSON parsing successful');
      console.log('📋 Parsed response keys:', Object.keys(parsedResponse));
      return res.status(200).json(parsedResponse);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:', parseError);
      console.error('❌ Raw content that failed to parse:', content);

      // Return fallback response
      return res.status(200).json({
        response: content || "I received your message but had trouble formatting my response. Please try again.",
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
              },
              {
                id: "linkedin",
                title: "LinkedIn",
                subtitle: "Let's connect",
                value: "/in/yanivvds",
                link: "https://www.linkedin.com/in/yanivvds/"
              },
              {
                id: "github",
                title: "GitHub",
                subtitle: "Check out my code",
                value: "@yanivvds",
                link: "https://github.com/yanivvds"
              }
            ]
          }
        }
      });
    }

  } catch (error) {
    console.error('🚨 CRITICAL API ERROR - Handler failed completely');
    console.error('🚨 Error type:', typeof error);
    console.error('🚨 Error value:', error);

    const errorDetails = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : {
      message: 'Unknown error',
      stack: undefined,
      name: 'UnknownError'
    };
    console.error('🚨 Error details:', errorDetails);

    // Log additional context
    console.error('🚨 Process environment check:');
    console.error('🚨 - OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
    console.error('🚨 - NODE_ENV:', process.env.NODE_ENV);
    console.error('🚨 - Current working directory:', process.cwd());

    return res.status(500).json({
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
            },
            {
              id: "github",
              title: "GitHub",
              subtitle: "Check out my code",
              value: "@yanivvds",
              link: "https://github.com/yanivvds"
            }
          ]
        }
      }
    });
  }
}

