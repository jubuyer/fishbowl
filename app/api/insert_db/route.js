import { NextResponse } from "next/server";
import { Index } from "@upstash/vector";

export async function POST(req) {
  const { query, response, embeddingVector } = await req.json();
  //   console.log(`query: ${query}`);
  //   console.log(`response: ${response}`);
  try {
    const index = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN,
    });

    await index.upsert([
      {
        id: "unique-" + Date.now(),
        vector: embeddingVector,
        metadata: {
          query: query,
          response: response,
        },
      },
    ]);

    return NextResponse.json(
      { message: "Successfully upserted!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in upsert-eiffel endpoint:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
