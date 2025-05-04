// app/api/CreateMedicalRecords/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { encrypt } from "@/utils/encryption";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { patient_id, doctor_id, visit_date, plain_text_data } = await req.json();

  // encrypt...
  const encrypted = encrypt(plain_text_data);
  const encryptedDataId = uuidv4();
  const recordId = uuidv4();

  const { error: encErr } = await supabase
    .from("encrypted_data")
    .insert({ id: encryptedDataId, data: encrypted });

  if (encErr) return NextResponse.json({ error: encErr.message }, { status: 500 });

  const { error: recordErr } = await supabase
    .from("medical_records")
    .insert({
      id: recordId,
      patient_id,
      doctor_id,
      visit_date,
      encrypted_data_id: encryptedDataId,
    });

  if (recordErr) return NextResponse.json({ error: recordErr.message }, { status: 500 });

  return NextResponse.json({ success: true }, { status: 201 });
}
