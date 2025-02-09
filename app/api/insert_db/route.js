import { NextResponse } from "next/server";
import { Index } from "@upstash/vector";

export async function POST(req) {
  const { query, response, embeddingVector } = await req.json();
  console.log("inserting data");
  try {
    const index = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN,
    });
    const searchResults = await index.query({
      data: query,
      topK: 5,
      includeMetadata: true,
    });

    let foundMatch = null;

    if (
      searchResults?.length > 0 &&
      searchResults[0].metadata?.query === query
    ) {
      foundMatch = searchResults[0];
    }

    if (foundMatch) {
      const existingDocId = foundMatch.id;
      const existingResponses = foundMatch.metadata.response;

      let newResponses = Array.isArray(existingResponses)
        ? existingResponses
        : [existingResponses];

      newResponses.push(response);

      await index.upsert([
        {
          id: existingDocId,
          vector: embeddingVector,
          metadata: {
            query: query,
            response: newResponses,
          },
        },
      ]);
    } else {
      await index.upsert([
        {
          id: "unique-" + Date.now(),
          vector: embeddingVector,
          metadata: {
            query: query,
            response: [response],
          },
        },
      ]);
    }

    return NextResponse.json(
      { message: "Successfully upserted!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in upsert endpoint:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
