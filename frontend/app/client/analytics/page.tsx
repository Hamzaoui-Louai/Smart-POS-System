"use client"

import { useState } from "react"
import { Calendar, MapPin, Package, DollarSign, Filter, Download, Search } from "lucide-react"
import { ClientLayout } from "@/components/client-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AnalyticsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPeriod, setFilterPeriod] = useState("all")

  const purchaseHistory = [
    {
      id: "PH001",
      medication: "Paracetamol 500mg",
      pharmacy: "HealthPlus Pharmacy",
      date: "2024-01-15",
      quantity: "30 tablets",
      price: "$12.99",
      status: "Completed",
      prescriptionId: "RX-2024-001",
    },
    {
      id: "PH002",
      medication: "Ibuprofen 400mg",
      pharmacy: "MediCare Central",
      date: "2024-01-10",
      quantity: "20 tablets",
      price: "$8.50",
      status: "Completed",
      prescriptionId: "RX-2024-002",
    },
    {
      id: "PH003",
      medication: "Vitamin D3 1000IU",
      pharmacy: "Wellness Pharmacy",
      date: "2023-12-28",
      quantity: "60 capsules",
      price: "$15.75",
      status: "Completed",
      prescriptionId: "RX-2023-089",
    },
    {
      id: "PH004",
      medication: "Amoxicillin 500mg",
      pharmacy: "HealthPlus Pharmacy",
      date: "2023-12-15",
      quantity: "21 capsules",
      price: "$22.30",
      status: "Completed",
      prescriptionId: "RX-2023-076",
    },
    {
      id: "PH005",
      medication: "Loratadine 10mg",
      pharmacy: "City Health Store",
      date: "2023-11-30",
      quantity: "30 tablets",
      price: "$9.99",
      status: "Completed",
      prescriptionId: "RX-2023-065",
    },
  ]

  const filteredHistory = purchaseHistory.filter((item) => {
    const matchesSearch =
      item.medication.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pharmacy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prescriptionId.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterPeriod === "all") return matchesSearch

    const itemDate = new Date(item.date)
    const now = new Date()

    if (filterPeriod === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(now.getMonth() - 1)
      return matchesSearch && itemDate >= monthAgo
    }

    if (filterPeriod === "quarter") {
      const quarterAgo = new Date()
      quarterAgo.setMonth(now.getMonth() - 3)
      return matchesSearch && itemDate >= quarterAgo
    }

    return matchesSearch
  })

  return (
    <ClientLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="animate-fade-in">
          <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">Analytics & Logs</h1>
          <p className="text-gray-600">Track your medication history and purchase records</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Purchases</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{purchaseHistory.length}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Unique Medications</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {new Set(purchaseHistory.map((item) => item.medication)).size}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pharmacies Visited</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {new Set(purchaseHistory.map((item) => item.pharmacy)).size}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    $
                    {purchaseHistory
                      .reduce((sum, item) => sum + Number.parseFloat(item.price.replace("$", "")), 0)
                      .toFixed(2)}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase History */}
        <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="font-heading text-xl">Purchase History</CardTitle>
              <p className="text-sm text-gray-600">Complete record of your medication purchases</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search medications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-[140px]">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <SelectValue placeholder="Filter by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Medication</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Pharmacy</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Quantity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-gray-50 ${index !== filteredHistory.length - 1 ? "border-b border-gray-100" : ""}`}
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{item.medication}</p>
                            <p className="text-xs text-gray-500">ID: {item.prescriptionId}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{item.pharmacy}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{item.quantity}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">{item.price}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        No purchase history found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  )
}
