import { Index } from "@upstash/vector";

export async function POST(request) {
  const {query} = await request.json()

  const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN
  })

  try{
    const results = await index.query({
      data: query,
      topK: 1
    })
    console.log(results)
  }catch(e){
    console.error(e)
  }
}
