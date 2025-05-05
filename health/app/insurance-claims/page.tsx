"use client"

import { useState } from "react"
import { FileCheck, FilePlus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data
const insuranceClaims = [
  {
    id: "CLM-001",
    date: "2023-05-20",
    service: "Annual Physical",
    amount: "$250.00",
    status: "Approved",
    provider: "Blue Cross",
  },
  {
    id: "CLM-002",
    date: "2023-07-15",
    service: "Specialist Consultation",
    amount: "$175.00",
    status: "Pending",
    provider: "Aetna",
  },
  {
    id: "CLM-003",
    date: "2023-09-08",
    service: "Laboratory Tests",
    amount: "$320.00",
    status: "Approved",
    provider: "Blue Cross",
  },
  {
    id: "CLM-004",
    date: "2023-11-22",
    service: "Emergency Room Visit",
    amount: "$1,200.00",
    status: "Under Review",
    provider: "United Health",
  },
  {
    id: "CLM-005",
    date: "2024-02-10",
    service: "Prescription Medication",
    amount: "$85.00",
    status: "Approved",
    provider: "Aetna",
  },
]

export default function InsuranceClaimsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredClaims = insuranceClaims.filter(
    (claim) =>
      claim.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.date.includes(searchTerm),
  )

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Under Review":
        return "bg-blue-100 text-blue-800"
      case "Denied":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-teal-700">Insurance Claims</h1>
          <p className="text-muted-foreground">Manage and track your insurance claims</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search claims..."
              className="w-full pl-8 md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700">
            <FilePlus className="mr-2 h-4 w-4" />
            New Claim
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-teal-100 bg-teal-50 p-4 mb-6">
        <div className="flex items-start gap-3">
          <FileCheck className="mt-0.5 h-5 w-5 text-teal-600" />
          <div>
            <h3 className="text-sm font-medium text-teal-700">Digital Signatures</h3>
            <p className="mt-1 text-xs text-gray-600">
              All insurance claims are digitally signed for authenticity and security. This ensures the integrity of
              your claims during processing.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Claims</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Claims History</CardTitle>
              <CardDescription>Complete list of your insurance claims</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClaims.length > 0 ? (
                    filteredClaims.map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell className="font-medium">{claim.id}</TableCell>
                        <TableCell>{claim.date}</TableCell>
                        <TableCell>{claim.service}</TableCell>
                        <TableCell>{claim.amount}</TableCell>
                        <TableCell>{claim.provider}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(
                              claim.status,
                            )}`}
                          >
                            {claim.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 text-teal-600 hover:text-teal-700">
                            <FileCheck className="mr-2 h-4 w-4" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No claims found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Claims</CardTitle>
              <CardDescription>Claims awaiting processing or approval</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                These claims are currently being processed by your insurance provider.
              </p>
              {/* Pending claims content would go here */}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Claims</CardTitle>
              <CardDescription>Successfully processed claims</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                These claims have been approved and processed by your insurance provider.
              </p>
              {/* Approved claims content would go here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
