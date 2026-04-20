import { openai } from "../../lib/openai";
import { streamText } from "ai";

// Simple intent detection based on keywords
function detectIntent(text: string) {
  const t = text.toLowerCase();
  if (t.includes("weather")) return "weather";
  if (t.includes("joke")) return "joke";
  if (t.includes("calculate") || /[0-9+\-*/]/.test(t)) return "math";
  if (t.includes("code") || t.includes("react") || t.includes("function"))
    return "code";
  if (t.includes("advice") || t.includes("help me")) return "advice";
  return "general";
}

// Extract city name for weather intent using regex and cleanup
function extractCity(text: string): string | null {
  const match = text.match(
    /weather\s+(?:in|at|for)\s+([a-zA-Z\s,]+?)(?:\?|$|\s+right now|\s+currently|\s+now)/i,
  );
  if (match) return match[1].trim();

  const cleaned = text
    .toLowerCase()
    .replace(/what(?:'s| is) the weather/gi, "")
    .replace(/weather\s*(in|at|for)?/gi, "")
    .replace(/right now|currently|now|today|[?.!,]/g, "")
    .trim();

  return cleaned.length > 0 ? cleaned : null;
}

// Fetch weather data from OpenWeatherMap API
async function getWeather(city: string) {
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    console.error("Missing WEATHER_API_KEY");
    return null;
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city.trim(),
      )}&units=metric&appid=${apiKey}`,
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("Weather API error:", err);
      return null;
    }

    const data = await res.json();

    // Map API response to our weather format
    return {
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      city: `${data.name}, ${data.sys.country}`,
      humidity: data.main.humidity,
      wind: data.wind.speed,
    };
  } catch (err) {
    console.error("Weather fetch error:", err);
    return null;
  }
}

export async function POST(req: Request) {
  const { messages, file } = await req.json();

  const lastMessage = messages[messages.length - 1]?.content?.toString() || "";

  const intent = detectIntent(lastMessage);

  // ————— FILE HANDLING —————
  if (file) {
    const systemPrompt =
      "You are a helpful assistant that analyzes documents and images. " +
      "First provide a clear concise summary, then invite the user to ask questions about it.";

    if (file.type === "image") {
      // Use gpt-4o for vision — gpt-4o-mini does not support images
      const result = await streamText({
        model: openai("gpt-4o"),
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "image",
                image: Buffer.from(file.content, "base64"),
                mimeType: file.mimeType,
              },
              {
                type: "text",
                text: lastMessage.includes(`[Attached: ${file.name}]`)
                  ? "Please summarize this image and describe what you see in detail."
                  : lastMessage.replace(`\n\n[Attached: ${file.name}]`, "").trim(),
              },
            ],
          },
        ],
      });

      return result.toTextStreamResponse();
    }

    // PDF or DOCX — gpt-4o-mini is fine for text
    const userQuestion = lastMessage
      .replace(`[Attached: ${file.name}]`, "")
      .trim();

    const userContent =
      `Here is the content of the document "${file.name}":\n\n${file.content}\n\n` +
      (userQuestion || "Please provide a concise summary of this document.");

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
    });

    return result.toTextStreamResponse();
  }

  // ————— WEATHER INTENT —————
  if (intent === "weather") {
    const city = extractCity(lastMessage);

    if (!city) {
      const result = await streamText({
        model: openai("gpt-4o-mini"),
        messages: [
          { role: "system", content: "You are a helpful weather assistant." },
          { role: "user", content: lastMessage },
          {
            role: "assistant",
            content: "Tell me the city you want weather for.",
          },
        ],
      });

      return result.toTextStreamResponse();
    }

    const weather = await getWeather(city);

    if (!weather) {
      const result = await streamText({
        model: openai("gpt-4o-mini"),
        messages: [
          { role: "system", content: "You are a helpful weather assistant." },
          {
            role: "user",
            content: `Couldn't fetch weather for "${city}". Ask user to try a full city name.`,
          },
        ],
      });

      return result.toTextStreamResponse();
    }

    // Format the weather data into a user-friendly response
    const formattedContent = [
      `🌤️ ${weather.city} Weather`,
      `🌡️ Temperature: ${weather.temp}°C`,
      `🤔 Feels Like: ${weather.feels_like}°C`,
      `☁️ Condition: ${weather.description}`,
      `💧 Humidity: ${weather.humidity}%`,
      `💨 Wind: ${weather.wind} m/s`,
      ``,
      `Enjoy your day! ☀️`,
    ].join("\n");

    // Return the formatted weather response as a stream
    return new Response(formattedContent);
  }

  let systemPrompt = "You are a helpful assistant.";

  if (intent === "joke") {
    systemPrompt = "You are a funny assistant. Respond with short jokes only.";
  }
  if (intent === "math") {
    systemPrompt =
      "You are a math tutor. Solve step by step clearly and correctly.";
  }
  if (intent === "code") {
    systemPrompt =
      "You are a senior frontend engineer. Write clean JavaScript/React code.";
  }
  if (intent === "advice") {
    systemPrompt = "You give simple, practical life advice. No long speeches.";
  }

  // For general intent, the default system prompt is used.
  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  });

  return result.toTextStreamResponse();
}