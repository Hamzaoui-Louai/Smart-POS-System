"use client"

import { useState } from "react"
import { AlertTriangle, Package, Calendar, TrendingDown, Bell, CheckCircle } from "lucide-react"
import { PharmacyOwnerLayout } from "@/components/pharmacy-owner-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface StockAlert {
  id: string
  medicationName: string
  currentStock: number
  threshold: number
  category: string
  expiryDate: string
  priority: "critical" | "low" | "warning"
  lastRestocked: string
  supplier: string
}

export default function StockAlertsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [alerts, setAlerts] = useState<StockAlert[]>([
    {
      id: "SA001",
      medicationName: "Amoxicillin 250mg",
      currentStock: 5,
      threshold: 50,
      category: "Antibiotics",
      expiryDate: "2024-08-30",
      priority: "critical",
      lastRestocked: "2024-01-01",
      supplier: "MedSupply Co.",
    },
    {
      id: "SA002",
      medicationName: "Ibuprofen 400mg",
      currentStock: 25,
      threshold: 100,
      category: "Anti-inflammatory",
      expiryDate: "2024-12-20",
      priority: "low",
      lastRestocked: "2024-01-10",
      supplier: "PharmaCorp",
    },
    {
      id: "SA003",
      medicationName: "Insulin Pen",
      currentStock: 8,
      threshold: 30,
      category: "Diabetes",
      expiryDate: "2024-06-15",
      priority: "warning",
      lastRestocked: "2023-12-15",
      supplier: "BioPharm",
    },
    {
      id: "SA004",
      medicationName: "Aspirin 325mg",
      currentStock: 2,
      threshold: 200,
      category: "Pain Relief",
      expiryDate: "2025-03-10",
      priority: "critical",
      lastRestocked: "2023-11-20",
      supplier: "MedSupply Co.",
    },
  ])

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.medicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.supplier.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleMarkResolved = (alertId: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId))
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>
      case "low":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Low Stock</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case "warning":
        return <TrendingDown className="w-5 h-5 text-yellow-600" />
      case "low":
        return <Package className="w-5 h-5 text-blue-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const criticalAlerts = alerts.filter((alert) => alert.priority === "critical").length
  const warningAlerts = alerts.filter((alert) => alert.priority === "warning").length
  const lowStockAlerts = alerts.filter((alert) => alert.priority === "low").length

  return (
    <PharmacyOwnerLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="animate-fade-in">
          <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">Stock Alerts</h1>
          <p className="text-gray-600">Monitor and manage low stock and critical inventory alerts</p>
        </div>

        {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Critical Alerts</p>
                  <h3 className="text-2xl font-bold text-red-600 mt-1">{criticalAlerts}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Warning Alerts</p>
                  <h3 className="text-2xl font-bold text-yellow-600 mt-1">{warningAlerts}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Low Stock</p>
                  <h3 className="text-2xl font-bold text-blue-600 mt-1">{lowStockAlerts}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search alerts by medication, category, or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert, index) => (
              <Card
                key={alert.id}
                className={`border-0 shadow-lg hover:shadow-xl transition-shadow animate-fade-in ${
                  alert.priority === "critical"
                    ? "border-l-4 border-l-red-500"
                    : alert.priority === "warning"
                      ? "border-l-4 border-l-yellow-500"
                      : "border-l-4 border-l-blue-500"
                }`}
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getPriorityIcon(alert.priority)}
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">{alert.medicationName}</CardTitle>
                        <p className="text-sm text-gray-600">Category: {alert.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">{getPriorityBadge(alert.priority)}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Current Stock</p>
                      <p className="text-2xl font-bold text-gray-900">{alert.currentStock}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Threshold</p>
                      <p className="text-2xl font-bold text-gray-900">{alert.threshold}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Days Until Expiry</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.ceil(
                          (new Date(alert.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                        )}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Stock Level</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.round((alert.currentStock / alert.threshold) * 100)}%
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Expires: {new Date(alert.expiryDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Last Restocked: {new Date(alert.lastRestocked).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <strong>Supplier:</strong> {alert.supplier}
                      </div>
                      <div>
                        <strong>Alert ID:</strong> {alert.id}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Button className="btn-primary flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Reorder Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleMarkResolved(alert.id)}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Resolved
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center text-gray-500">
                {searchQuery ? "No alerts found matching your search criteria" : "No stock alerts at this time"}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PharmacyOwnerLayout>
  )
}
