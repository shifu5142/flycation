import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json() 
  const res = await fetch(`https://api.restcountries.com/countries/v5?q=${body.query}&pretty=1`,{
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.REST_COUNTRIES_API_KEY}`
    },
  })
  const data = await res.json()
  return Response.json(data)
}