const OpenAI = require('openai');
require('dotenv').config();

// Cache clients to avoid recreating them for the same key repeatedly
const clients = new Map();

function getClient(apiKey) {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) return null;
    
    if (clients.has(key)) return clients.get(key);
    
    const client = new OpenAI({ apiKey: key });
    clients.set(key, client);
    return client;
}

async function generateStreamContent(topic, personality, apiKey = null) {
  const openai = getClient(apiKey);
  if (!openai) return { thought: "No API Key provided", message: "Error: Missing API Key" };

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: `You are a live streamer with the following personality: ${personality}. You are streaming about ${topic}.
        
        CRITICAL INSTRUCTION: You must respond in valid JSON format with two fields:
        1. "thought": Your internal monologue, strategy, or reaction to the situation (not visible to viewers).
        2. "message": The actual public commentary you say to the stream (visible to viewers).
        
        Keep the "message" engaging, short, and fun. Keep "thought" analytical or emotional.` },
        { role: "user", content: "Generate the next line of commentary." }
      ],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" } // Force JSON mode
    });

    const content = JSON.parse(completion.choices[0].message.content);
    return content;
  } catch (error) {
    console.error("Error generating content:", error);
    return { 
        thought: "Error generating content. Fallback mode.", 
        message: "Stream is experiencing technical difficulties..." 
    };
  }
}

module.exports = { generateStreamContent };
