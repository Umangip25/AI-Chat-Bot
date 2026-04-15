import { openai } from "../../lib/openai";

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return Response.json(
      { error: "Message is required" },
      { status: 400 }
    );
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Generate a short title for: ${message}`,
      },
    ],
  });

  return Response.json({
    title: completion.choices[0]?.message?.content ?? "Untitled Chat",
  });
}