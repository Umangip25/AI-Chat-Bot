import OpenAI from "openai";

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// API route handler for POST requests to /api/chat
export async function POST(req: Request) {
  const { messages } = await req.json();

  // Create a chat completion using the OpenAI API
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  // Return the assistant's reply as a JSON response
  return Response.json({
    reply: completion.choices[0].message.content,
  });
}