import { openai } from "../../lib/openai";

// API route handler for POST requests to /api/title
export async function POST(req: Request) {
  const { message } = await req.json();

  // Create a chat completion using the OpenAI API
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Generate a short title for: ${message}`,
      },
    ],
  });

  // Return the generated title as a JSON response
  return Response.json({
    title: completion.choices[0].message.content,
  });
}