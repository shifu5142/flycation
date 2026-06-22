import { supabase } from "@/lib/supabase/client"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const user_id = req.headers.get("user_id")
  if (!user_id) {
    return Response.json({ error: "User ID is required" }, { status: 400 })
  }
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("user_id", user_id)
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json(data)
}   