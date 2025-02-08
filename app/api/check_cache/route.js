import { Index } from "@upstash/vector";



export async function POST(req) {
  const index = new Index({
    url: "",
    token: ""
  })

  try{
    const results = await index.query({
      data: req.body.query,
      topK: 1
    })
  }catch(e){
    console.error(e)
  }
}
