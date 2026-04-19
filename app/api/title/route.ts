import { openai } from "../../lib/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Generate a short title (max 5 words) for a chat that starts with: ${message}. Return only the title, nothing else.`,
  });

  return Response.json({ title: text ?? "Untitled Chat" });
}