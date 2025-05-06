import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  
  // Get user ID from URL query parameters
  const url = new URL(req.url);


  // Validate user ID
  

  // Fetch the user's role from the database
  const currentUser = await supabase.auth.getUser()
  const userId = currentUser.data.user?.id;
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ role: data.role }, { status: 200 });
}