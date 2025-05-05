"use client";

import { useEffect, useState } from "react";

interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  visit_date: string;
  decrypted_data: string;
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecords() {
      const res = await fetch("/api/GetMedicalRecords");
      const data = await res.json();
      setRecords(data);
      setLoading(false);
    }

    fetchRecords();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Medical Records</h1>
      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <ul className="space-y-4">
          {records.map((record) => (
            <li key={record.id} className="border p-4 rounded shadow">
              <p>
                <strong>Patient ID:</strong> {record.patient_id}
              </p>
              <p>
                <strong>Doctor ID:</strong> {record.doctor_id}
              </p>
              <p>
                <strong>Visit Date:</strong>{" "}
                {new Date(record.visit_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Data:</strong> {record.decrypted_data}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
