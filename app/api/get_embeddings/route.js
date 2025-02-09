import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json(
        { error: "Missing 'query' in request body" },
        { status: 400 }
      );
    }

    const payload = {
      inputs: query,
    };

    const apiKey = process.env.HUGGING_FACE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Hugging Face API key is missing" },
        { status: 500 }
      );
    }

    const hfUrl =
      "https://api-inference.huggingface.co/pipeline/feature-extraction/BAAI/bge-m3";

    const response = await fetch(hfUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Hugging Face API error: ${errorText}` },
        { status: response.status }
      );
    }

    const embedding = await response.json();

    return NextResponse.json({ text: query, embedding }, { status: 200 });
  } catch (error) {
    console.error("Error in bge-embedding endpoint:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
