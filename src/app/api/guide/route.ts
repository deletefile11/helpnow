import { NextResponse } from 'next/server';

// API endpoints
const CEREBRAS_API_ENDPOINT = 'https://api.cerebras.ai/v1/chat/completions';

// Helper function to generate image URLs
function generateImageUrl(instruction: string, index: number): string {
  // Create a simple, clear prompt for first aid illustrations
  const imagePrompt = `first aid ${instruction.split(' ').slice(0, 8).join(' ')} medical diagram illustration`;
  const encodedPrompt = encodeURIComponent(imagePrompt);
  
  // Use the correct Pollinations.ai API format
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=400&height=300&nologo=true&seed=${Date.now() + index}`;
}

// This is the main handler for POST requests to /api/guide
export async function POST(request: Request) {
  try {
    // 1. Get the user's query from the frontend request
    const body = await request.json();
    const userQuery = body.query;

    if (!userQuery) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // 2. Construct a detailed prompt for the Cerebras model.
    const prompt = `
      You are a first-aid assistant. A user is in an emergency and said: "${userQuery}".
      Your task is to provide a clear, step-by-step guide for this emergency.
      Respond with ONLY a valid JSON object in the following format, with no other text or explanations.
      {
        "title": "Name of the Emergency",
        "steps": [
          { "instruction": "First step...", "type": "action" },
          { "instruction": "Second step with a warning...", "type": "warning" },
          { "instruction": "Third step with info...", "type": "info" }
        ]
      }
      The "type" must be one of 'action', 'warning', or 'info'.
      If the query is not a real emergency, respond with a title like "Not a Medical Emergency" and provide a single, polite step.
      Keep instructions concise and clear for audio narration.
    `;

    // 3. Call the Cerebras API directly using fetch
    const cerebrasResponse = await fetch(CEREBRAS_API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CEREBRAS_API_KEY}`
        },
        body: JSON.stringify({
            messages: [{ role: 'user', content: prompt }],
            model: 'qwen-3-235b-a22b-instruct-2507',
        })
    });

    if (!cerebrasResponse.ok) {
        const errorData = await cerebrasResponse.text();
        console.error("Cerebras API Error:", errorData);
        throw new Error(`Cerebras API request failed with status ${cerebrasResponse.status}`);
    }

    const completion = await cerebrasResponse.json();
    const llmResponseText = completion.choices[0].message.content;

    if (!llmResponseText) {
        throw new Error("The AI returned an empty response.");
    }

    // 4. Parse the AI's response text into a JSON object.
    let scenario;
    try {
      const cleanedResponse = llmResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
      scenario = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse JSON from LLM response:", llmResponseText);
      throw new Error("The AI returned an invalid response format.");
    }
    
    // --- FIXED: Ensure image URLs are definitely added to each step ---
    if (scenario.steps && Array.isArray(scenario.steps)) {
        scenario.steps = scenario.steps.map((step: any, index: number) => {
            // Generate image URL
            const visualUrl = generateImageUrl(step.instruction, index);
            
            // Alternative URLs as fallbacks
            const alternativeUrls = [
                `https://image.pollinations.ai/prompt/${encodeURIComponent('first aid medical diagram')}?width=400&height=300&nologo=true`,
                `https://via.placeholder.com/400x300/f8f9fa/6c757d?text=${encodeURIComponent('First Aid Step ' + (index + 1))}`
            ];
            
            console.log(`Generated image URL for step ${index + 1}:`, visualUrl); // Debug log
            
            return { 
                ...step, 
                visualUrl,
                alternativeUrls
            };
        });
    }

    console.log('Final scenario with image URLs:', JSON.stringify(scenario, null, 2)); // Debug log

    // 5. Return the structured JSON response to the frontend
    return NextResponse.json(scenario);

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to get a response from the AI.',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}