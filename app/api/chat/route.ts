import { openai } from "../../lib/openai";
import { streamText } from "ai";

// Simple keyword-based intent detection. In a real app, you'd want something more robust.
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

// Extract city name from weather-related queries using regex and heuristics
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

  // Basic input sanitization to prevent abuse
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

// Main API route handler for chat messages
export async function POST(req: Request) {
  const { messages } = await req.json();

  const lastMessage = messages[messages.length - 1]?.content?.toString() || "";
  const intent = detectIntent(lastMessage);

  // Handle weather intent separately with API integration
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
            content: "Please tell me which city you'd like the weather for!",
          },
        ],
      });
      return result.toTextStreamResponse();
    }

    // Fetch weather data
    const weather = await getWeather(city);

    // If we couldn't get weather data, respond with a polite message
    if (!weather) {
      const result = await streamText({
        model: openai("gpt-4o-mini"),
        messages: [
          { role: "system", content: "You are a helpful weather assistant." },
          {
            role: "user",
            content: `I couldn't get weather data for "${city}". Tell the user politely and suggest they try a full city name like "San Jose" or "New York".`,
          },
        ],
      });
      return result.toTextStreamResponse();
    }

    const formattedContent = `🌍 City: ${weather.city}
                              🌡 Temperature: ${weather.temp}°C
                              🤔 Feels like: ${weather.feels_like}°C
                              ☁️ Condition: ${weather.description}
                              💧 Humidity: ${weather.humidity}%
                              💨 Wind: ${weather.wind} m/s`;

    // Format and return the weather data in a user-friendly way using the AI model
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content:
            "You are a weather assistant. Format weather data clearly with emojis. Be concise and friendly.",
        },
        {
          role: "user",
          content: formattedContent,
        },
      ],
    });

    return result.toTextStreamResponse();
  }

  // For other intents, adjust the system prompt to guide the AI's response style
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

  //formattedContent
  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  });

  // Return the AI's response as a streaming response for better UX
  return result.toTextStreamResponse();
}
