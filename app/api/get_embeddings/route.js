import "dotenv/config";

export async function POST(req) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "Invalid query" }), {
        status: 400,
      });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/BAAI/bge-base-en-v1.5",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: query }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ embedding: data }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching embeddings:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
