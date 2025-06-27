"use client"

import { useState } from "react"
import { Calendar, MapPin, Package, Check, X, Clock, Truck } from "lucide-react"
import { SupplierLayout } from "@/components/supplier-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Order {
  id: string
  pharmacyName: string
  pharmacyAddress: string
  orderDate: string
  requestedMeds: Array<{
    name: string
    quantity: number
    unit: string
  }>
  totalValue: number
  status: "pending" | "confirmed" | "ready_for_delivery" | "in_transit" | "delivered" | "rejected"
  urgency: "low" | "medium" | "high"
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD001",
      pharmacyName: "HealthPlus Pharmacy",
      pharmacyAddress: "123 Health St, Medical City, NY 12345",
      orderDate: "2024-01-15",
      requestedMeds: [
        { name: "Paracetamol 500mg", quantity: 100, unit: "tablets" },
        { name: "Ibuprofen 400mg", quantity: 50, unit: "tablets" },
      ],
      totalValue: 42.5,
      status: "pending",
      urgency: "high",
    },
    {
      id: "ORD002",
      pharmacyName: "MediCare Central",
      pharmacyAddress: "456 Care Ave, Health District, CA 90210",
      orderDate: "2024-01-14",
      requestedMeds: [
        { name: "Amoxicillin 250mg", quantity: 30, unit: "capsules" },
        { name: "Vitamin D3 1000IU", quantity: 60, unit: "capsules" },
      ],
      totalValue: 32.0,
      status: "confirmed",
      urgency: "medium",
    },
    {
      id: "ORD003",
      pharmacyName: "Wellness Pharmacy",
      pharmacyAddress: "789 Wellness Blvd, Care Center, TX 75001",
      orderDate: "2024-01-13",
      requestedMeds: [{ name: "Aspirin 325mg", quantity: 200, unit: "tablets" }],
      totalValue: 15.0,
      status: "ready_for_delivery",
      urgency: "low",
    },
  ])

  const filteredOrders = orders.filter(
    (order) =>
      order.pharmacyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.requestedMeds.some((med) => med.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleConfirmOrder = () => {
    if (!selectedOrder) return
    setOrders(orders.map((order) => (order.id === selectedOrder.id ? { ...order, status: "confirmed" } : order)))
    setIsConfirmDialogOpen(false)
    setSelectedOrder(null)
  }

  const handleRejectOrder = () => {
    if (!selectedOrder) return
    setOrders(orders.map((order) => (order.id === selectedOrder.id ? { ...order, status: "rejected" } : order)))
    setIsRejectDialogOpen(false)
    setSelectedOrder(null)
  }

  const handleMarkReady = (orderId: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "ready_for_delivery" } : order)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Confirmed</Badge>
      case "ready_for_delivery":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ready for Delivery</Badge>
      case "in_transit":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">In Transit</Badge>
      case "delivered":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Delivered</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Priority</Badge>
      case "low":
        return <Badge variant="outline">Low Priority</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const openConfirmDialog = (order: Order) => {
    setSelectedOrder(order)
    setIsConfirmDialogOpen(true)
  }

  const openRejectDialog = (order: Order) => {
    setSelectedOrder(order)
    setIsRejectDialogOpen(true)
  }

  return (
    <SupplierLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="animate-fade-in">
            <h1 className="font-heading text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600">Manage pharmacy orders and fulfillment requests</p>
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64"
            />
          </div>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Orders</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {orders.filter((o) => o.status === "pending").length}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Confirmed</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {orders.filter((o) => o.status === "confirmed").length}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Ready for Delivery</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {orders.filter((o) => o.status === "ready_for_delivery").length}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">In Transit</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {orders.filter((o) => o.status === "in_transit").length}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <Card
              key={order.id}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">{order.pharmacyName}</CardTitle>
                    <p className="text-sm text-gray-600">Order #{order.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getUrgencyBadge(order.urgency)}
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Order Date: {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {order.pharmacyAddress}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900">${order.totalValue.toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Requested Medications:</h4>
                  <div className="space-y-1">
                    {order.requestedMeds.map((med, medIndex) => (
                      <div key={medIndex} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{med.name}</span>
                        <span className="text-gray-600">
                          {med.quantity} {med.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.status === "pending" && (
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Button onClick={() => openConfirmDialog(order)} className="btn-primary flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Confirm Order
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => openRejectDialog(order)}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject Order
                    </Button>
                  </div>
                )}

                {order.status === "confirmed" && (
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Button onClick={() => handleMarkReady(order.id)} className="btn-secondary flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Mark Ready for Delivery
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filteredOrders.length === 0 && (
            <Card className="border-0 shadow-md">
              <CardContent className="p-8 text-center text-gray-500">
                No orders found matching your search criteria
              </CardContent>
            </Card>
          )}
        </div>

        {/* Confirm Order Dialog */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-green-600">Confirm Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to confirm order #{selectedOrder?.id} from {selectedOrder?.pharmacyName}? This
                will mark the order as confirmed and ready for preparation.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmOrder} className="btn-primary">
                Confirm Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Order Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Reject Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to reject order #{selectedOrder?.id} from {selectedOrder?.pharmacyName}? This
                action cannot be undone and the pharmacy will be notified.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleRejectOrder}>
                Reject Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SupplierLayout>
  )
}
