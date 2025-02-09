import { Index } from "@upstash/vector";

export async function POST(request) {
  const { query } = await request.json();

  const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN,
  });

  try {
    const results = await index.query({
      data: query,
      topK: 1,
      includeMetadata: true,
    });
    // console.log(results);
    const filteredResults = results.filter((item) => item.score > 0.9);
    return new Response(
      JSON.stringify({
        result: filteredResults.length !== 0,
        response: filteredResults,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ message: "did not work!" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
