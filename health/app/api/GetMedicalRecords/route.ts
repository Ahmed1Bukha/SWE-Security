import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { decrypt } from "@/utils/encryption";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const userResult = await supabase.auth.getUser();

  const user = userResult.data?.user;
  const userError = userResult.error;

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;

  const { data, error } = await supabase
    .from("medical_records")
    .select(
      `
      id,
      patient_id,
      doctor_id,
      visit_date,
      encrypted_data_id,
      encrypted_data (
        data
      )
    `
    )
    .eq("patient_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const decryptedRecords = data.map((record) => {
    const decrypted = decrypt(record.encrypted_data[0].data);
    return {
      ...record,
      decrypted_data: decrypted,
    };
  });

  return NextResponse.json(decryptedRecords, { status: 200 });
}
