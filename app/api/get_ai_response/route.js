import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { message } = await req.json();
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 1024,
    });

    return new Response(
      JSON.stringify({
        completion: response.choices[0]?.message?.content || "",
      }),
      {}
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error generating chat completion" }),
      { status: 500 }
    );
  }
}
