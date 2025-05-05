"use client"

import { useState } from "react"
import { FileText, Lock, Search, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data
const medicalRecords = [
  {
    id: "REC-001",
    date: "2023-04-15",
    type: "General Checkup",
    doctor: "Dr. Sarah Johnson",
    status: "Completed",
  },
  {
    id: "REC-002",
    date: "2023-06-22",
    type: "Blood Test",
    doctor: "Dr. Michael Chen",
    status: "Completed",
  },
  {
    id: "REC-003",
    date: "2023-08-10",
    type: "X-Ray",
    doctor: "Dr. Emily Rodriguez",
    status: "Completed",
  },
  {
    id: "REC-004",
    date: "2023-11-05",
    type: "Vaccination",
    doctor: "Dr. James Wilson",
    status: "Completed",
  },
  {
    id: "REC-005",
    date: "2024-01-18",
    type: "Dental Checkup",
    doctor: "Dr. Lisa Thompson",
    status: "Completed",
  },
]

export default function MedicalRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null)

  const filteredRecords = medicalRecords.filter(
    (record) =>
      record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date.includes(searchTerm),
  )

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-teal-700">Medical Records</h1>
          <p className="text-muted-foreground">View and manage your medical history</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search records..."
              className="w-full pl-8 md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-teal-100 bg-teal-50 p-4 mb-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-teal-600" />
          <div>
            <h3 className="text-sm font-medium text-teal-700">Encrypted Medical Records</h3>
            <p className="mt-1 text-xs text-gray-600">
              Your medical records are encrypted for secure viewing. Only authorized personnel can access your complete
              records.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="lab">Lab Results</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Medical History</CardTitle>
              <CardDescription>Complete list of your medical records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Record ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.id}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.type}</TableCell>
                        <TableCell>{record.doctor}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {record.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRecord(record.id)}
                            className="h-8 text-teal-600 hover:text-teal-700"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {selectedRecord && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Record Details</CardTitle>
                    <CardDescription>Record ID: {selectedRecord}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800">
                    <Lock className="h-3 w-3" />
                    Encrypted
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This record is encrypted and securely stored. Only authorized personnel can view the complete
                    details.
                  </p>
                  <div className="rounded-md bg-gray-50 p-4">
                    <p className="text-sm font-medium">Record Summary</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {medicalRecords.find((r) => r.id === selectedRecord)?.type} on{" "}
                      {medicalRecords.find((r) => r.id === selectedRecord)?.date} with{" "}
                      {medicalRecords.find((r) => r.id === selectedRecord)?.doctor}.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Records</CardTitle>
              <CardDescription>Your most recent medical records</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Showing records from the last 3 months.</p>
              {/* Recent records content would go here */}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="lab">
          <Card>
            <CardHeader>
              <CardTitle>Lab Results</CardTitle>
              <CardDescription>Your laboratory test results</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">All your laboratory test results in one place.</p>
              {/* Lab results content would go here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
