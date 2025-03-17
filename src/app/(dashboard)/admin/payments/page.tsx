"use client"

import * as React from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Badge } from "@/shared/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Download, Filter, Search } from "lucide-react"

const transactions = [
  {
    id: "INV-001",
    date: "2024-02-25",
    description: "Professional Plan - Monthly",
    amount: 99.0,
    status: "paid",
    type: "subscription",
  },
  {
    id: "INV-002",
    date: "2024-02-24",
    description: "Property Listing Fee - 123 Main St",
    amount: 49.99,
    status: "pending",
    type: "listing",
  },
  {
    id: "INV-003",
    date: "2024-02-23",
    description: "Agent Commission - Sarah Johnson",
    amount: 1250.0,
    status: "paid",
    type: "commission",
  },
  {
    id: "INV-004",
    date: "2024-02-22",
    description: "Featured Listing - 456 Oak Ave",
    amount: 29.99,
    status: "failed",
    type: "listing",
  },
  {
    id: "INV-005",
    date: "2024-02-21",
    description: "Professional Plan - Monthly",
    amount: 99.0,
    status: "paid",
    type: "subscription",
  },
]

const statusColors = {
  paid: "bg-green-500",
  pending: "bg-yellow-500",
  failed: "bg-red-500",
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [typeFilter, setTypeFilter] = React.useState("all")

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
      const matchesType = typeFilter === "all" || transaction.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [searchQuery, statusFilter, typeFilter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments & Invoices</h1>
          <p className="text-muted-foreground">Manage your payments and view invoices</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
              <SelectItem value="listing">Listing</SelectItem>
              <SelectItem value="commission">Commission</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    <div
                      className={`mr-1.5 h-2 w-2 rounded-full inline-block ${statusColors[transaction.status as keyof typeof statusColors]}`}
                    />
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">{transaction.type}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    View Invoice
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

