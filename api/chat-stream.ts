// Vercel serverless function types
interface VercelRequest {
  method?: string;
  body: any;
  query: { [key: string]: string | string[] };
  headers: { [key: string]: string };
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (object: any) => VercelResponse;
  send: (body: any) => VercelResponse;
  write: (chunk: any) => void;
  end: () => void;
  setHeader: (name: string, value: string) => VercelResponse;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).json({});
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, projectContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Set up Server-Sent Events
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

    // System prompt for AI assistant (same as non-streaming version)
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
`;

    // Prepare the request body for OpenAI Responses API with streaming
    const requestBody = {
      model: "gpt-5-nano",
      instructions: systemPrompt,
      input: projectContext
        ? `About the ${projectContext} project: ${message}`
        : message,
      tools: [
        {
          type: "file_search",
          vector_store_ids: ["vs_68fe3aa375b48191a9b50492f9eec576"]
        }
      ],
      stream: true
    };

    console.log('Making streaming request to OpenAI Responses API...');

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', errorText);
      
      // Send error response and close
      res.write('data: {"error": "API request failed"}\n\n');
      return res.end();
    }

    // Handle streaming response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    if (!reader) {
      res.write('data: {"error": "No response stream"}\n\n');
      return res.end();
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              res.write('data: [DONE]\n\n');
              return res.end();
            }

            try {
              const parsed = JSON.parse(data);
              
              // Forward the streaming data to the client
              if (parsed.delta?.content) {
                res.write(`data: ${JSON.stringify({ content: parsed.delta.content })}\n\n`);
              }
              
              // Handle final response
              if (parsed.output_text) {
                try {
                  const finalResponse = JSON.parse(parsed.output_text);
                  res.write(`data: ${JSON.stringify({ final: finalResponse })}\n\n`);
                } catch (parseError) {
                  res.write(`data: ${JSON.stringify({ 
                    final: {
                      response: parsed.output_text || "Response received but couldn't parse format.",
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
                    }
                  })}\n\n`);
                }
                res.write('data: [DONE]\n\n');
                return res.end();
              }
              
            } catch (parseError) {
              console.error('Error parsing streaming data:', parseError);
              continue;
            }
          }
        }
      }
    } catch (streamError) {
      console.error('Streaming error:', streamError);
      res.write(`data: ${JSON.stringify({ error: "Streaming failed" })}\n\n`);
    } finally {
      reader.releaseLock();
      res.end();
    }

  } catch (error) {
    console.error('API Error:', error);
    
    res.write(`data: ${JSON.stringify({
      final: {
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
      }
    })}\n\n`);
    
    res.write('data: [DONE]\n\n');
    res.end();
  }
}
