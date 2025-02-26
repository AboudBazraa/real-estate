"use client"

import * as React from "react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Download, Filter, Search, TrendingUp } from "lucide-react"

const commissions = [
  {
    id: "COM-001",
    agent: "Sarah Johnson",
    property: "123 Main St",
    salePrice: 450000,
    commission: 13500,
    rate: 3,
    status: "paid",
    date: "2024-02-25",
  },
  {
    id: "COM-002",
    agent: "Michael Chen",
    property: "456 Oak Ave",
    salePrice: 375000,
    commission: 11250,
    rate: 3,
    status: "pending",
    date: "2024-02-24",
  },
  {
    id: "COM-003",
    agent: "Emily Rodriguez",
    property: "789 Pine Rd",
    salePrice: 525000,
    commission: 15750,
    rate: 3,
    status: "paid",
    date: "2024-02-23",
  },
  {
    id: "COM-004",
    agent: "David Kim",
    property: "321 Elm St",
    salePrice: 299000,
    commission: 8970,
    rate: 3,
    status: "pending",
    date: "2024-02-22",
  },
]

const stats = [
  {
    title: "Total Commissions",
    value: "$49,470",
    change: "+12.5%",
    changeType: "positive",
  },
  {
    title: "Average Commission",
    value: "$12,367",
    change: "+5.2%",
    changeType: "positive",
  },
  {
    title: "Pending Commissions",
    value: "$20,220",
    change: "-2.3%",
    changeType: "negative",
  },
  {
    title: "Commission Rate",
    value: "3%",
    change: "0%",
    changeType: "neutral",
  },
]

export default function CommissionsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")

  const filteredCommissions = React.useMemo(() => {
    return commissions.filter((commission) => {
      const matchesSearch =
        commission.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        commission.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
        commission.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || commission.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agent Commissions</h1>
          <p className="text-muted-foreground">Track and manage agent commission payments</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.changeType === "positive"
                    ? "text-green-500"
                    : stat.changeType === "negative"
                      ? "text-red-500"
                      : "text-muted-foreground"
                }`}
              >
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search commissions..."
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
              <TableHead>Commission ID</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Sale Price</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCommissions.map((commission) => (
              <TableRow key={commission.id}>
                <TableCell className="font-medium">{commission.id}</TableCell>
                <TableCell>{commission.agent}</TableCell>
                <TableCell>{commission.property}</TableCell>
                <TableCell>${commission.salePrice.toLocaleString()}</TableCell>
                <TableCell>${commission.commission.toLocaleString()}</TableCell>
                <TableCell>{commission.rate}%</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`capitalize ${
                      commission.status === "paid"
                        ? "border-green-500 text-green-500"
                        : "border-yellow-500 text-yellow-500"
                    }`}
                  >
                    {commission.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(commission.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    View Details
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

