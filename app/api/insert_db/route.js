import { Index } from "@upstash/vector";

export default async function POST(request){
    const index = new Index({
        url: process.env.UPSTASH_VECTOR_REST_URL,
        token: process.env.UPSTASH_VECTOR_REST_TOKEN
    })

    try{
        
    }catch(error){

    }
}